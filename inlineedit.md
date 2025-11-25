# Inline Editor Feature Spec

Consolidated task document for the inline AI editing feature and all related writing tools.

---

## Overview

The inline editor lets users click any line in generated output and edit it directly with AI assistance. No more copy-paste-regenerate loops. This combines several roadmap items into one cohesive editing experience:
- Inline AI editing
- Rhyme finder (slant rhymes, assonance)
- Wordplay suggester (double meanings, puns)
- Idiom replacer (swap clichés)

---

## Task List

### 1. ✅ Add Persistent Memory to Chat
**Priority: HIGH - Foundation for all inline editing features**

Enable the AI model to retain context across editing sessions:

#### 1.1 Context Retention System
- [x] Add toggle control in UI for "Remember conversation context"
  - Default: OFF (privacy-first)
  - Store preference in user settings (supabase)
  - Clear visual indicator when memory is active
  
- [x] Implement conversation history storage
  - Store in supabase `chat_sessions` table with schema:
    ```sql
    - id (uuid, primary key)
    - user_id (uuid, foreign key)
    - project_id (uuid, foreign key, nullable)
    - messages (jsonb array)
    - context_window (int, default 10)
    - created_at (timestamp)
    - updated_at (timestamp)
    - expires_at (timestamp, auto-delete after 7 days)
    ```
  
- [x] Build context window management
  - Keep last N messages (configurable, default 10)
  - Token counting to stay within model limits
  - Automatic summarization when context gets too large
  - Smart truncation (keep system prompt + recent messages)

#### 1.2 Inline Edit
- [x] "Edit" mode after generation
  - Display last output with inline edit markers
  - Chat input stays active below output
  - AI can reference specific lines by number
  
- [x] Contextual commands
  - "Make line 3 more metaphorical"
  - "Rhyme line 5 with 'dreams'"
  - "Rewrite the hook to be catchier"
  - Parse natural language into structured edits
  
- [ ] Output diffing
  - Show what changed between iterations
  - Accept/reject individual changes
  - Undo/redo stack for edits

#### 1.3 Memory Management Controls
- [x] User controls:
  - "Clear conversation" button
  - "Start fresh" (resets context but keeps output)
  - Export conversation history (JSON)
  - Auto-clear after X minutes of inactivity
  
- [x] Privacy considerations:
  - End-to-end context (not shared across projects)
  - Clear disclaimers about data storage
  - One-click delete all history
  - Respect user's memory toggle preference

---

### 2. Inline Editing UI/UX

#### 2.1 Line-Level Interaction
- [ ] Make each line clickable/hoverable
  - Line numbers in gutter
  - Edit icon on hover
  - Click to activate inline editor
  
- [ ] Inline editor component
  - Text input overlays the line
  - AI suggestion mode vs. manual edit mode
  - Keyboard shortcuts (Cmd+E to edit, Esc to cancel)
  
- [ ] Selection modes
  - Single line edit
  - Multi-line selection (verse, chorus)
  - Highlight text within line for word-level edits

#### 2.2 AI-Assisted Editing Modes
- [ ] Quick actions dropdown per line:
  - "Improve this line"
  - "Find rhymes"
  - "Add wordplay"
  - "Make more [emotional/aggressive/smooth]"
  - "Replace cliché"
  - "Generate alternatives"
  
- [ ] Context-aware suggestions
  - Analyze surrounding lines
  - Maintain rhyme scheme consistency
  - Match syllable count/cadence
  - Preserve metaphor themes

---

### 3. Rhyme Finder Integration

#### 3.1 Rhyme Detection Engine
- [ ] Build rhyme matching logic
  - Perfect rhymes
  - Slant rhymes (consonance)
  - Assonance (vowel matching)
  - Multi-syllable rhymes
  - Internal rhymes
  
- [ ] Rhyme database/API
  - Consider RhymeBrain API or Datamuse API
  - Cache common rhymes locally
  - Fallback to phonetic matching

#### 3.2 Rhyme Suggestion UI
- [ ] Triggered when editing line ending
  - Sidebar panel with rhyme suggestions
  - Grouped by type (perfect/slant/assonance)
  - Show example usage in real songs (if grounding active)
  
- [ ] Interactive replacement
  - Click rhyme to replace word
  - AI rewrites line to incorporate rhyme
  - Preview changes before applying

---

### 4. Wordplay Suggester

#### 4.1 Wordplay Detection
- [ ] Analyze current lyrics for opportunities:
  - Homophone detection
  - Double meaning phrases
  - Punnable words
  - Metaphor extension possibilities
  
- [ ] AI-powered suggestions
  - "This word could have a double meaning..."
  - Suggest puns that fit context
  - Literary device recommendations

#### 4.2 Wordplay Injection
- [ ] Click word to see wordplay options
  - Puns that maintain meaning
  - Cultural references
  - Slang variations
  - Metaphorical alternatives
  
- [ ] Smart replacement
  - AI rewrites surrounding text if needed
  - Maintains flow and rhyme scheme
  - Explanation of wordplay shown

---

### 5. Idiom/Cliché Replacer

