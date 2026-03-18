---
title: 2025 AI 趨勢與這篇文章的生成方式
comments: false
date: 2026-03-18 17:37:21
updated: 2026-03-18 17:37:21
tags:
  - AI
  - Hexo
  - Blog
categories:
  - Note
cover: /img/webimg/github-cover.jpg
---

這篇文章一方面整理 2025 年幾個我認為最明顯的 AI 發展方向，另一方面也記錄這篇文章是怎麼被生成、整理並放進這個 Hexo 部落格裡的。

## 2025 年 AI 趨勢

### 1. Agent 不再只是概念，而是變成正式產品能力

2025 年一個很明顯的方向，是各家平台都開始把「Agent」從展示型功能，推進成比較正式的開發能力。OpenAI 在 2025 年 3 月 11 日發布了 Responses API、內建 web search / file search / computer use，以及 Agents SDK，這代表 AI 已經不只是單輪對話，而是開始往多步驟執行、工具調用、可觀測的工作流前進。

對開發者來說，這代表未來做 AI 產品時，核心問題不只是 prompt 怎麼寫，而是怎麼設計工具鏈、狀態管理、權限、回傳格式與評估機制。

### 2. 長上下文與推理能力，開始變成主流賣點

OpenAI 在 2025 年 4 月 14 日推出 GPT-4.1 系列，明確強調更強的 coding、instruction following 與長上下文處理能力，並支援 1 million tokens context window。Google 也在 2025 年 3 月 25 日發布 Gemini 2.5 Pro，把 reasoning / thinking model 當成主軸來推。

這代表模型競爭已經不只是「會不會聊天」，而是：

- 能不能在長文件中維持一致性
- 能不能處理多步推理
- 能不能在 coding、數學、科學等任務中更穩定

對實務來說，這會直接影響文件分析、程式碼理解、RAG 品質，以及 AI 在真實專案裡是否可靠。

### 3. 小模型與成本效率變得更重要

GPT-4.1 同時推出了 `mini` 與 `nano`，Google 也在 2025 年持續強調 Flash / Flash-Lite 這類更重視速度與成本的模型。這反映出一個很現實的方向：不是所有場景都值得用最大模型。

未來常見做法會變成分層：

- 輕量任務交給便宜、快的小模型
- 複雜推理或高價值任務再交給高能力模型

這種 routing 策略會比「全站都上一個最強模型」更實用，也更接近商業可行性。

### 4. 開放協定與工具整合正在成形

Anthropic 在 2024 年 11 月 25 日公開 Model Context Protocol（MCP），而到 2025 年相關工具與活動已經明顯往這個方向集中。這件事的重要性在於：模型本身再強，如果不能穩定接資料源、開發工具、企業系統，它就很難真正進到工作流程。

所以 2025 年另一個關鍵趨勢，不只是模型變強，而是整個「模型 + 工具 + 協定 + 部署」的工程堆疊開始成熟。

## 我怎麼幫你生成這篇文章

這篇文章是我直接在你的本地專案中完成的，流程大致是這樣：

1. 先把你原本的靜態 GitHub Pages repo 整理成可維護的 Hexo 專案。
2. 確認 `source/_posts` 已經可以用 Markdown 維護文章。
3. 查官方資料，整理 2025 年 AI 趨勢的重點。
4. 直接把內容寫入這篇 Markdown，讓它能被 Hexo 生成。

這次生成內容時，我主要依據的是公開官方來源，而不是只靠記憶，因此文內趨勢判斷是有對照近期正式發布資訊的。

## 使用的模型與版本識別

這篇文章是由 Codex 中的 GPT-5 系列助理生成的。更精確地說，我目前能可靠描述的是：

- 助理型態：Codex
- 模型家族識別：GPT-5

至於你提到的「版本號」，目前這個介面沒有向我暴露可驗證的內部 build number 或更細的公開版本字串，所以我不會捏造一個假的版本號。若之後 OpenAI 在產品介面或 API 回應中提供可查的版本標識，再把它補進文章會比較準確。

## 參考資料

- OpenAI, New tools for building agents, 2025-03-11: <https://openai.com/index/new-tools-for-building-agents/>
- OpenAI, Introducing GPT-4.1 in the API, 2025-04-14: <https://openai.com/index/gpt-4-1/>
- Google, Gemini 2.5: Our most intelligent AI model, 2025-03-25: <https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025>
- Anthropic, Introducing the Model Context Protocol, 2024-11-25: <https://www.anthropic.com/news/model-context-protocol>
