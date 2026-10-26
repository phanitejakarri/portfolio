// Architecture diagrams in the spirit of gitdiagram.com: each box is a real file or
// service in the repo, and clicking a box opens that file on GitHub.
// Coordinates live on a 960-unit-wide canvas; boxes default to 160 x 58.

export type NodeKind = "client" | "server" | "data" | "ext" | "code";

export type DNode = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w?: number;
  kind: NodeKind;
  path?: string; // file inside the repo
  repo?: string; // overrides the diagram's repo for this node
};

export type DGroup = { label: string; ids: string[] };
export type DEdge = { from: string; to: string; label?: string };
export type Diagram = { repo: string; nodes: DNode[]; groups: DGroup[]; edges: DEdge[] };

const ai: Diagram = {
  repo: "chatGPT-clone",
  nodes: [
    { id: "live", label: "Phani's AI", sub: "React · Gemini-style UI", x: 40, y: 60, kind: "client" },
    { id: "form", label: "Prompt form", sub: "client/index.html", x: 400, y: 60, kind: "client", path: "client/index.html" },
    { id: "script", label: "script.js", sub: "loader · typing effect", x: 720, y: 60, kind: "code", path: "client/script.js" },
    { id: "cards", label: "Suggestion cards", sub: "recent prompts sidebar", x: 40, y: 220, kind: "code" },
    { id: "server", label: "server.js", sub: "Express · POST /", x: 560, y: 220, kind: "server", path: "server/server.js" },
    { id: "gemini", label: "Gemini API", sub: "generateContent", x: 40, y: 380, kind: "ext" },
    { id: "openai", label: "OpenAI", sub: "completions API", x: 560, y: 380, kind: "ext" },
  ],
  groups: [
    { label: "Live app · Netlify", ids: ["live", "cards"] },
    { label: "Vanilla JS client · Vite", ids: ["form", "script"] },
    { label: "Node server", ids: ["server"] },
    { label: "Models", ids: ["gemini", "openai"] },
  ],
  edges: [
    { from: "live", to: "cards" },
    { from: "cards", to: "gemini", label: "prompt" },
    { from: "form", to: "script", label: "submit" },
    { from: "script", to: "server", label: "fetch POST" },
    { from: "server", to: "openai", label: "createCompletion" },
  ],
};

const chat: Diagram = {
  repo: "teamschat-app",
  nodes: [
    { id: "login", label: "LoginForm", sub: "username · secret", x: 40, y: 60, kind: "client", path: "src/components/LoginForm.jsx" },
    { id: "app", label: "App.js", sub: "ChatEngine shell", x: 400, y: 60, kind: "client", path: "src/App.js" },
    { id: "feed", label: "ChatFeed", sub: "messages · read receipts", x: 720, y: 60, kind: "client", path: "src/components/ChatFeed.jsx" },
    { id: "session", label: "localStorage", sub: "saved session", x: 40, y: 220, kind: "data", path: "src/components/LoginForm.jsx" },
    { id: "mine", label: "MyMessage", sub: "own bubbles", x: 560, y: 220, kind: "code", path: "src/components/MyMessage.jsx" },
    { id: "theirs", label: "TheirMessage", sub: "avatar · grouping", x: 760, y: 220, kind: "code", path: "src/components/TheirMessage.jsx" },
    { id: "form", label: "MessageForm", sub: "text · attachments", x: 380, y: 220, kind: "code", path: "src/components/MessageForm.jsx" },
    { id: "engine", label: "ChatEngine API", sub: "sockets · chats · users", x: 400, y: 380, w: 180, kind: "ext" },
  ],
  groups: [
    { label: "React app · Netlify", ids: ["login", "app", "feed"] },
    { label: "Chat components", ids: ["mine", "theirs", "form"] },
    { label: "Session", ids: ["session"] },
    { label: "Real-time backend", ids: ["engine"] },
  ],
  edges: [
    { from: "login", to: "session", label: "save" },
    { from: "login", to: "app", label: "reload" },
    { from: "app", to: "feed", label: "renderChatFeed" },
    { from: "feed", to: "mine" },
    { from: "feed", to: "theirs" },
    { from: "feed", to: "form" },
    { from: "form", to: "engine", label: "sendMessage" },
    { from: "app", to: "engine", label: "live updates" },
  ],
};

