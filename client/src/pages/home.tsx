import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, Copy, Check, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RecordingState = "idle" | "recording" | "processing";

export default function Home() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") 
          ? "audio/webm" 
          : "audio/mp4"
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        await processAudio();
      };
      
      mediaRecorder.start();
      setRecordingState("recording");
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Could not access microphone. Please check your permissions.");
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
      setRecordingState("processing");
    }
  }, [recordingState]);

  const processAudio = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: mediaRecorderRef.current?.mimeType || "audio/webm" 
      });
      
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transcription failed");
      }
      
      const data = await response.json();
      setTranscription(data.text);
      setError(null);
      toast({
        title: "Transcription Complete",
        description: "Your audio has been transcribed successfully.",
      });
    } catch (err) {
      console.error("Error processing audio:", err);
      const message = err instanceof Error ? err.message : "Failed to transcribe audio";
      setError(message);
      toast({
        title: "Transcription Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setRecordingState("idle");
    }
  };

  const handleMicrophoneClick = () => {
    if (recordingState === "idle") {
      startRecording();
    } else if (recordingState === "recording") {
      stopRecording();
    }
  };

  const copyToClipboard = async () => {
    if (!transcription) return;
    
    try {
      await navigator.clipboard.writeText(transcription);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Transcription copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getStatusText = () => {
    switch (recordingState) {
      case "idle":
        return "Click to start recording";
      case "recording":
        return "Recording... Click to stop";
      case "processing":
        return "Transcribing audio...";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-[600px] flex flex-col items-center space-y-8">
        <div className="text-center space-y-2">
          <h1 
            className="text-3xl font-semibold text-foreground"
            data-testid="text-title"
          >
            Voice Transcriber
          </h1>
          <p 
            className="text-muted-foreground text-sm"
            data-testid="text-subtitle"
          >
            Record audio and get instant transcription
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleMicrophoneClick}
            disabled={recordingState === "processing"}
            className={`
              relative w-36 h-36 sm:w-40 sm:h-40 rounded-full
              flex items-center justify-center
              transition-all duration-300 ease-out
              focus:outline-none focus-visible:ring-4 focus-visible:ring-ring
              disabled:opacity-50 disabled:cursor-not-allowed
              ${recordingState === "recording" 
                ? "bg-destructive text-destructive-foreground shadow-lg" 
                : "bg-primary text-primary-foreground shadow-md hover:shadow-lg"
              }
              ${recordingState === "recording" ? "animate-pulse" : ""}
            `}
            aria-label={recordingState === "recording" ? "Stop recording" : "Start recording"}
            data-testid="button-microphone"
          >
            {recordingState === "recording" && (
              <span className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
            )}
            {recordingState === "processing" ? (
              <Loader2 className="w-14 h-14 sm:w-16 sm:h-16 animate-spin" />
            ) : recordingState === "recording" ? (
              <Square className="w-14 h-14 sm:w-16 sm:h-16 fill-current" />
            ) : (
              <Mic className="w-14 h-14 sm:w-16 sm:h-16" />
            )}
          </button>

          <p 
            className="text-lg font-medium text-foreground text-center h-7 flex items-center gap-2"
            data-testid="text-status"
          >
            {recordingState === "recording" && (
              <span className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
            )}
            {recordingState === "processing" && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {getStatusText()}
          </p>
        </div>

        {error && (
          <Card className="w-full p-4 bg-destructive/10 border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p 
                className="text-sm text-destructive"
                data-testid="text-error"
              >
                {error}
              </p>
            </div>
          </Card>
        )}

        <Textarea
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          placeholder="Your transcription will appear here..."
          className="w-full min-h-[200px] max-h-[400px] resize-none text-base leading-relaxed"
          data-testid="textarea-transcription"
        />

        <div className="w-full flex justify-end">
          <Button
            onClick={copyToClipboard}
            disabled={!transcription}
            variant="secondary"
            className="gap-2 px-6"
            data-testid="button-copy"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
