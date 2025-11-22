src/
├── assets/                  # Keep SVGs and static images here
│
├── components/              # Reusable UI elements (buttons, inputs, layout)
│   ├── layout/
│   │   ├── Header.jsx       # Extracted from App.jsx
│   │   ├── Footer.jsx       # Extracted from App.jsx
│   │   └── MainLayout.jsx   # Wrapper for Header + Outlet + Footer
│   │
│   ├── ui/                  # Generic UI components
│   │   ├── Loader.jsx       # The loading spinner used in multiple places
│   │   └── CheckboxDropdown.jsx # Extracted from Ghostwriter
│   │
│   └── chat/
│       └── ChatMessage.jsx  # Extracted from Ghostwriter
│
├── contexts/                # Global state
│   ├── UserContext.js       # Existing
│   
│
├── hooks/                   # Custom hooks
│   └── useUser.js           # Existing
│
├── lib/                     # Configuration and external clients
│   ├── supabase.js          # Existing
│   └── api.js               # NEW: Move `callAI` and `generateSarcasticComment` here
│
├── pages/                   # The main views (formerly giant components in App.jsx)
│   ├── Landing.jsx          # The Hero/Landing section
│   ├── Auth.jsx             # existing Auth.jsx (Login/Signup)
│   ├── Guide.jsx            # The Field Manual
│   ├── Terms.jsx            # Terms of Service
│   │
│   ├── Ghostwriter/         # Folder for complex pages
│   │   ├── index.jsx        # The main Ghostwriter view
│   │   └── StructuredInputForm.jsx # The sidebar form extracted from Ghostwriter
│   │
│   ├── Analyzer/            # Folder for Analyzer
│       └── index.jsx        # The main Analyzer view
│  
│   
│
├── providers/               # Wrapper for all context providers
│   ├── UserProvider.jsx     # Existing
│   └── AppProviders.jsx     # NEW: A single component to wrap App with all providers
│
├── App.jsx                  # Cleaned up: Only handles Routing setup
├── main.jsx                 # Entry point
└── index.css                # Global styles
