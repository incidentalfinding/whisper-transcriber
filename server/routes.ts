import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure multer for file uploads using memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit (Whisper API limit)
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    const allowedMimes = [
      "audio/webm",
      "audio/mp4",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/flac",
      "audio/m4a",
      "audio/mp3",
    ];
    if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only audio files are allowed."));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Transcription endpoint
  app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      // Create a temporary file for the audio
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, `audio-${Date.now()}.webm`);
      
      // Write the buffer to a temporary file
      fs.writeFileSync(tempFilePath, req.file.buffer);

      try {
        // Create a read stream for the OpenAI API
        const audioReadStream = fs.createReadStream(tempFilePath);

        // Send to OpenAI Whisper for transcription
        const transcription = await openai.audio.transcriptions.create({
          file: audioReadStream,
          model: "whisper-1",
        });

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);

        return res.json({
          text: transcription.text,
        });
      } catch (openaiError: any) {
        // Clean up the temporary file on error
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        
        console.error("OpenAI API error:", openaiError);
        return res.status(500).json({
          error: openaiError.message || "Failed to transcribe audio",
        });
      }
    } catch (error: any) {
      console.error("Transcription error:", error);
      return res.status(500).json({
        error: error.message || "Internal server error",
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
