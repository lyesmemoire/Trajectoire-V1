// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Volume2, Play, Pause, SkipForward, Rewind, Gauge } from "lucide-react";

interface TTSPlaybackProps {
  playbackData: {
    state: string;
    duration: number;
    position: number;
    volume: number;
    speed: number;
    pitch: number;
  };
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (position: number) => void;
  onVolumeChange: (volume: number) => void;
}

export function TTSPlayback({
  playbackData,
  onPlay,
  onPause,
  onStop,
  onSeek,
  onVolumeChange
}: TTSPlaybackProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Playing":
        return "bg-green-100 text-green-700 border-green-200";
      case "Paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Idle":
      case "Stopped":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-red-100 text-red-700 border-red-200";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "Playing":
        return <Play className="w-4 h-4 text-green-600" />;
      case "Paused":
        return <Pause className="w-4 h-4 text-yellow-600" />;
      case "Idle":
      case "Stopped":
        return <Volume2 className="w-4 h-4 text-gray-600" />;
      default:
        return <Volume2 className="w-4 h-4 text-red-600" />;
    }
  };

  const progress = playbackData.duration > 0 ? (playbackData.position / playbackData.duration) * 100 : 0;

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">TTS Playback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Playback Status</div>
                <div className="text-xs text-gray-600">Audio playback control</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(playbackData.state)}`}>
                {playbackData.state}
              </div>
              {getStateIcon(playbackData.state)}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Duration</div>
              <div className="text-sm font-medium text-gray-900">{playbackData.duration}s</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Position</div>
              <div className="text-sm font-medium text-gray-900">{playbackData.position}s</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Volume</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-blue-600" />
                {Math.round(playbackData.volume * 100)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Speed</div>
              <div className="text-sm font-medium text-gray-900">{playbackData.speed}x</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={onPlay}
                className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                <Play className="w-3 h-3 inline mr-1" />
                Play
              </button>
              <button
                onClick={onPause}
                className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                <Pause className="w-3 h-3 inline mr-1" />
                Pause
              </button>
              <button
                onClick={() => onSeek(Math.max(0, playbackData.position - 5))}
                className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                <Rewind className="w-3 h-3 inline mr-1" />
                -5s
              </button>
              <button
                onClick={() => onSeek(Math.min(playbackData.duration, playbackData.position + 5))}
                className="flex-1 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                <SkipForward className="w-3 h-3 inline mr-1" />
                +5s
              </button>
              <button
                onClick={onStop}
                className="flex-1 py-2 text-xs font-medium text-red-600 border border-red-300 rounded hover:bg-red-100 transition-colors"
              >
                Stop
              </button>
            </div>

            <div className="mt-3">
              <div className="text-xs text-gray-600 mb-1">Volume Control</div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={playbackData.volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
