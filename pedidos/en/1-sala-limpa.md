# Request 1 — Rebuild in a clean room

Use when the original is NOT yours. “Clean room” means the agent only uses what any visitor can see: the page open in a browser, screenshots, colors, measurements, and visible text. No code, internal files, or page source code.

**In Craft Anything:** choose “Clean room” (it’s the default) and paste the request into the “What do you want to make?” field.  
**With your direct agent (Claude Code, Codex, dsh):** paste the entire request into the chat.

```text
I want my own version of this app: <ORIGINAL ADDRESS>
Call it <NEW NAME>. Use my colors: <MAIN COLOR> and <ACCENT COLOR>.

Clean room rules:
- Study only what a visitor can see: open it in a browser, take screenshots at 1440, 820, and 390 px,
  measure colors, fonts, spacing, and block positions, and use the visible text as a reference.
- Do not read the original page’s source code, scripts, or internal files.
- Do not copy the original logo, photos, or text: write your own and design a simple logo.
- Build your version from scratch in a new folder (minha-versao/) and tell me how to open it.

Before saying you’re done:
- Compare it with the running original: node conferir/semelhanca.js <ORIGINAL ADDRESS> minha-versao/index.html
- Test every feature the original has (click, type, drag) and show me what happened.
```

Replace the text inside `< >`. If the app is yours (you have the code and want to study it internally), use Craft Anything’s Deep mode or REA — see the guide.