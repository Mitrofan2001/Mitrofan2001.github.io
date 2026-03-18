# Mitrofan.tw

This repository has been prepared to move from a checked-in static site export to a maintainable Hexo project.

## First-time setup

```bash
npm install
npm run migrate:posts
```

## Local development

```bash
npm run server
```

## Create a new post

```bash
npm run new -- "my-post-title"
```

If you prefer the official Hexo command style, use:

```bash
npx hexo new "my-post-title"
npx hexo server
```

New posts live in `source/_posts`.

## Build

```bash
npm run build
```

The generated static site is written to `public/`.
