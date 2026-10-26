import { diagrams, type Diagram } from "@/lib/diagrams";
import { GH_USER } from "@/lib/github";

export const profile = {
  name: "Phani Teja Karri",
  role: "full-stack developer",
  email: "phanitejakarri@gmail.com",
  phone: "+61 478 773 707",
  github: `https://github.com/${GH_USER}`,
  linkedin: "https://www.linkedin.com/in/phaniteja-karri-55332a215/",
  codechef: "https://www.codechef.com/users/abhimanyudu",
  linktree: "https://linktr.ee/phanisprojects",
  location: "Melbourne, Australia",
};

export const stats = [
  { value: 2.7, decimals: 1, prefix: "", suffix: " yrs", label: "Building software professionally", icon: "briefcase", fill: 90 },
  { value: 14, decimals: 0, prefix: "+", suffix: "", label: "Projects shipped", icon: "rocket", fill: 85 },
  { value: 31, decimals: 0, prefix: "", suffix: "", label: "Public repos on GitHub", icon: "github", fill: 80 },
  { value: 2, decimals: 0, prefix: "", suffix: "", label: "Published papers", icon: "paper", fill: 70 },
];

export type Category = "Web" | "AI / ML" | "Tools";

export type Project = {
  slug: string;
  title: string;
  short: string; // card-sized name
  summary: string; // one line for lists
  category: Category;
  year: string;
  role: string;
  featured?: boolean;
  bullets: string[];
  tags: string[];
  photos: string[]; // screenshots in /public/projects; empty = the diagram is the cover
  thumb?: string; // preview image when there are no screenshots
  details: string;
  repos: string[]; // GitHub repo names, first one is the primary (empty = live site only)
  diagram: Diagram;
  tint: string; // accent behind the project's screenshots
  liveUrl?: string;
};

export const categories: Category[] = ["Web", "AI / ML", "Tools"];