const linkedin: Diagram = {
  repo: "Linkedin-clone",
  nodes: [
    { id: "login", label: "Login / Register", sub: "src/Pages/Login.jsx", x: 40, y: 60, kind: "client", path: "src/Pages/Login.jsx" },
    { id: "home", label: "Home feed", sub: "posts · likes · comments", x: 260, y: 60, w: 180, kind: "client", path: "src/components/HomeComponent.jsx" },
    { id: "profile", label: "Profile", sub: "edit · photo upload", x: 500, y: 60, kind: "client", path: "src/components/ProfileComponent.jsx" },
    { id: "conn", label: "Connections", sub: "find people", x: 740, y: 60, kind: "client", path: "src/components/ConnectionsComponent.jsx" },
    { id: "routes", label: "Routes", sub: "createBrowserRouter", x: 40, y: 220, kind: "code", path: "src/Routes/index.jsx" },
    { id: "authapi", label: "AuthAPI.jsx", sub: "email · Google sign-in", x: 260, y: 220, w: 180, kind: "code", path: "src/api/AuthAPI.jsx" },
    { id: "fsapi", label: "FirestoreAPI.jsx", sub: "onSnapshot listeners", x: 500, y: 220, kind: "code", path: "src/api/FirestoreAPI.jsx" },
    { id: "upload", label: "ImageUpload.jsx", sub: "resumable uploads", x: 740, y: 220, kind: "code", path: "src/api/ImageUpload.jsx" },
    { id: "auth", label: "Firebase Auth", sub: "users", x: 260, y: 380, kind: "data" },
    { id: "fs", label: "Cloud Firestore", sub: "posts · likes · connections", x: 480, y: 380, w: 200, kind: "data" },
    { id: "storage", label: "Firebase Storage", sub: "profile & post images", x: 740, y: 380, kind: "data" },
  ],
  groups: [
    { label: "React + Sass · Vite", ids: ["login", "home", "profile", "conn"] },
    { label: "Routing & API modules", ids: ["routes", "authapi", "fsapi", "upload"] },
    { label: "Firebase", ids: ["auth", "fs", "storage"] },
  ],
  edges: [
    { from: "routes", to: "login" },
    { from: "login", to: "authapi", label: "sign in" },
    { from: "home", to: "fsapi", label: "post · like" },
    { from: "profile", to: "upload", label: "photo" },
    { from: "conn", to: "fsapi" },
    { from: "authapi", to: "auth" },
    { from: "fsapi", to: "fs", label: "real-time" },
    { from: "upload", to: "storage" },
    { from: "upload", to: "fsapi", label: "save link" },
  ],
};

const shop: Diagram = {
  repo: "",
  nodes: [
    { id: "header", label: "Header", sub: "search · cart count", x: 40, y: 60, kind: "client" },
    { id: "home", label: "Home page", sub: "route /", x: 400, y: 60, kind: "client" },
    { id: "cart", label: "Cart page", sub: "route /cart", x: 740, y: 60, kind: "client" },
    { id: "slider", label: "Hero slider", sub: "offers carousel", x: 40, y: 220, kind: "code" },
    { id: "rows", label: "Product rows", sub: "flash deals · arrivals", x: 260, y: 220, w: 180, kind: "code" },
    { id: "card", label: "Product card", sub: "badge · rating · add", x: 500, y: 220, kind: "code" },
    { id: "qty", label: "Quantity controls", sub: "add · decrease · total", x: 740, y: 220, w: 180, kind: "code" },
    { id: "data", label: "Product data", sub: "categories · deals", x: 260, y: 380, w: 180, kind: "data" },
    { id: "state", label: "Cart state", sub: "items · quantities", x: 600, y: 380, kind: "data" },
  ],
  groups: [
    { label: "React SPA · Netlify", ids: ["header", "home", "cart"] },
    { label: "Components", ids: ["slider", "rows", "card", "qty"] },
    { label: "State & data", ids: ["data", "state"] },
  ],
  edges: [
    { from: "home", to: "slider" },
    { from: "home", to: "rows" },
    { from: "rows", to: "card" },
    { from: "data", to: "rows", label: "feeds" },
    { from: "card", to: "state", label: "addToCart" },
    { from: "cart", to: "qty" },
    { from: "qty", to: "state", label: "update" },
    { from: "state", to: "header", label: "count" },
  ],
};