#### 6.1 Cliché Detection
- [ ] Build cliché database
  - Common phrases in lyrics
  - Overused metaphors
  - Generic expressions
  
- [ ] Real-time highlighting
  - Yellow underline for clichés
  - Hover to see why it's flagged
  - Severity rating

#### 6.2 Fresh Alternatives
- [ ] AI suggests replacements
  - Keep same meaning
  - More original phrasing
  - Genre-appropriate alternatives
  
- [ ] User can accept/reject
  - Learn from rejections (this cliché is intentional)
  - Build user's personal "allowed clichés" list

---

### 6. Technical Implementation

#### 6.1 Backend Infrastructure
- [ ] Extend existing API (`src/lib/api.js`)
  - New endpoints:
    - `POST /api/chat/continue` (with context)
    - `POST /api/inline/edit` (single line edit)
    - `POST /api/inline/suggest` (get alternatives)
    - `POST /api/rhyme/find` (rhyme finder)
    - `GET /api/chat/history/:sessionId`
  
- [ ] Context management service
  - Retrieve chat history from supabase
  - Build context window for AI
  - Append new messages
  - Update session timestamps

#### 6.2 Frontend Components
- [ ] Create new components:
  - `<InlineEditor>` - Main editing interface
  - `<EditableLine>` - Single line component
  - `<RhymeSidebar>` - Rhyme suggestions panel
  - `<WordplayTooltip>` - Inline wordplay hints
  - `<ChatContext>` - Persistent chat UI
  - `<MemoryToggle>` - Context retention control
  
- [ ] State management
  - Track editing session state
  - Manage undo/redo history
  - Sync with backend context
  - Handle optimistic updates

#### 6.3 Supabase Schema Updates
- [ ] Add tables:
  ```sql
  -- Chat sessions table
  CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NULL, -- Link to project if applicable
    messages JSONB NOT NULL DEFAULT '[]',
    context_window INT DEFAULT 10,
    memory_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days'
  );
  
  -- Edit history table
  CREATE TABLE edit_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    line_number INT,
    original_text TEXT,
    edited_text TEXT,
    edit_type VARCHAR(50), -- 'rhyme', 'wordplay', 'ai_suggest', 'manual'
    created_at TIMESTAMP DEFAULT NOW()
  );
  
  -- Indexes
  CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
  CREATE INDEX idx_chat_sessions_expires_at ON chat_sessions(expires_at);
  CREATE INDEX idx_edit_history_session_id ON edit_history(session_id);
  ```
  
- [ ] Set up RLS policies
  - Users can only access their own sessions
  - Auto-delete expired sessions (pg_cron job)

---

### 7. UI/UX Design Considerations

- **Non-intrusive**: Editing tools appear on hover/click, don't clutter default view
- **Keyboard-first**: Power users can edit without touching mouse
- **Mobile-friendly**: Touch targets, swipe actions, responsive layout
- **Visual feedback**: Loading states, success animations, error handling
- **Undo safety**: Easy to revert changes, clear change indicators
- **Performance**: Debounce AI requests, cache suggestions, optimize re-renders

---

### 8. Testing & Validation

- [ ] Unit tests for context management
- [ ] Integration tests for chat continuity
- [ ] Rhyme finder accuracy testing
- [ ] Wordplay suggestion quality checks
- [ ] Performance testing (large context windows)
- [ ] Mobile device testing
- [ ] Accessibility audit (keyboard nav, screen readers)

---

### 9. Rollout Strategy

1. **Phase 1**: Chat context + basic inline editing (manual text edits)
2. **Phase 2**: AI suggestions + rhyme finder
3. **Phase 3**: Wordplay + cliché replacer
4. **Phase 4**: Advanced features & optimizations
5. **Beta testing**: Studio Pass users first
6. **Public launch**: Gradual rollout with feature flags

---

## Success Metrics

- **User engagement**: % of users who use inline editor vs. full regeneration
- **Edit satisfaction**: Accept/reject ratio of AI suggestions
- **Context retention**: How often users enable memory toggle
- **Performance**: Average response time for inline edits (<2s target)
- **Accuracy**: Rhyme quality, wordplay relevance scores
- **Retention**: Do users with inline editor return more often?

---

## Open Questions

1. Should chat context persist across sessions (days later) or just within session?
2. How much context is too much? (Token cost vs. quality tradeoff)
3. Rhyme finder: Build in-house or use external API?
4. Privacy: End-to-end encryption for chat history?
5. Monetization: Is inline editor a pro feature or free tier?
6. Multi-language: Does rhyme finder need localization?

---

## Dependencies

- Supabase (database, auth)
- Azure OpenAI / Claude / DeepSeek (AI models)
- Potentially: RhymeBrain or Datamuse API (rhyme finder)
- Existing codebase: `src/lib/api.js`, `src/lib/supabase.js`, auth system

---

## Notes

- This consolidates multiple roadmap items into one cohesive feature
- Chat memory is the foundation—build this first before other inline tools
- Keep it modular: Each tool (rhyme, wordplay, etc.) should work independently
- Privacy-first: Make memory opt-in, not default
- Consider rate limiting for AI calls (especially free tier)
- Good candidate for feature flag rollout (test with small user group first)
