# Voice Transcriber

A web application that records audio in the browser and transcribes it using OpenAI's Whisper API.

## Overview

This application provides a simple, intuitive interface for voice-to-text transcription:
- Record audio directly in the browser
- Automatic transcription using OpenAI Whisper
- Copy transcription results to clipboard

## Project Structure

```
client/                 # React frontend
├── src/
│   ├── pages/
│   │   └── home.tsx   # Main audio recorder page
│   ├── components/ui/ # Shadcn UI components
│   ├── App.tsx        # Main app with routing
│   └── index.css      # Tailwind styles
server/
├── routes.ts          # API endpoints (transcription)
├── index.ts           # Express server setup
└── storage.ts         # Data storage interface
shared/
└── schema.ts          # TypeScript types and schemas
```

## API Endpoints

### POST /api/transcribe
Accepts audio file uploads and returns transcription text.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `audio` field with audio file (webm, mp4, wav, etc.)

**Response:**
```json
{
  "text": "Transcribed text content"
}
```

### GET /api/health
Health check endpoint.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Node.js, Express, Multer
- **AI:** OpenAI Whisper API
- **Build:** Vite

## Environment Variables

- `OPENAI_API_KEY` - Required for Whisper transcription

## Running the App

The app runs automatically with `npm run dev`. The frontend and backend are served on port 5000.