const inpaint: Diagram = {
  repo: "taskdone",
  nodes: [
    { id: "upload", label: "ImageUpload", sub: "drag & drop", x: 40, y: 60, kind: "client", path: "src/components/ImageUpload.tsx" },
    { id: "canvas", label: "Canvas", sub: "paint the mask", x: 400, y: 60, kind: "client", path: "src/components/Canvas/Canvas.tsx" },
    { id: "preview", label: "ImagePreview", sub: "result · mask", x: 740, y: 60, kind: "client", path: "src/components/ImagePreview/ImagePreview.tsx" },
    { id: "controls", label: "CanvasControls", sub: "brush size · clear", x: 220, y: 220, kind: "code", path: "src/components/Canvas/CanvasControls.tsx" },
    { id: "hook", label: "useCanvas", sub: "Fabric.js · export mask", x: 420, y: 220, kind: "code", path: "src/hooks/useCanvas.ts" },
    { id: "blur", label: "useBlurEffect", sub: "blur slider", x: 740, y: 220, kind: "code", path: "src/hooks/useBlurEffect.ts" },
    { id: "fabric", label: "Fabric.js", sub: "PencilBrush canvas", x: 260, y: 380, kind: "ext" },
    { id: "proc", label: "imageProcessing.ts", sub: "apply inside mask", x: 520, y: 380, w: 180, kind: "server", path: "src/utils/imageProcessing.ts" },
    { id: "dl", label: "download.ts", sub: "PNG export", x: 760, y: 380, kind: "data", path: "src/utils/download.ts" },
  ],
  groups: [
    { label: "React + TypeScript · Vite", ids: ["upload", "canvas", "preview"] },
    { label: "Hooks & controls", ids: ["controls", "hook", "blur"] },
    { label: "Processing", ids: ["fabric", "proc", "dl"] },
  ],
  edges: [
    { from: "upload", to: "canvas", label: "image" },
    { from: "controls", to: "hook" },
    { from: "canvas", to: "hook" },
    { from: "hook", to: "fabric" },
    { from: "hook", to: "preview", label: "mask PNG" },
    { from: "preview", to: "blur" },
    { from: "blur", to: "proc" },
    { from: "proc", to: "dl" },
  ],
};

const airbnb: Diagram = {
  repo: "",
  nodes: [
    { id: "nav", label: "Navbar", sub: "search · user menu", x: 40, y: 60, kind: "client" },
    { id: "cats", label: "Categories bar", sub: "beach · castles · camping", x: 260, y: 60, w: 190, kind: "client" },
    { id: "grid", label: "Listings grid", sub: "price per night", x: 510, y: 60, kind: "client" },
    { id: "rent", label: "Airbnb your home", sub: "create a listing", x: 750, y: 60, w: 170, kind: "client" },
    { id: "auth", label: "NextAuth", sub: "/api/auth", x: 40, y: 220, kind: "server" },
    { id: "rsc", label: "App Router", sub: "server components", x: 380, y: 220, kind: "server" },
    { id: "fav", label: "Favourites", sub: "heart toggle", x: 620, y: 220, kind: "code" },
    { id: "oauth", label: "Google · GitHub", sub: "OAuth providers", x: 40, y: 380, kind: "ext" },
    { id: "db", label: "Database", sub: "users · listings", x: 500, y: 380, kind: "data" },
  ],
  groups: [
    { label: "Next.js UI", ids: ["nav", "cats", "grid", "rent"] },
    { label: "Next.js server · Vercel", ids: ["auth", "rsc", "fav"] },
    { label: "Services", ids: ["oauth", "db"] },
  ],
  edges: [
    { from: "nav", to: "auth", label: "sign in" },
    { from: "auth", to: "oauth" },
    { from: "cats", to: "rsc", label: "filter" },
    { from: "rsc", to: "grid", label: "render" },
    { from: "grid", to: "fav" },
    { from: "rent", to: "rsc", label: "new listing" },
    { from: "rsc", to: "db" },
    { from: "fav", to: "db" },
  ],
};

