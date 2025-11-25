# vrsa roadmap

my working notes on where this thing is going

---

## what's actually working
- ~~album cover generator~~ (azure dall-e, flux 1.1 pro for studio pass)
- ~~artist avatar generator~~
- ~~logo generator~~
- ~~ghostwriter mode~~ (chat interface, structured prompts, suno meta-tag output)
- ~~analyzer mode~~ (style palette, suno tags, stat-sheet, rhyme analysis)
- ~~rhyme scheme controls~~ (density/complexity sliders, pattern dropdowns)
- ~~auth system~~ (supabase, username/email, cloudflare captcha)
- ~~studio pass~~ (buymeacoffee integration, premium models)
- ~~multiple AI models~~ (gpt, claude, deepseek options)
- ~~temperature/top_p controls~~
- ~~banned words filter~~
- ~~explicit language toggle~~
- ~~sarcastic AI comments~~ (every 2 generations lol)
- ~~error tracking~~ (sentry integration)
- ~~discord/reddit community~~

---

## building

### inline AI editing
let people click a line in the output and edit it directly with AI. no more copy-paste-regenerate loops.

### version history
git-style tracking for lyrics. see what changed, roll back, branch different versions.

### export options
pdf/docx with formatting, plain text, with metadata. batch export multiple projects.

### genius grounding thing (when budget allows)
hook up that 329k song dataset from hugging face. chunk it by verse/chorus, throw it in azure ai search with vector embeddings. when someone says "write like kendrick" it'll actually pull real examples instead of just guessing.
- https://huggingface.co/datasets/brunokreiner/genius-lyrics

need to add attribution ("inspired by X song" or "this flow pattern shows up in 47 songs") so we're not accidentally plagiarizing

### collaboration features
- share projects with other users
- comment/feedback system
- real-time co-writing
- project folders/organization

### mobile-friendly improvements
responsive layout is okay but needs work. mobile keyboard handling, better touch targets.

### multi-agent stuff
specialized agents instead of one generic AI:
- verse agent
- hook/chorus agent  
- editor agent
- flow coach agent
- copyright scanner agent

let them "debate" and show ranked options

### suno integration (maybe)
lyrics → actual music generation. edge function proxy, users bring their own tokens. beta label everything. auto-populate params from our analysis.

risk: unofficial API, could get shut down. legal gray area.

### integrations
quick wins: notion, google drive, discord webhooks, slack
music platforms: spotify, soundcloud, bandcamp, genius api
production: ableton link, daw plugins

### more writing tools
- rhyme finder (slant rhymes, assonance)
- wordplay suggester (double meanings, puns)
- hook generator (chorus-specific)
- idiom replacer (swap clichés)

### community/social 
- forum by genre
- lyric battle arena (voting)
- collab matching system
- open verse challenges
- featured creator of the week
- user portfolios
- leaderboards/badges

### visual generation ideas

- social media assets (square/story sizes for instagram/twitter)
- music video storyboards
- vinyl/cassette mockups
- spotify canvas (3sec loops)
- genre-specific theme packs
- lyric typography art
- tour posters
- full AI music videos (azure)

### audio stuff (way later)

- midi export from lyric cadence
- bpm analyzer based on flow
- beat pattern generator
- chord progression suggestions
- stem separation (upload track, isolate vocals)
- voice cloning (azure voice models for demos)
- beat marketplace (user-uploaded instrumentals)

## monetization / pro tier (current)

what studio pass gets you:
- premium AI models (flux 1.1 pro, better image gen)
- priority processing
- unlimited generations (free tier has daily caps)

future pro features to consider:
- api access for devs
- bulk generation (10+ variations at once)
- custom model training on your lyrics
- plagiarism checker
- copyright registration helper
- revenue split calculator (for collabs)

### accessibility stuff

- multi-language support (50+ languages via azure translator)
- dyslexia-friendly mode (special fonts)
- screen reader optimization
- high contrast themes
- keyboard shortcuts
- voice commands
- simplified UI mode
- cultural sensitivity filters

### legal stuff
**genius dataset**: fair use argument (educational/transformative), not redistributing. academic precedent exists. alternative is self-scraping (riskier)

**suno integration**: unofficial/unsupported, would clearly label as beta, users provide own tokens (we're just UI wrapper), TOS gray area. mitigate with disclaimers.

**user content**: need plagiarism detection, copyright help, clear TOS on generated vs original content

## stuff that's probably not happening

- nft lyrics (lol no)
- deepfake vocal previews (legal nightmare)
- full DAW integration (scope creep)
- label/A&R database (not my lane)
- marketplace economy (too complex to moderate)

## the vision

right now: lyric generation + analysis + basic visuals

end goal: idea → lyrics → music → visuals → distribution

but realistically: stay focused on making the best damn lyric tool. do one thing really well before spreading thin.

lock-in through:
- quality (better than chatgpt for lyrics)
- community (discord, shared projects)
- workflow (version control, templates, organization)
- exclusive features (suno integration if it works, grounding)