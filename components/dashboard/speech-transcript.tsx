"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { MessageSquare, Clock, AlertTriangle } from "lucide-react";

interface SpeechTranscriptProps {
  transcriptData: {
    partialTranscript: string;
    finalTranscripts: Array<{
      id: string;
      text: string;
      timestamp: number;
      confidence: number;
      language: string;
    }>;
    isProcessing: boolean;
  };
}

export function SpeechTranscript({ transcriptData }: SpeechTranscriptProps) {
  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Speech Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transcriptData.partialTranscript && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-medium text-yellow-900">Partial Transcript</span>
              </div>
              <div className="text-sm text-gray-900">{transcriptData.partialTranscript}</div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <MessageSquare className="w-3 h-3" />
              <span>Final Transcripts</span>
            </div>
            {transcriptData.finalTranscripts.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-4">
                No transcripts yet
              </div>
            ) : (
              transcriptData.finalTranscripts.slice(-5).map((transcript, index) => (
                <m.div
                  key={transcript.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-900">{transcript.language}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(transcript.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 mb-1">{transcript.text}</div>
                  <div className="text-xs text-gray-600">Confidence: {(transcript.confidence * 100).toFixed(1)}%</div>
                </m.div>
              ))
            )}
          </div>

          {transcriptData.isProcessing && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span>Processing...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