const cert: Diagram = {
  repo: "",
  nodes: [
    { id: "form", label: "Details form", sub: "student · course · grade", x: 40, y: 60, w: 190, kind: "client" },
    { id: "preview", label: "Certificate preview", sub: "Certificate of Completion", x: 380, y: 60, w: 200, kind: "client" },
    { id: "theme", label: "Theme toggle", sub: "light / dark", x: 740, y: 60, kind: "client" },
    { id: "state", label: "Form state", sub: "React useState", x: 40, y: 220, kind: "data" },
    { id: "h2c", label: "html2canvas", sub: "DOM → canvas", x: 400, y: 220, kind: "ext" },
    { id: "png", label: "certificate.png", sub: "toDataURL · download", x: 740, y: 220, kind: "data" },
  ],
  groups: [
    { label: "React + Tailwind · Netlify", ids: ["form", "preview", "theme"] },
    { label: "Render & export", ids: ["state", "h2c", "png"] },
  ],
  edges: [
    { from: "form", to: "state" },
    { from: "state", to: "preview", label: "live preview" },
    { from: "preview", to: "h2c", label: "Generate" },
    { from: "h2c", to: "png" },
  ],
};

const humanizer: Diagram = {
  repo: "ProdYis",
  nodes: [
    { id: "app", label: "App.jsx", sub: "humanizer chat UI", x: 120, y: 60, kind: "client", path: "src/App.jsx" },
    { id: "chat", label: "Chat.jsx", sub: "stream reader", x: 400, y: 60, kind: "client", path: "src/Chat.jsx" },
    { id: "side", label: "Sidebar.jsx", sub: "skills manager", x: 680, y: 60, kind: "client", path: "src/Sidebar.jsx" },
    { id: "ask", label: "POST /ask", sub: "chunked text response", x: 260, y: 220, kind: "server" },
    { id: "skills", label: "/skills API", sub: "list · upload · toggle", x: 600, y: 220, kind: "server" },
    { id: "llm", label: "Language model", sub: "rewrite prompt", x: 260, y: 380, kind: "ext" },
    { id: "store", label: "Skill packages", sub: ".zip · enabled flag", x: 600, y: 380, kind: "data" },
  ],
  groups: [
    { label: "React 19 + Tailwind 4 · Vite", ids: ["app", "chat", "side"] },
    { label: "Backend API (VITE_API_URL)", ids: ["ask", "skills"] },
    { label: "Model & storage", ids: ["llm", "store"] },
  ],
  edges: [
    { from: "app", to: "ask", label: "prompt" },
    { from: "ask", to: "chat", label: "streamed tokens" },
    { from: "side", to: "skills", label: "upload .zip / toggle" },
    { from: "ask", to: "llm" },
    { from: "skills", to: "store" },
    { from: "store", to: "llm", label: "enabled skills" },
  ],
};

