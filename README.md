# 🎄 Christmas Scam Simulator - Leo Club Educational Project

<div align="center">

**An Interactive Educational Experience About Online Scams**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.171.0-000000?style=flat&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)

</div>

---

## 📖 Overview

**Christmas Scam Simulator** is an immersive, interactive web application designed to educate users about the dangers of online scams through a gamified Christmas-themed experience. Created for the **Leo Club of St. Servatius College Matara**, this project simulates common scam tactics in a safe, controlled environment to raise awareness about digital security.

### 🎯 Purpose

This application is **NOT** a real scam - it's an educational tool that:
- Demonstrates how scammers manipulate emotions (excitement, urgency, fear)
- Shows common psychological tactics used in online fraud
- Provides a memorable lesson about being cautious online
- Tracks engagement to measure educational impact

### ✨ The Experience

Users are taken through a carefully crafted journey:
1. **The Bait** - A festive "prize wheel" that simulates winning
2. **The Hook** - Fake system glitches and "hacking" messages
3. **The Urgency** - Countdown timers creating pressure to act
4. **The Trap** - A tempting 3D gift box to click
5. **The Reveal** - An educational ending that explains the tactics used

---

## 🚀 Features

### 🎨 Immersive 3D Graphics
- Built with **React Three Fiber** and **Three.js**
- Interactive 3D gift boxes with physics
- Flying Santa sleigh animations
- Particle effects and atmospheric lighting
- Responsive design for mobile and desktop

### 🎭 Multi-Stage Experience
- **Splash Screen**: Simulated prize wheel and "hacking" sequence
- **3D Scene**: Interactive gift-opening experience
- **Ending Scene**: Educational reveal with statistics and lessons

### 📊 Real-Time Statistics
- Tracks total visits to the site
- Counts users who fell for the simulation
- Displays engagement metrics in real-time
- Uses Counter API for persistent storage

### 🎵 Rich Audio Experience
- Background music and sound effects
- Context-appropriate audio cues
- Glitch sounds and dramatic effects
- Graceful handling of browser autoplay restrictions

### 📱 Responsive Design
- Optimized for mobile and desktop
- Adaptive camera positioning
- Touch-friendly controls
- Progressive Web App ready

---

## 🛠️ Technologies Used

### Core Framework
- **React 18.3.1** - UI library
- **TypeScript 5.6.2** - Type-safe development
- **Vite 6.0.5** - Build tool and dev server

### 3D Graphics
- **Three.js 0.171.0** - 3D rendering engine
- **@react-three/fiber 8.17.10** - React renderer for Three.js
- **@react-three/drei 9.120.0** - Useful helpers for R3F

### Animation & UI
- **Framer Motion 11.15.0** - Animation library
- **framer-motion-3d 11.15.0** - 3D animations
- **Tailwind CSS 3.4.17** - Utility-first CSS

### Additional Tools
- **html2canvas 1.4.1** - Screenshot generation
- **ESLint** - Code quality
- **PostCSS & Autoprefixer** - CSS processing

---

## 📋 Prerequisites

Before running this project, ensure you have:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- A modern web browser with WebGL support

---

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Thisal005/Christmas-Scam-LeoClub.git
   cd Christmas-Scam-LeoClub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173` (or the URL shown in terminal)

---

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
```
Starts a local development server with hot module replacement.

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Locally preview the production build.

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality.

---

## 📁 Project Structure

