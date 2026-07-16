"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Cpu, Layers, CheckCircle } from "lucide-react";

interface EmbeddingModelProps {
  modelData: {
    selectedModel: string;
    dimensions: number;
    maxTextLength: number;
    batchSize: number;
    language: string;
    normalize: boolean;
    availableModels: Array<{
      id: string;
      name: string;
      dimensions: number;
      maxTextLength: number;
      batchSize: number;
      supportedLanguages: string[];
      description: string;
    }>;
  };
  onModelChange: (modelId: string) => void;
  onNormalizeChange: (normalize: boolean) => void;
}

export function EmbeddingModel({
  modelData,
  onModelChange,
  onNormalizeChange
}: EmbeddingModelProps) {
  const selectedModelObj = modelData.availableModels.find(m => m.id === modelData.selectedModel);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Embedding Model</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Model Configuration</div>
                <div className="text-xs text-gray-600">Select embedding model</div>
              </div>
            </div>
            {selectedModelObj && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div className="text-xs text-gray-600">{selectedModelObj.name}</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Selected Model</div>
              <select
                value={modelData.selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-full text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
              >
                {modelData.availableModels.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Language</div>
              <div className="text-sm font-medium text-gray-900">{modelData.language}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-600 mb-1">Dimensions</div>
              <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-600" />
                {modelData.dimensions}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Max Text Length</div>
              <div className="text-sm font-medium text-gray-900">{modelData.maxTextLength}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Batch Size</div>
              <div className="text-sm font-medium text-gray-900">{modelData.batchSize}</div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">Normalize Embeddings</div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={modelData.normalize}
                  onChange={(e) => onNormalizeChange(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-900">
                  {modelData.normalize ? "Enabled" : "Disabled"}
                </span>
              </label>
            </div>
          </div>

          {selectedModelObj && (
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Model Details</div>
              <div className="text-xs text-gray-600">{selectedModelObj.description}</div>
              <div className="text-xs text-gray-600 mt-1">
                Supported: {selectedModelObj.supportedLanguages.join(", ")}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
