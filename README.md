# 🎵 Discord Music Bot Web Controller

## Overview

Welcome to the **Discord Music Bot Web Controller**! 🎶 Dive into a world where you can orchestrate
your favorite tunes on Discord with just a few clicks. This web application offers a sleek and
responsive interface to seamlessly control the
[Ziji music bot](https://github.com/zijipia/Ziji-bot-discord) on Discord. Built with the
cutting-edge technologies of Next.js and Express.js, and powered by the Discord API, this project
promises an unparalleled music control experience for all Discord enthusiasts.

## Features

- **🔐 User Authentication**: Experience secure and hassle-free login using your Discord
  credentials.
- **⏯️ Real-time Control**: Command your music bot with precision—pause, play, skip, and more, all
  in real-time.
- **📜 Queue Management**: Effortlessly view and curate your playlist to perfection.
- **🔍 Search Functionality**: Discover new tracks and enrich your queue with ease.
- **🔊 Voice Channel Integration**: Stay informed with real-time voice channel updates.
- **📱 Responsive Design**: Enjoy a seamless experience across all devices, be it desktop or mobile.
- **🎨 Theme Customization**: Personalize your interface with a variety of color themes and toggle
  between light/dark modes.
- **🔈 Volume Control**: Fine-tune the music bot's volume to suit your mood.
- **⏱️ Track Progress**: Keep track of your music journey with intuitive progress controls.

## Technologies Used

- **Frontend**:
  - Next.js
  - React
  - Tailwind CSS
  - shadcn/ui components
- **Backend**:
  - Express.js
  - Socket.IO for real-time communication
  - discord-player for music playback
- **Authentication**:
  - NextAuth.js with Discord provider
- **Other**:
  - TypeScript
  - Node.js

## Prerequisites

Before you embark on this musical journey, ensure you have the following:

- Node.js (v14 or newer)
- npm or yarn
- A Discord account and a registered Discord application

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zijipia/ziji-bot-web.git
   cd ziji-bot-web
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory of the project and add the necessary environment
   variables:

   ```plaintext
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   NEXTAUTH_URL=your_nextauth_url (http://localhost:3000)
   NEXT_PUBLIC_WEBSOCKET_URL=your_websocket_url (http://localhost:2003 or ws://localhost:2003)
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Run the application:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   npm run build
   npm run start
   ```

5. Open your browser and go to `http://localhost:3000` to start using the application.

## Contributing

Join us in making this project even better! Create a new branch, implement your changes, and submit
a pull request. We welcome your creativity and contributions!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
