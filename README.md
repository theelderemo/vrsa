# VRS/A

<div align="center">
  <img src="https://vrsa.vercel.app/vite.svg" alt="VRS/A Logo" width="120">
</div>

<p align="center">
  <strong>An AI lyric tool for people who are tired of AI lyrics that suck.</strong>
</p>

<p align="center">
  <strong><a href="https://vrsa.vercel.app/">Go Use It</a></strong>
</p>

---

This is the official repo for **VRS/A**. I built this because I was sick of AI writers giving me soulless, spaghetti-rhyme soup. This is my attempt to build an instrument, not just a content mill. It’s designed to be a co-writer that understands style, cadence, and the difference between a good rhyme and a lazy one.

It’s free, it’s probably buggy, and it’s built by one guy on a diet of caffeine and spite.

## So, What Does It Actually Do?

* **Ghostwriter Mode:** Tell it you want a verse in the style of "Kendrick on To Pimp a Butterfly" and it'll actually *try*.
* **The Sandbox:** Build songs like you're in a DAW. Drag-and-drop sections, set bar counts, control the lyrical density. This is where the real work happens.
* **Analyze an Artist's Soul:** Paste in lyrics from anyone and the **Style Palette** will tell you what makes them tick. For mimicry and theft (the legal kind).
* **Chaos Knobs:** Use the **Metaphor Density** and **Rhyme Complexity** sliders to go from Johnny Cash to Aesop Rock.
* **Avoid Clichés:** Use **Forbidden Words** to stop the AI from talking about shadows and mirrors.

## 🔒 Privacy First

VRS/A was built to be a creative tool, not a data-harvesting machine.
* **Zero Trackers:** No Google Analytics, no marketing pixels, no tracking scripts of any kind.
* **No Cookies:** The site does not store any cookies in your browser.
* **Optional Login:** User accounts (via Supabase) are only required for features like creating and sharing Style Kits. The core tools are accessible without an account.

## The Tech Stack (What Holds It Together)

* **Frontend:** React / Vite
* **Styling:** Tailwind CSS
* **Backend:** Supabase (for auth and the AI magic via Edge Functions)

## You Wanna Run This Thing Locally?

Sure. Knock yourself out. You will need your own ai model or such, either local ran or azure based, to run this on your own.

1.  Clone it: `git clone https://github.com/theelderemo/vrsatest.git`
2.  Install the dependencies: `npm install`
3.  You'll need a `.env` file with your own Supabase keys. Good luck.
    ```
    VITE_SUPABASE_URL=...
    VITE_SUPABASE_ANON_KEY=...
    ```
4.  Fire it up: `npm run dev`

## The Community (The Real Reason We're Here)

The real feedback happens here. The mods on Reddit hate free tools, so we made our own clubhouse.

* **Discord:** [[Discord Server]](https://discord.gg/K3kTQPhh)
* **Subreddit:** [[r/vrsa]](https://www.reddit.com/r/VRSA/)

## Keep The Lights On

This thing runs on fumes and the occasional tip. If it helps you break a writer's block or you just want to fund my next burnout, it's appreciated.

<a href="https://coff.ee/vrsa" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

