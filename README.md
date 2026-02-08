# Smoking Tracker PWA

A private, mobile-friendly Progressive Web App (PWA) to help track smoking habits, identify triggers, and visualize progress towards reduction goals.

## Features

- **Log Smoking**: Quick interface to log cigarettes and identify triggers.
- **Dashboard**: visualize daily trends and trigger breakdowns.
- **Goals**: Set monthly limits and track progress.
- **PWA**: Installable on mobile devices with offline support.
- **Privacy Focused**: All data is stored locally in your browser.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Recharts for visualization
- LocalStorage for persistence

## Getting Started

1.  Clone the repository
2.  Install dependencies: `npm install`
3.  Copy environment configuration: `cp .env.development.example .env.development`
4.  Run development server: `npm run dev`
5.  Build for production: `npm run build`

## Testing on Mobile Devices

To test the app on your mobile device while developing:

1. **Start the dev server** (if not already running):

   ```bash
   npm run dev
   ```

2. **In a second terminal**, expose your local server using localtunnel:

   ```bash
   npx localtunnel --port 5173
   ```

3. You'll receive a public URL (e.g., `https://xyz-abc-123.loca.lt`) that you can access from any device.

4. Click the link or open it on your mobile browser to test the app.

**Note:** Keep both terminals running while testing. The tunnel URL will change each time you restart localtunnel.
