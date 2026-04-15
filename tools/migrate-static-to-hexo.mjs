import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "source", "_posts");
const args = process.argv.slice(2);
const gitRef = args[0] === "--git-ref" ? args[1] : undefined;

function decodeHtml(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

function escapeYaml(value) {
  return String(value ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function slugFromPostPath(filePath) {
  return path.basename(path.dirname(filePath));
}

function permalinkFromPostPath(filePath) {
  const relativePath = path.relative(ROOT, filePath).split(path.sep).join("/");
  const match = relativePath.match(/^(\d{4}\/\d{2}\/\d{2}\/[^/]+)\/index\.html$/);
  return match ? `/${match[1]}/` : "";
}

function markdownFromHtml(html) {
  let output = html;
  const rawBlocks = [];
  const preserveRawBlock = value => {
    const token = `__RAW_BLOCK_${rawBlocks.length}__`;
    rawBlocks.push(value.trim());
    return `\n${token}\n`;
  };

  output = output.replace(/<figure class="highlight\s+(\w+)">[\s\S]*?<pre>([\s\S]*?)<\/pre>[\s\S]*?<\/figure>/g, (_, lang, code) => {
    const lines = decodeHtml(code.replace(/<span class="line">/g, "").replace(/<\/span><br>/g, "\n").replace(/<\/span>/g, "")).trimEnd();
    return `\n\`\`\`${lang}\n${lines}\n\`\`\`\n`;
  });

  output = output.replace(/<h([1-6]) id="[^"]*">[\s\S]*?<a [^>]*><\/a>(.*?)<\/h\1>/g, (_, level, text) => {
    return `\n${"#".repeat(Number(level))} ${stripTags(text)}\n`;
  });

  output = output.replace(/<div[^>]*style="[^"]*position:\s*relative[^"]*"[^>]*>\s*(<iframe[\s\S]*?<\/iframe>)\s*<\/div>/gi, (_, iframe) => {
    return preserveRawBlock(iframe);
  });

  output = output.replace(/<iframe[\s\S]*?<\/iframe>/gi, match => {
    return preserveRawBlock(match);
  });

  output = output.replace(/<img [^>]*src="([^"]+)"[^>]*>/g, match => {
    const srcMatch = match.match(/src="([^"]+)"/i);
    const altMatch = match.match(/alt="([^"]*)"/i);
    const src = srcMatch ? srcMatch[1] : "";
    const alt = altMatch ? decodeHtml(altMatch[1]) : "";
    return `![${alt}](${src})`;
  });

  output = output.replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => {
    return `[${stripTags(text)}](${href})`;
  });

  output = output.replace(/<br\s*\/?>/g, "\n");
  output = output.replace(/<hr\s*\/?>/g, "\n\n---\n\n");
  output = output.replace(/<\/p>\s*<p>/g, "\n\n");
  output = output.replace(/<p>/g, "");
  output = output.replace(/<\/p>/g, "\n");
  output = output.replace(/<li>([\s\S]*?)<\/li>/g, (_, text) => `- ${stripTags(text)}\n`);
  output = output.replace(/<\/?(ul|ol)>/g, "\n");
  output = output.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (_, text) => {
    return `\n> ${stripTags(text)}\n`;
  });
  output = output.replace(/<[^>]+>/g, "");
  output = decodeHtml(output);
  output = output.replace(/\n{3,}/g, "\n\n").trim();
  output = output.replace(/__RAW_BLOCK_(\d+)__/g, (_, index) => rawBlocks[Number(index)] ?? "");

  return `${output}\n`;
}

function listGitPostFiles(ref) {
  const files = execFileSync("git", ["ls-tree", "-r", "--name-only", ref], {
    cwd: ROOT,
    encoding: "utf8"
  });

  return files
    .split("\n")
    .filter(file => /^\d{4}\/\d{2}\/\d{2}\/[^/]+\/index\.html$/.test(file))
    .map(file => path.join(ROOT, file))
    .sort();
}

