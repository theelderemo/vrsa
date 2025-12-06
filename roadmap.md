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
- ~~inline AI editing~~
- ~~export options~~

---

### Copyright / Plagarism Checker
Use https://www.copyscape.com/ api
username is theelderemo	 
API key is ewwv2xqycct3p9ch

Text Plagiarism Search Request
To check for copies of some text via the Copyscape API, send an HTTP POST request to either of these URLs:

http://www.copyscape.com/api/
https://www.copyscape.com/api/

The text to be searched and other parameters can be specified in one of two ways:

Form Encoded. Provide all parameter values as form-urlencoded data within the HTTP POST payload. This is how web browsers submit forms over HTTP, and will usually be easiest. If your scripting language lets you set up an HTTP POST request with a list of parameter values, it will probably build this form-urlencoded payload automatically.
Raw POST. Provide all parameters except the text to be searched (parameter t) on the URL (using urlencoding and ? and &, as if this was an HTTP GET). Provide the text itself in the raw HTTP POST payload data with no parameter name and no urlencoding. This method may be easier if you are building HTTP requests at a lower level, or using a command-line tool such as curl.
The parameters are as follows:

| **Parameter** | **Explanation** | **Value** | **Required?** | **Default** |
|:---:|:---:|:---:|:---:|:---:|
| u | Username | theelderemo | Yes | - |
| k | API key | ewwv2xqycct3p9ch | Yes | - |
| o | API operation | csearch (or psearch or cpsearch if you create a private index) | Yes | - |
| e | Text encoding | [encoding name] | Yes | - |
| t | Text to be searched | [the text] | Yes | - |
| c | Full comparisons | 0 to 10 | No | 0 |
| f | Response format | json or xml or html | No | xml |
| i | Ignore sites | [comma-delimited domains to ignore] | No | - |
| l | Spend limit | [value in dollars, e.g. 0.50] | No | - |
| x | Example test | 1 or omitted | No | - |

### version history
git-style tracking for lyrics. see what changed, roll back, branch different versions.

### genius grounding thing - is_pro = true to use "grounding" option
> [!NOTE]
> Will most likely use api calls to genius instead, as it's cheaper and faster.

need to add attribution ("inspired by X song" or "this flow pattern shows up in 47 songs") so we're not accidentally plagiarizing

-Genius API: https://docs.genius.com/

### collaboration features
- share projects with other users
- comment/feedback system
- real-time co-writing
- project folders/organization

### mobile-friendly improvements
responsive layout is okay but needs work. mobile keyboard handling, better touch targets.

### multi-agent stuff - is_pro = true
specialized agents instead of one generic AI:
- verse agent
- hook/chorus agent  
- editor agent
- flow coach agent

let them "debate" and show ranked options

### suno integration - is_pro = true
lyrics → actual music generation. edge function proxy, users bring their own tokens. beta label everything. auto-populate params from our analysis.

risk: unofficial API, could get shut down. legal gray area.

### integrations
quick wins: notion, google drive, discord webhooks, slack
music platforms: spotify, soundcloud, bandcamp, genius api
production: ableton link, daw plugins

### more writing tools
- Analyzer
- rhyme finder (https://www.datamuse.com/api/)
- wordplay suggester (double meanings, puns, etc)
- hook generator
- More to come

### community/social 
- forum by genre
- lyric battle arena (voting)
- collab matching system
- open verse challenges
- featured creator of the week
- user portfolios
- leaderboards/badges

### visual generation ideas  - is_pro = true
- social media assets (square/story sizes for instagram/twitter)
- music video storyboards
- vinyl/cassette mockups
- spotify canvas (3sec loops)
- genre-specific theme packs
- lyric typography art
- tour posters
- full AI music videos (azure)

### audio stuff   - is_pro = true
- midi export from lyric cadence
- bpm analyzer 
- beat pattern generator
- chord progression suggestions
- stem separation (upload track, isolate vocals)
- voice cloning 
- marketplace (user-uploaded instrumentals)

### future pro features to consider:
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

**genius dataset**: fair use argument (educational/transformative), not redistributing. academic precedent exists. alternative is self-scraping (riskier)

**suno integration**: unofficial/unsupported, would clearly label as beta, users provide own tokens (we're just UI wrapper), TOS gray area. mitigate with disclaimers.

**user content**: need plagiarism detection, copyright help, clear TOS on generated vs original content