const workout: Diagram = {
  repo: "Workout-Application-Backend",
  nodes: [
    { id: "home", label: "Home.js", sub: "workout list", x: 40, y: 60, kind: "client", repo: "Workout-Application-frontend", path: "src/pages/Home.js" },
    { id: "form", label: "WorkoutForm", sub: "title · load · reps", x: 260, y: 60, kind: "client", repo: "Workout-Application-frontend", path: "src/components/WorkoutForm.js" },
    { id: "details", label: "WorkoutDetails", sub: "card · delete", x: 480, y: 60, kind: "client", repo: "Workout-Application-frontend", path: "src/components/WorkoutDetails.js" },
    { id: "ctx", label: "WorkoutsContext", sub: "useReducer store", x: 720, y: 60, kind: "code", repo: "Workout-Application-frontend", path: "src/context/WorkoutsContext.js" },
    { id: "server", label: "server.js", sub: "Express · JSON", x: 40, y: 220, kind: "server", path: "server.js" },
    { id: "routes", label: "routes/workouts.js", sub: "GET · POST · PATCH · DELETE", x: 260, y: 220, w: 200, kind: "server", path: "routes/workouts.js" },
    { id: "ctrl", label: "workoutController", sub: "validation · 400 / 404", x: 520, y: 220, w: 180, kind: "server", path: "contollers/workoutController.js" },
    { id: "model", label: "workoutModel.js", sub: "Mongoose schema", x: 520, y: 380, w: 180, kind: "code", path: "models/workoutModel.js" },
    { id: "db", label: "MongoDB", sub: "workouts", x: 780, y: 380, kind: "data" },
  ],
  groups: [
    { label: "React frontend", ids: ["home", "form", "details", "ctx"] },
    { label: "Express API", ids: ["server", "routes", "ctrl"] },
    { label: "Data", ids: ["model", "db"] },
  ],
  edges: [
    { from: "home", to: "server", label: "GET /api/workouts" },
    { from: "form", to: "routes", label: "POST" },
    { from: "details", to: "ctrl", label: "DELETE" },
    { from: "form", to: "ctx", label: "dispatch" },
    { from: "server", to: "routes" },
    { from: "routes", to: "ctrl" },
    { from: "ctrl", to: "model" },
    { from: "model", to: "db" },
  ],
};

const dashboard: Diagram = {
  repo: "react-dash",
  nodes: [
    { id: "layout", label: "BaseLayout", sub: "sidebar + outlet", x: 40, y: 60, kind: "client", path: "src/layout/BaseLayout.jsx" },
    { id: "sidebar", label: "Sidebar", sub: "nav · collapse", x: 260, y: 60, kind: "client", path: "src/components/sidebar/Sidebar.jsx" },
    { id: "screen", label: "DashboardScreen", sub: "page composition", x: 500, y: 60, w: 170, kind: "client", path: "src/screens/dashboard/DashboardScreen.jsx" },
    { id: "theme", label: "ThemeContext", sub: "light / dark", x: 760, y: 60, kind: "code", path: "src/context/ThemeContext.jsx" },
    { id: "cards", label: "AreaCards", sub: "KPI donuts", x: 40, y: 220, kind: "code", path: "src/components/dashboard/areaCards/AreaCards.jsx" },
    { id: "bar", label: "AreaBarChart", sub: "24h vs 7d", x: 260, y: 220, kind: "code", path: "src/components/dashboard/areaCharts/AreaBarChart.jsx" },
    { id: "prog", label: "AreaProgressChart", sub: "targets", x: 480, y: 220, w: 170, kind: "code", path: "src/components/dashboard/areaCharts/AreaProgressChart.jsx" },
    { id: "table", label: "AreaTable", sub: "recent orders", x: 720, y: 220, kind: "code", path: "src/components/dashboard/areaTable/AreaTable.jsx" },
    { id: "recharts", label: "Recharts", sub: "BarChart · Tooltip", x: 260, y: 380, kind: "ext" },
    { id: "sctx", label: "SidebarContext", sub: "open / closed", x: 560, y: 380, kind: "data", path: "src/context/SidebarContext.jsx" },
  ],
  groups: [
    { label: "React + Sass · Vite", ids: ["layout", "sidebar", "screen", "theme"] },
    { label: "Dashboard widgets", ids: ["cards", "bar", "prog", "table"] },
    { label: "Libraries & state", ids: ["recharts", "sctx"] },
  ],
  edges: [
    { from: "layout", to: "sidebar" },
    { from: "layout", to: "screen" },
    { from: "screen", to: "cards" },
    { from: "screen", to: "bar" },
    { from: "screen", to: "prog" },
    { from: "screen", to: "table" },
    { from: "bar", to: "recharts" },
    { from: "sidebar", to: "sctx" },
    { from: "theme", to: "table", label: "restyle" },
  ],
};