```
Christmas-Scam-LeoClub/
├── public/               # Static assets
│   ├── *.mp3            # Audio files
│   ├── icon.png         # Favicon
│   └── logo.png         # Logo image
├── src/
│   ├── components/      # React components
│   │   ├── BackgroundSanta.tsx    # Ambient Santa animation
│   │   ├── EndingScene.tsx        # Educational reveal
│   │   ├── GiftBox.tsx            # Interactive 3D gift
│   │   ├── MagicalSurprise.tsx    # Effects component
│   │   ├── Overlay.tsx            # Stats overlay
│   │   ├── SantaSleigh.tsx        # Flying sleigh
│   │   ├── ScamSpinner.tsx        # Prize wheel
│   │   ├── SplashScreen.tsx       # Initial sequence
│   │   └── StatItem.tsx           # Stat display
│   ├── hooks/           # Custom React hooks
│   │   └── useScamStats.ts        # Statistics management
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # TypeScript declarations
├── dist/                # Production build output
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS config
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

---

## 🎮 How It Works

### Application Flow

1. **Initialization** (`App.tsx`)
   - Sets up 3D canvas and camera
   - Initializes background music
   - Tracks visit count via API

2. **Splash Screen** (`SplashScreen.tsx`)
   - Scene 1: Prize wheel spins to "You Won!"
   - Scene 2: Simulated system glitch
   - Scene 3: Fake "hacked" warning (red screen)
   - Scene 4: Countdown timer (creates urgency)
   - Transitions to main 3D scene

3. **3D Scene** (`App.tsx` + Components)
   - Santa's sleigh flies in and drops a gift
   - User is tempted to click the glowing gift box
   - Clicking triggers multiple gifts to appear
   - Statistics counter increments

4. **Ending Scene** (`EndingScene.tsx`)
   - Reveals this was a simulation
   - Educates about scam tactics used
   - Shows personal "roast card" (downloadable)
   - Displays final message from Leo Club
   - Offers restart option

### Key Components

#### `GiftBox.tsx`
The interactive 3D gift box with:
- Click detection
- Opening animation
- Sound effects
- Multiple visual variants (glow, shake, spin)

#### `SantaSleigh.tsx`
Animated Santa sleigh that:
- Flies across the scene
- Drops the main gift box
- Uses smooth animations

#### `EndingScene.tsx`
The educational reveal featuring:
- Timed cinematic sequence
- Statistics display
- Downloadable "roast card" image
- Credits and final message

#### `useScamStats.ts`
Custom hook managing:
- Visit counting
- Victim tracking
- API integration with Counter API
- Error handling

---

## ⚙️ Configuration

### Environment Variables
Currently, the app uses hardcoded configuration. To customize:

**API Endpoint** (`src/hooks/useScamStats.ts`):
```typescript
const API_BASE = 'https://api.counterapi.dev/v1/christmas-scam-leoclub';
```

### Audio Files
Place audio files in `public/` directory:
- `bg.mp3` - Background music
- `glitch.mp3` - Glitch sound effect
- `error-glitch.mp3` - Error sound
- `ending_bg.mp3` - Ending scene music
- `sound_*.mp3` - Various gift sounds

### 3D Scene Settings
Adjust camera and positions in `App.tsx`:
```typescript
camera={{ position: [0, 2, isMobile ? 13.5 : 8], fov: 45 }}
```

---

## 🎓 Educational Purpose

This project demonstrates several common scam tactics:

### 1. **False Urgency**
- Countdown timers
- "Limited time" messaging
- Panic-inducing warnings

### 2. **Emotional Manipulation**
- Excitement (winning a prize)
- Fear (system compromised)
- Greed (more free gifts)

### 3. **Authority Impersonation**
- Fake system messages
- Technical-looking glitches
- Official-seeming warnings

### 4. **Too Good to Be True**
- Instant wins without entry
- Free expensive prizes
- No verification required

### Learning Outcomes
After experiencing this simulation, users should:
- ✅ Recognize urgency as a manipulation tactic
- ✅ Question unsolicited "prizes" and offers
- ✅ Be skeptical of system warnings on unfamiliar sites
- ✅ Understand how emotions are exploited by scammers

---

## 🤝 Contributing

This is an educational project by Leo Club. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


---

## ⚠️ Disclaimer

**IMPORTANT**: This is an educational simulation designed to teach about online scams. It is **NOT** a real scam and does not:
- Collect personal information
- Install malware
- Access your system
- Steal data
- Cause any harm

All "scary" messages and effects are purely theatrical. The only data collected is:
- Anonymous visit count
- Anonymous interaction count (via public Counter API)

Use this project responsibly to educate others about online safety.

---

## 📧 Contact

For questions, suggestions, or educational partnerships:
- **Repository**: [https://github.com/Thisal005/Christmas-Scam-LeoClub](https://github.com/Thisal005/Christmas-Scam-LeoClub)

---

<div align="center">

**Made with ❤️ by Leo Club**

*Stay safe online! 🔒*

</div>
