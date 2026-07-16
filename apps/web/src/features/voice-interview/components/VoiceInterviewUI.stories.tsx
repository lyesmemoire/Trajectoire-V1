import type { Meta, StoryObj } from '@storybook/react';
import { VoiceInterviewUI } from '../../../../src/features/voice-interview/components/VoiceInterviewUI';
import { useInterview, useAudio, useConnection, usePermissions } from '../../../../src/features/voice-interview/hooks';
import React from 'react';

// Mocking hooks for Storybook
jest.mock('../../../../src/features/voice-interview/hooks', () => ({
  useInterview: jest.fn(),
  useAudio: jest.fn(),
  useConnection: jest.fn(),
  usePermissions: jest.fn(),
}));

const meta = {
  title: 'Voice Interview/VoiceInterviewUI',
  component: VoiceInterviewUI,
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true }
        ]
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-screen w-full bg-surface">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VoiceInterviewUI>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic scenario: Candidate is waiting to start
export const WaitingToStart: Story = {
  beforeEach: () => {
    (useInterview as jest.Mock).mockReturnValue({
      currentState: "WaitingInterview",
      currentQuestion: null,
      startInterview: () => {},
      pause: () => {},
      resume: () => {},
      end: () => {}
    });
    (useAudio as jest.Mock).mockReturnValue({ microphoneLevel: 0 });
    (useConnection as jest.Mock).mockReturnValue({ status: "connected", latencyMs: 50, error: null });
    (usePermissions as jest.Mock).mockReturnValue({ permission: "granted" });
  }
};

export const AIThinking: Story = {
  beforeEach: () => {
    (useInterview as jest.Mock).mockReturnValue({
      currentState: "WaitingAI",
      currentQuestion: "Pouvez-vous vous présenter ?",
      startInterview: () => {},
      pause: () => {},
      resume: () => {},
      end: () => {}
    });
    (useAudio as jest.Mock).mockReturnValue({ microphoneLevel: 0 });
    (useConnection as jest.Mock).mockReturnValue({ status: "connected", latencyMs: 50, error: null });
    (usePermissions as jest.Mock).mockReturnValue({ permission: "granted" });
  }
};

export const AISpeaking: Story = {
  beforeEach: () => {
    (useInterview as jest.Mock).mockReturnValue({
      currentState: "PlayingTTS",
      currentQuestion: "Pouvez-vous vous présenter ?",
      startInterview: () => {},
      pause: () => {},
      resume: () => {},
      end: () => {}
    });
    (useAudio as jest.Mock).mockReturnValue({ microphoneLevel: 0 });
    (useConnection as jest.Mock).mockReturnValue({ status: "connected", latencyMs: 50, error: null });
    (usePermissions as jest.Mock).mockReturnValue({ permission: "granted" });
  }
};