export const projects: Project[] = [
  {
    slug: "phanis-ai",
    title: "Phani's AI, a ChatGPT-style Assistant",
    short: "Phani's AI",
    summary: "A ChatGPT / Gemini-style assistant that answers prompts about code, music, video and general topics in seconds.",
    category: "AI / ML",
    year: "2024",
    role: "Solo · full-stack",
    featured: true,
    bullets: [
      "Built a chat assistant with a sidebar of recent prompts, suggestion cards to get started, and a prompt bar with image and voice entry points.",
      "Wired the live version to Google's Gemini API and the original version to an Express server that calls OpenAI's completions endpoint.",
      "Replies type themselves out character by character behind a loading indicator, so the answer feels like it's being written as you watch.",
    ],
    tags: ["React", "Vite", "Gemini API", "Node.js", "Express", "OpenAI"],
    photos: ["/projects/ai1.jpg"],
    details:
      "Phani's AI started as a ChatGPT clone and grew into a small assistant you can actually use. The first version is a vanilla JS client talking to an Express server: the server holds the OpenAI key, forwards the prompt to the completions API and returns the text, and the client types it out with a loader while it waits. The live version is rebuilt in React on Vite with a Gemini-style layout (greeting, suggestion cards, recent prompts) and calls Google's Generative Language API directly. Ask it about code, music, video or anything else.",
    repos: ["chatGPT-clone"],
    diagram: diagrams.ai,
    tint: "#7AA7FF",
    liveUrl: "https://phanis-ai.netlify.app",
  },
  {
    slug: "whatsapp-clone",
    title: "WhatsApp Clone, a Real-time Chat App",
    short: "WhatsApp Clone",
    summary: "A real-time chat app with group threads, read receipts and new-message sounds.",
    category: "Web",
    year: "2023",
    role: "Solo · frontend",
    featured: true,
    bullets: [
      "Built a real-time messaging app in React: sign in, pick a conversation and chat with everyone in it live.",
      "Custom chat feed that groups messages by sender, shows avatars on the other side and draws read receipts under the last message each person has seen.",
      "Credentials are checked against the chat API before the app loads, the session is kept in the browser, and new messages play a sound.",
    ],
    tags: ["React", "ChatEngine", "Axios", "CSS"],
    photos: ["/projects/chat1.jpg"],
    details:
      "A WhatsApp-style messenger built to learn how real-time apps hang together. The login form authenticates against the chat backend before anything renders, then a hosted chat engine handles sockets, channels and message storage while the UI is all custom: my own chat feed, message bubbles for me and for everyone else, read receipts drawn from each member's last-read message, and a composer that sends text and attachments.",
    repos: ["teamschat-app"],
    diagram: diagrams.chat,
    tint: "#22C55E",
    liveUrl: "https://phanichat.netlify.app",
  },
  {
    slug: "linkedin-clone",
    title: "LinkedIn Clone",
    short: "LinkedIn Clone",
    summary: "A social network with posts, likes, comments, connections and profiles on Firebase.",
    category: "Web",
    year: "2024",
    role: "Solo · full-stack",
    featured: true,
    bullets: [
      "Email/password and Google sign-in through Firebase Auth, with separate login, register, home, profile and connections routes.",
      "A live feed on Firestore: write rich-text posts with images, like and comment, with counts updating in real time for everyone.",
      "Profiles with editable details and photo uploads to Firebase Storage with a progress bar, plus user search and a connections page.",
    ],
    tags: ["React", "Vite", "Firebase", "Firestore", "Sass", "Ant Design"],
    photos: [],
    details:
      "A working LinkedIn: sign up, build a profile, post updates and connect with people. Everything runs on Firebase. Auth handles email and Google sign-in, Firestore keeps posts, users, likes, comments and connections in separate collections that the UI subscribes to with real-time listeners, and Storage takes profile and post images with resumable uploads. The interface is React with Sass modules, a React Quill editor for posts and toasts for feedback.",
    repos: ["Linkedin-clone"],
    diagram: diagrams.linkedin,
    tint: "#0A66C2",
  },
  {
    slug: "ecommerce",
    title: "Bonik E-Commerce Storefront",
    short: "E-Commerce",
    summary: "A multi-category online store with flash deals, category browsing and a cart.",
    category: "Web",
    year: "2023",
    role: "Solo · frontend",
    featured: true,
    bullets: [
      "Built a full storefront in React: a category menu, a hero slider, flash deals, top categories, new arrivals and big-discount rows.",
      "Reusable product cards with discount badges, ratings, prices and an add-to-cart button that updates the cart count in the header.",
      "A cart page where you can raise or lower quantities, with line totals and an overall total that update as you go.",
    ],
    tags: ["React", "CSS", "HTML", "Font Awesome"],
    photos: ["/projects/shop1.jpg", "/projects/shop2.jpg", "/projects/shop3.jpg"],
    details:
      "Building an e-commerce site with React, CSS and HTML is mostly about getting the components right. Bonik is made of a small set of them (product card, carousel, category tile and section header) composed into every row of the home page, structured with HTML and styled entirely in CSS. A routed /cart page keeps the items you've added with their quantities and a running total, so the whole browse, add and review loop works the way a real store does.",
    repos: [],
    diagram: diagrams.shop,
    tint: "#E94560",
    liveUrl: "https://phani-ecommerce.netlify.app",
  },
  {
    slug: "image-inpainting",
    title: "AI-based Image Processor",
    short: "Image Masking",
    summary: "Paint over part of an image to build a mask, then blur or edit exactly that region.",
    category: "AI / ML",
    year: "2024",
    role: "Solo",
    featured: true,
    bullets: [
      "Drag-and-drop upload, then paint directly on the image with an adjustable brush on a Fabric.js canvas to mark the region to change.",
      "Exports a clean black-and-white mask, the input format inpainting models expect, alongside the original image.",
      "Applies the edit only inside the mask pixel by pixel, with a live blur slider and one-click download of the result and the mask.",
    ],
    tags: ["React", "TypeScript", "Fabric.js", "Canvas API", "Tailwind CSS"],
    photos: ["/projects/inpaint1.jpg"],
    details:
      "Image masking is the step before most AI image edits: you have to tell the model which pixels to touch. This widget makes that step easy. You upload a photo, paint over the object or background you want to change, and it turns your strokes into a precise mask. The preview then composites a processed copy of the image back in only where the mask is white, which is how background removal, recolouring and inpainting all work under the hood.",
    repos: ["taskdone"],
    diagram: diagrams.inpaint,
    tint: "#A855F7",
    liveUrl: "https://imageinpainting27.netlify.app",
  },
  {
    slug: "airbnb-clone",
    title: "Airbnb Clone",
    short: "Airbnb Clone",
    summary: "A Next.js rental marketplace: list a home, browse by category, favourite and book stays.",
    category: "Web",
    year: "2024",
    role: "Solo · full-stack",
    bullets: [
      "Category bar (beach, windmills, castles, camping and more) and search by location, dates and guests over a grid of listings.",
      "Sign in with Google or GitHub through NextAuth, list your own place with 'Airbnb your home', and save favourites with the heart icon.",
      "Server-rendered with the Next.js App Router, with a spinner while listings stream in, and deployed on Vercel.",
    ],
    tags: ["Next.js", "React", "NextAuth", "Tailwind CSS", "Vercel"],
    photos: ["/projects/airbnb1.jpg"],
    details:
      "An Airbnb clone built to learn a full MERN-style product end to end: a platform where users list, discover and book places to stay. Listings are filtered by category from the icon bar and searched by where, when and how many. Accounts come from Google or GitHub OAuth, and once signed in you can put your own place up with a photo, location, category and nightly price, or favourite other people's. It is a Next.js App Router project on Vercel.",
    repos: [],
    diagram: diagrams.airbnb,
    tint: "#FF385C",
    liveUrl: "https://airbnb-video-youtube.vercel.app",
  },
  {
    slug: "certificate-generator",
    title: "Certificate Generator",
    short: "Certificates",
    summary: "Fill in a form and get a print-ready certificate of completion as a PNG.",
    category: "Tools",
    year: "2024",
    role: "Solo",
    bullets: [
      "Form for student, course, completion date, grade and instructor, with a live certificate preview beside it.",
      "Renders the finished certificate to an image with html2canvas and downloads it as a PNG in one click.",
      "Light and dark themes, built in React with Tailwind CSS.",
    ],
    tags: ["React", "Tailwind CSS", "html2canvas", "Vite"],
    photos: ["/projects/cert1.jpg"],
    details:
      "Making certificates by hand for a whole class is slow and inconsistent. This generator turns it into a form: enter the details and a styled 'Certificate of Completion' appears in the preview, ready to download. The certificate is ordinary HTML and CSS, so the layout is easy to change, and html2canvas captures it as a high-resolution PNG. It is a first step towards automated certificate processing, where the same template can be filled from data and checked for authenticity.",
    repos: [],
    diagram: diagrams.cert,
    tint: "#3B82F6",
    liveUrl: "https://certificategenerate27.netlify.app",
  },
  {
    slug: "humanizer",
    title: "ProdYis AI Humanizer",
    short: "Humanizer",
    summary: "A streaming AI paraphraser that rewrites text to sound human, with pluggable skills.",
    category: "AI / ML",
    year: "2026",
    role: "Solo · frontend",
    bullets: [
      "Chat interface in React 19 and Tailwind 4 that streams the model's rewrite token by token with the Fetch ReadableStream API.",
      "Skills sidebar: upload a skill as a .zip, see what's installed and switch each one on or off without a redeploy.",
      "One-click copy, auto-scroll to the newest message and a lock that stops duplicate requests while a reply is still streaming.",
    ],
    tags: ["React 19", "Tailwind 4", "Streaming", "LLM", "Vite"],
    photos: [],
    details:
      "ProdYis takes AI-sounding text and rewrites it so it reads naturally. The frontend never waits for a full response: it reads the response body as a stream and paints each chunk as it arrives, so long rewrites start appearing straight away. Prompts are packaged as installable skills that the backend stores and toggles, which means the same chat can change tone or task without shipping a new build.",
    repos: ["ProdYis"],
    diagram: diagrams.humanizer,
    tint: "#F59E0B",
  },
  {
    slug: "workout-buddy",
    title: "Workout Buddy, a MERN Fitness Tracker",
    short: "Workout Buddy",
    summary: "Log exercises, loads and reps on a MERN stack with a REST API and MongoDB.",
    category: "Web",
    year: "2022",
    role: "Solo · full-stack",
    bullets: [
      "Express REST API with full CRUD for workouts, ObjectId checks and clear 400/404 errors for bad requests.",
      "Mongoose models on MongoDB, with server-side validation that reports exactly which fields are missing.",
      "React frontend with Context and useReducer for state: new workouts appear instantly and deleted ones disappear without a refetch.",
    ],
    tags: ["MongoDB", "Express", "React", "Node.js", "Mongoose"],
    photos: [],
    details:
      "Workout Buddy is a full MERN project: a React client and an Express API, split into separate repos. The API exposes GET, POST, PATCH and DELETE on /api/workouts with controllers that validate input and return meaningful status codes. The frontend keeps a single workouts store in React Context, so the form, list and delete buttons all stay in sync, and invalid fields are highlighted using the list the server sends back.",
    repos: ["Workout-Application-Backend", "Workout-Application-frontend"],
    diagram: diagrams.workout,
    tint: "#1AAC83",
  },
  {
    slug: "admin-dashboard",
    title: "Production Analytics Dashboard",
    short: "Dashboard",
    summary: "A themeable admin dashboard with KPI cards, charts, a date-range picker and an orders table.",
    category: "Web",
    year: "2024",
    role: "Solo · frontend",
    bullets: [
      "KPI cards with donut progress rings and a 24-hour vs 7-day production bar chart drawn with Recharts.",
      "Date-range picker, a progress panel for production targets and a recent orders table with row actions.",
      "Light and dark themes plus a collapsible sidebar, both driven by React Context.",
    ],
    tags: ["React", "Vite", "Recharts", "Sass", "React Router"],
    photos: ["/projects/dash1.jpg", "/projects/dash2.jpg"],
    details:
      "A dashboard for keeping an eye on production lines at a glance. The layout is a sidebar and a grid of cards, each a self-contained component (area cards, bar chart, progress chart and table) fed by its own data. Theme and sidebar state live in two small contexts so every component restyles itself when you switch to dark mode, and the whole thing is responsive down to a phone.",
    repos: ["react-dash"],
    diagram: diagrams.dashboard,
    tint: "#4F5BD5",
  },
  {
    slug: "spotify-clone",
    title: "Spotify Clone",
    short: "Spotify Clone",
    summary: "Log in with Spotify and browse your playlists and Discover Weekly in a Spotify-style player.",
    category: "Web",
    year: "2022",
    role: "Solo · frontend",
    bullets: [
      "Spotify OAuth implicit-grant login: the access token is read from the redirect URL and stored in app state.",
      "Pulls your profile, playlists and Discover Weekly from the Spotify Web API and renders them in a sidebar, body and track list.",
      "Global state with a Context + reducer data layer, and Material UI icons for the player controls.",
    ],
    tags: ["React", "Spotify Web API", "OAuth", "Material UI"],
    photos: [],
    details:
      "A Spotify web player clone that works with your real account. You log in through Spotify's accounts service, the app picks the token off the redirect and hands it to the Spotify Web API client, and from then on your own playlists and Discover Weekly fill the interface. All of that data flows through one reducer-backed data layer, so the header, sidebar and track list read from the same source.",
    repos: ["spotify-clone"],
    diagram: diagrams.spotify,
    tint: "#1DB954",
  },
  {
    slug: "kadena-coin-flip",
    title: "Kadena Coin Flip",
    short: "Coin Flip",
    summary: "A pixel-art double-or-nothing dApp on the Kadena blockchain, with wallet connect and Pact.",
    category: "Tools",
    year: "2024",
    role: "Solo · Web3 frontend",
    bullets: [
      "Connect X-Wallet, Zelcore or Chainweaver, pick heads or tails and a KDA stake, and send the flip as a signed transaction.",
      "Redux Toolkit store for the wallet, network and transaction state, with toasts that follow each transaction until it lands.",
      "An admin page with a Monaco editor to run Pact code locally or send it to chain, plus env-data and capability inputs.",
    ],
    tags: ["React", "Redux Toolkit", "Kadena", "Pact", "Tailwind CSS"],
    photos: ["/projects/coinflip1.jpg"],
    details:
      "H&T is a simple UI for sending transactions to the Kadena blockchain. Players connect a wallet, choose a side and a bet, and the app builds a Pact command, has the wallet sign it and listens on Chainweb for the result. Behind it is a small developer console: type Pact code, add environment data and capabilities, then run it locally or submit it as a real transaction.",
    repos: ["Bchain-H-T"],
    diagram: diagrams.coinflip,
    tint: "#E8318A",
    liveUrl: "https://bchain-h-t.vercel.app",
  },
  {
    slug: "dash-car-game",
    title: "Dash, a Retro Racing Game",
    short: "Dash Racer",
    summary: "An arcade road racer in the browser: dodge traffic, accelerate and beat the clock.",
    category: "Tools",
    year: "2022",
    role: "Solo",
    bullets: [
      "A pseudo-3D road with palm trees, traffic and a red convertible in an 80s arcade style.",
      "Keyboard controls to steer, accelerate and brake, plus insert-coin and mute keys, with score, laps and a saved high score.",
      "Plain HTML, CSS and JavaScript, so it loads instantly and runs anywhere.",
    ],
    tags: ["JavaScript", "HTML / CSS", "Game loop"],
    photos: ["/projects/car1.jpg"],
    details:
      "A tribute to arcade racers like OutRun. The road is drawn in perspective to fake depth, cars and scenery scale up as they approach, and a requestAnimationFrame loop moves the player, the traffic and the timer every frame. There is no framework, only HTML, CSS, JavaScript and the keyboard.",
    repos: ["car-game"],
    diagram: diagrams.car,
    tint: "#DC2626",
    liveUrl: "https://phanicargame.netlify.app",
  },
  {
    slug: "weather-app",
    title: "Weather App",
    short: "Weather",
    summary: "Search any city for live temperature, feels-like, wind, pressure and humidity.",
    category: "Tools",
    year: "2023",
    role: "Solo",
    bullets: [
      "Search by city and get current conditions with an icon, description and temperature.",
      "Detail cards for max, min, feels-like, wind speed, pressure and humidity.",
      "One-tap switch between °C and °F, over a full-bleed photo background.",
    ],
    tags: ["React", "OpenWeather API", "CSS"],
    photos: ["/projects/weather1.jpg"],
    details:
      "A small, polished weather app. It calls the OpenWeather API for the city you type, formats the response into a headline card and six detail tiles, and switches between metric and imperial units when you flip to Fahrenheit. It is a good example of handling an async API cleanly in React: loading, errors and units.",
    repos: [],
    diagram: diagrams.weather,
    tint: "#F97316",
    liveUrl: "https://phaniweatherapp.netlify.app",
  },
];