function readGitFile(ref, filePath) {
  const relativePath = path.relative(ROOT, filePath).split(path.sep).join("/");
  return execFileSync("git", ["show", `${ref}:${relativePath}`], {
    cwd: ROOT,
    encoding: "utf8"
  });
}

function extractAll(pattern, input) {
  const matches = [];
  let match;
  while ((match = pattern.exec(input)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

async function findPostFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (!/^\d{4}$/.test(entry.name)) continue;
    const yearDir = path.join(dir, entry.name);
    const months = await readdir(yearDir, { withFileTypes: true });
    for (const month of months) {
      if (!month.isDirectory()) continue;
      const monthDir = path.join(yearDir, month.name);
      const days = await readdir(monthDir, { withFileTypes: true });
      for (const day of days) {
        if (!day.isDirectory()) continue;
        const postDir = path.join(monthDir, day.name);
        const slugs = await readdir(postDir, { withFileTypes: true });
        for (const slug of slugs) {
          if (!slug.isDirectory()) continue;
          files.push(path.join(postDir, slug.name, "index.html"));
        }
      }
    }
  }
  return files.sort();
}

function extractPost(html, filePath) {
  const titleMatch = html.match(/<title>(.*?) \| Mitrofan\.tw<\/title>/);
  const publishedMatch = html.match(/article:published_time" content="([^"]+)"/);
  const updatedMatch = html.match(/article:modified_time" content="([^"]+)"/);
  const coverMatch = html.match(/property="og:image" content="([^"]+)"/);
  const categoryMatch = html.match(/<a class="post-meta-categories" href="[^"]+">([^<]+)<\/a>/);
  const tagMatches = extractAll(/property="article:tag" content="([^"]+)"/g, html);
  const articleMatch = html.match(/<article class="post-content" id="article-container">([\s\S]*?)<\/article>/);

  if (!titleMatch || !publishedMatch || !articleMatch) {
    throw new Error(`Unable to parse ${filePath}`);
  }

  const slug = slugFromPostPath(filePath);
  const permalink = permalinkFromPostPath(filePath);
  const title = decodeHtml(titleMatch[1]);
  const date = publishedMatch[1].replace("T", " ").replace(".000Z", "");
  const updated = updatedMatch ? updatedMatch[1].replace("T", " ").replace(".000Z", "") : date;
  const categories = categoryMatch ? [decodeHtml(categoryMatch[1]).replace(/_/g, " ")] : [];
  const tags = tagMatches.map(tag => decodeHtml(tag));
  const cover = coverMatch ? coverMatch[1].replace("https://mitrofan2001.github.io", "") : "";
  const body = markdownFromHtml(articleMatch[1]);

  return { slug, title, date, updated, categories, tags, cover, permalink, body };
}

function toFrontMatter(post) {
  return [
    "---",
    `title: "${escapeYaml(post.title)}"`,
    `date: ${post.date}`,
    `updated: ${post.updated}`,
    `tags: [${post.tags.map(tag => `"${escapeYaml(tag)}"`).join(", ")}]`,
    `categories: [${post.categories.map(category => `"${escapeYaml(category)}"`).join(", ")}]`,
    `cover: "${escapeYaml(post.cover)}"`,
    "comments: false",
    `permalink: ${post.permalink}`,
    "---",
    ""
  ].join("\n");
}

async function main() {
  await mkdir(POSTS_DIR, { recursive: true });
  const files = gitRef ? listGitPostFiles(gitRef) : await findPostFiles(ROOT);

  for (const file of files) {
    const html = gitRef ? readGitFile(gitRef, file) : await readFile(file, "utf8");
    const post = extractPost(html, file);
    const target = path.join(POSTS_DIR, `${post.slug}.md`);
    await writeFile(target, `${toFrontMatter(post)}${post.body}`, "utf8");
    console.log(`migrated ${path.relative(ROOT, target)}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