const spotify: Diagram = {
  repo: "spotify-clone",
  nodes: [
    { id: "login", label: "Login.js", sub: "Log in with Spotify", x: 40, y: 60, kind: "client", path: "src/Login.js" },
    { id: "app", label: "App.js", sub: "token from URL hash", x: 300, y: 60, kind: "client", path: "src/App.js" },
    { id: "player", label: "Player.js", sub: "sidebar · body · footer", x: 560, y: 60, w: 180, kind: "client", path: "src/Player.js" },
    { id: "body", label: "Body.js", sub: "Discover Weekly", x: 800, y: 60, w: 130, kind: "client", path: "src/Body.js" },
    { id: "auth", label: "spotify.js", sub: "loginUrl · scopes", x: 40, y: 220, kind: "code", path: "src/spotify.js" },
    { id: "layer", label: "DataLayer.js", sub: "Context provider", x: 300, y: 220, kind: "code", path: "src/DataLayer.js" },
    { id: "reducer", label: "reducer.js", sub: "user · playlists · token", x: 560, y: 220, w: 180, kind: "code", path: "src/reducer.js" },
    { id: "accounts", label: "Spotify Accounts", sub: "OAuth implicit grant", x: 40, y: 380, w: 170, kind: "ext" },
    { id: "api", label: "Spotify Web API", sub: "getMe · getPlaylist", x: 400, y: 380, w: 170, kind: "ext" },
  ],
  groups: [
    { label: "React (CRA) · Material UI", ids: ["login", "app", "player", "body"] },
    { label: "Auth & state", ids: ["auth", "layer", "reducer"] },
    { label: "Spotify", ids: ["accounts", "api"] },
  ],
  edges: [
    { from: "login", to: "auth" },
    { from: "auth", to: "accounts", label: "redirect" },
    { from: "app", to: "api", label: "spotify-web-api-js" },
    { from: "app", to: "layer", label: "dispatch" },
    { from: "layer", to: "reducer" },
    { from: "app", to: "player" },
    { from: "player", to: "body" },
  ],
};

const coinflip: Diagram = {
  repo: "Bchain-H-T",
  nodes: [
    { id: "home", label: "Home", sub: "heads / tails · bet", x: 40, y: 60, kind: "client", path: "src/pages/home/index.jsx" },
    { id: "admin", label: "Admin", sub: "Pact console", x: 260, y: 60, kind: "client", path: "src/pages/admin/index.jsx" },
    { id: "modal", label: "ConnectWalletModal", sub: "pick a wallet", x: 500, y: 60, w: 190, kind: "client", path: "src/kda-wallet/components/ConnectWalletModal.jsx" },
    { id: "toasts", label: "TxToastManager", sub: "tx status toasts", x: 760, y: 60, kind: "client", path: "src/components/tx_and_toasts/TxToastManager.jsx" },
    { id: "code", label: "CodeBlock", sub: "Monaco editor", x: 260, y: 220, kind: "code", path: "src/components/tiles/code_block/CodeBlock.jsx" },
    { id: "slice", label: "kadenaSlice", sub: "Redux Toolkit", x: 500, y: 220, w: 190, kind: "code", path: "src/kda-wallet/store/kadenaSlice.jsx" },
    { id: "pact", label: "pact/utils", sub: "build · sign · listen", x: 760, y: 220, kind: "server", path: "src/pact/utils/utils.js" },
    { id: "wallets", label: "X-Wallet · Zelcore", sub: "providers.js", x: 260, y: 380, w: 180, kind: "ext", path: "src/kda-wallet/providers/providers.js" },
    { id: "chain", label: "Chainweb", sub: "api.chainweb.com", x: 620, y: 380, kind: "ext" },
  ],
  groups: [
    { label: "React + Tailwind · Vercel", ids: ["home", "admin", "modal", "toasts"] },
    { label: "State & Pact", ids: ["code", "slice", "pact"] },
    { label: "Kadena", ids: ["wallets", "chain"] },
  ],
  edges: [
    { from: "home", to: "slice", label: "flip" },
    { from: "admin", to: "code" },
    { from: "code", to: "slice", label: "run / send" },
    { from: "modal", to: "slice", label: "connect" },
    { from: "slice", to: "pact" },
    { from: "slice", to: "wallets", label: "sign" },
    { from: "pact", to: "chain", label: "send · listen" },
    { from: "pact", to: "toasts" },
  ],
};

