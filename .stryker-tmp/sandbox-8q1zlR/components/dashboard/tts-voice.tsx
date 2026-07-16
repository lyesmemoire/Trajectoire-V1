// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Mic, CheckCircle } from "lucide-react";

interface TTSVoiceProps {
  voiceData: {
    selectedVoice: string;
    language: string;
    emotion: string;
    speed: number;
    pitch: number;
    volume: number;
    availableVoices: Array<{
      id: string;
      name: string;
      language: string;
      gender: string;
      description: string;
    }>;
  };
  onVoiceChange: (voiceId: string) => void;
  onLanguageChange: (language: string) => void;
  onEmotionChange: (emotion: string) => void;
  onSpeedChange: (speed: number) => void;
  onPitchChange: (pitch: number) => void;
}

export function TTSVoice({
  voiceData,
  onVoiceChange,
  onLanguageChange,
  onEmotionChange,
  onSpeedChange,
  onPitchChange
}: TTSVoiceProps) {
  const selectedVoiceObj = voiceData.availableVoices.find(v => v.id === voiceData.selectedVoice);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">TTS Voice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Voice Configuration</div>
                <div className="text-xs text-gray-600">Customize voice settings</div>
              </div>
            </div>
            {selectedVoiceObj && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div className="text-xs text-gray-600">{selectedVoiceObj.name}</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Selected Voice</div>
              <select
                value={voiceData.selectedVoice}
                onChange={(e) => onVoiceChange(e.target.value)}
                className="w-full text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
              >
                {voiceData.availableVoices.map(voice => (
                  <option key={voice.id} value={voice.id}>{voice.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Language</div>
              <select
                value={voiceData.language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-600 mb-1">Emotion</div>
              <select
                value={voiceData.emotion}
                onChange={(e) => onEmotionChange(e.target.value)}
                className="w-full text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
              >
                <option value="neutral">Neutral</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
                <option value="excited">Excited</option>
                <option value="calm">Calm</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1 text-center">Voice Details</div>
              {selectedVoiceObj && (
                <div className="text-xs text-gray-600 text-center">
                  {selectedVoiceObj.gender} • {selectedVoiceObj.description}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Voice Parameters</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">Speed: {voiceData.speed}x</div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceData.speed}
                  onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Pitch: {voiceData.pitch}</div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceData.pitch}
                  onChange={(e) => onPitchChange(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