export const previewOf = (p: Project) => p.photos[0] ?? p.thumb ?? null;

export { repoUrl } from "@/lib/github";

export const skillGroups = [
  { label: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "HTML", "CSS"] },
  { label: "Frameworks", items: ["React.js", "Next.js", "Node.js", "Express.js"] },
  { label: "Data & Cloud", items: ["MongoDB", "Firebase", "AWS", "Docker"] },
  { label: "UI & Design", items: ["Sass", "Material UI", "Tailwind CSS", "Figma"] },
  { label: "AI & Automation", items: ["Generative AI", "LLaMA", "N8N", "HubSpot"] },
  { label: "Tools", items: ["Git", "Postman", "Notion", "Microsoft Tools"] },
  { label: "Coursework", items: ["Data Structures", "Operating Systems", "Computer Networking", "Data Mining", "Artificial Intelligence"] },
];

// Community roles, clubs and volunteering. Leave empty to hide the section.
export const leadership: {
  when: string;
  title: string;
  org: string;
  logo?: string;
  location?: string;
  desc: string;
  details: string[];
}[] = [];

export const internships: {
  when: string;
  title: string;
  org: string;
  logo?: string;
  location?: string;
  desc: string;
  details: string[];
}[] = [
  {
    when: "Mar 2024 - Jul 2025",
    title: "Full-stack Developer",
    org: "Celestinfo",
    logo: "/projects/celestinfo.jpg",
    desc: "Built client-side applications and worked with AI models, which turned out to be a very practical toolkit for today's problem-solving. 16 months.",
    details: [
      "Built and shipped client-side applications in React and TypeScript for client projects.",
      "Worked hands-on with AI models and integrated Generative AI into the products I built.",
      "Worked across the stack, from UI components to Node.js services and data storage, along with deployment.",
    ],
  },
  {
    when: "Jun 2023 - Jan 2024",
    title: "SDE (FTC)",
    org: "Amazon",
    logo: "/projects/amazon.jpg",
    desc: "Results-driven investigation specialist with a track record in fraud prevention, risk management and compliance. 8 months.",
    details: [
      "Investigated suspicious activity and fraud signals, helping prevent losses and protect customers.",
      "Applied risk-management and compliance checks consistently across the cases I handled.",
    ],
  },
  {
    when: "Aug 2022 - Mar 2023",
    title: "MERN Stack Developer",
    org: "Freelance",
    desc: "Freelanced through my final year of college, building MERN applications and deploying them on clients' sites. 7 months.",
    details: [
      "Built full-stack web apps with MongoDB, Express, React and Node.js to clients' requirements.",
      "Deployed and handed over the finished projects on clients' own sites and hosting.",
    ],
  },
];

export const education = [
  { when: "2025 - Present", school: "Victorian Institute of Technology, Melbourne", logo: "/projects/vit.jpg", degree: "Master's in Enterprise Systems and Business Analytics", score: "In progress", percent: 0, level: "Postgraduate" },
  { when: "2019 - 2023", school: "Vignan's Institute of Information Technology, Visakhapatnam", logo: "/projects/vignan.jpg", degree: "Bachelor's in Information Technology", score: "7.0 CGPA", percent: 70, level: "Undergraduate" },
];

export const achievements = [
  {
    mark: "Published",
    title: "Research paper on AI Automation",
    desc: "A published paper on using AI to automate everyday workflows.",
  },
  {
    mark: "Published",
    title: "Research paper on optimising single web pages",
    desc: "A published paper on performance optimisation techniques for single-page websites.",
  },
];

export const certifications: string[] = [];
