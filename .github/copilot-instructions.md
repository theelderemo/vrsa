# GitHub Copilot Instructions for VRS/A

## Project Overview

VRS/A is an AI-powered lyric writing tool built with React, Vite, and Supabase. The application helps songwriters create better lyrics by providing tools for ghostwriting, sandboxing, style analysis, and creative controls.

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Auth & Edge Functions)
- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics

## Global Behavior and Expectations

### Code Style and Standards

- Use modern ES6+ JavaScript syntax
- Follow React best practices and hooks patterns
- Use functional components exclusively
- Maintain consistent Tailwind CSS utility class ordering
- Follow existing ESLint configuration rules
- Use descriptive variable and function names

### Architecture Guidelines

- Keep components small and focused on a single responsibility
- Maintain clear separation between UI and business logic
- Use React hooks for state management
- Follow the existing project structure in `/src`
- Store reusable utilities in appropriate locations

### Privacy and Security

**CRITICAL**: This project prioritizes user privacy:
- NO tracking scripts, analytics pixels, or cookies should be added
- Supabase authentication is optional - core features must work without login
- Never log or transmit user-generated content unnecessarily
- Follow security best practices for API keys and sensitive data

### Testing and Quality

- Test changes locally with `npm run dev` before committing
- Run linting with `npm run lint` to catch issues
- Verify builds complete successfully with `npm run build`
- Test authentication flows when modifying auth-related code
- Verify responsive design on multiple screen sizes

### Documentation

- Update README.md if adding new features or changing setup steps
- Document complex logic with clear inline comments
- Keep comments focused and meaningful
- Update SECURITY.md for security-related changes

### Boundaries and Constraints

- **DO NOT** modify the core privacy principles (no tracking, no unnecessary cookies)
- **DO NOT** make the app require authentication for core features
- **DO NOT** add heavy dependencies without justification
- **DO NOT** change the aesthetic or tone without explicit approval
- **DO NOT** remove or modify Sentry error tracking configuration
- **ALWAYS** maintain backward compatibility with existing features
- **ALWAYS** consider performance impact of changes
- **ALWAYS** test authentication flows if touching auth code

### MCP Server Tools Available

The following MCP servers are configured for enhanced development:

- **Sequential Thinking**: For complex problem-solving and planning
- **Memory**: For maintaining context across conversations
- **Upstash Context7**: For advanced context management
- **Playwright**: For browser automation and testing
- **Chrome DevTools**: For debugging and performance analysis
- **Perplexity**: For research and information gathering
- **Sentry**: For error tracking and debugging

Use these tools appropriately based on the task at hand.

## Tone and Behavior

- Be direct and practical in suggestions
- Prioritize simplicity and maintainability
- Respect the project's rebellious, no-BS attitude
- Focus on user experience and creative workflow
- Ask clarifying questions when requirements are ambiguous