const car: Diagram = {
  repo: "car-game",
  nodes: [
    { id: "keys", label: "Keyboard input", sub: "steer · accelerate · coin", x: 40, y: 60, w: 190, kind: "client", path: "index.html" },
    { id: "loop", label: "update(step)", sub: "requestAnimationFrame loop", x: 400, y: 60, w: 200, kind: "code", path: "index.html" },
    { id: "hud", label: "HUD", sub: "score · lap · time", x: 760, y: 60, kind: "client", path: "index.html" },
    { id: "road", label: "drawQuad()", sub: "perspective road", x: 220, y: 220, kind: "code", path: "index.html" },
    { id: "sprites", label: "Sprites", sub: "traffic · palm trees", x: 560, y: 220, kind: "code", path: "index.html" },
    { id: "hs", label: "updateHighscore()", sub: "best score", x: 760, y: 380, w: 170, kind: "data", path: "index.html" },
  ],
  groups: [
    { label: "index.html · vanilla JS", ids: ["keys", "loop", "hud", "road", "sprites"] },
    { label: "Persistence", ids: ["hs"] },
  ],
  edges: [
    { from: "keys", to: "loop" },
    { from: "loop", to: "road", label: "draw" },
    { from: "loop", to: "sprites", label: "move" },
    { from: "loop", to: "hud" },
    { from: "hud", to: "hs", label: "game over" },
  ],
};

const weather: Diagram = {
  repo: "",
  nodes: [
    { id: "search", label: "City search", sub: "Enter City…", x: 40, y: 60, kind: "client" },
    { id: "main", label: "Current card", sub: "icon · temperature", x: 400, y: 60, kind: "client" },
    { id: "unit", label: "°C / °F toggle", sub: "metric · imperial", x: 760, y: 60, kind: "client" },
    { id: "fetch", label: "API request", sub: "async · loading", x: 220, y: 220, kind: "code" },
    { id: "tiles", label: "Detail tiles", sub: "wind · pressure · humidity", x: 580, y: 220, w: 190, kind: "code" },
    { id: "owm", label: "OpenWeather API", sub: "/data/2.5/weather", x: 220, y: 380, w: 180, kind: "ext" },
  ],
  groups: [
    { label: "React · Netlify", ids: ["search", "main", "unit"] },
    { label: "Data flow", ids: ["fetch", "tiles"] },
    { label: "External", ids: ["owm"] },
  ],
  edges: [
    { from: "search", to: "fetch", label: "q=city" },
    { from: "unit", to: "fetch", label: "units" },
    { from: "fetch", to: "owm" },
    { from: "fetch", to: "main" },
    { from: "fetch", to: "tiles" },
  ],
};

export const diagrams = { ai, chat, linkedin, shop, inpaint, airbnb, cert, humanizer, workout, dashboard, spotify, coinflip, car, weather };
