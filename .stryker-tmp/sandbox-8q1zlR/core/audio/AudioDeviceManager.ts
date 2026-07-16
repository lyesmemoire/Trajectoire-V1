/**
 * Audio Device Manager
 *
 * Responsibilities:
 * - List available audio devices
 * - Select input device (microphone)
 * - Select output device (speakers)
 * - Detect device changes
 * - Clean up resources
 *
 * NO business logic, NO reasoning, NO analysis
 * ONLY audio device management
 */
// @ts-nocheck


// ============================================================================
// AUDIO DEVICE INFO
// ============================================================================

export interface AudioDeviceInfo {
  deviceId: string;
  kind: "audioinput" | "audiooutput";
  label: string;
  groupId?: string;
}

// ============================================================================
// AUDIO DEVICE MANAGER INTERFACE
// ============================================================================

export interface AudioDeviceManager {
  enumerateDevices(): Promise<AudioDeviceInfo[]>;
  getInputDevices(): Promise<AudioDeviceInfo[]>;
  getOutputDevices(): Promise<AudioDeviceInfo[]>;
  selectInputDevice(deviceId: string): void;
  selectOutputDevice(deviceId: string): void;
  getSelectedInputDevice(): string | null;
  getSelectedOutputDevice(): string | null;
  subscribeToDeviceChanges(callback: (devices: AudioDeviceInfo[]) => void): void;
  cleanup(): void;
}

// ============================================================================
// AUDIO DEVICE MANAGER IMPLEMENTATION
// ============================================================================

export class AudioDeviceManagerImpl implements AudioDeviceManager {
  private selectedInputDevice: string | null = null;
  private selectedOutputDevice: string | null = null;
  private deviceChangeCallbacks: Array<(devices: AudioDeviceInfo[]) => void> = [];
  private deviceChangeObserver: MutationObserver | null = null;

  async enumerateDevices(): Promise<AudioDeviceInfo[]> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter(device => device.kind === "audioinput" || device.kind === "audiooutput")
      .map(device => ({
        deviceId: device.deviceId,
        kind: device.kind as "audioinput" | "audiooutput",
        label: device.label || `${device.kind} ${device.deviceId}`,
        groupId: device.groupId
      }));
  }

  async getInputDevices(): Promise<AudioDeviceInfo[]> {
    const devices = await this.enumerateDevices();
    return devices.filter(device => device.kind === "audioinput");
  }

  async getOutputDevices(): Promise<AudioDeviceInfo[]> {
    const devices = await this.enumerateDevices();
    return devices.filter(device => device.kind === "audiooutput");
  }

  selectInputDevice(deviceId: string): void {
    this.selectedInputDevice = deviceId;
  }

  selectOutputDevice(deviceId: string): void {
    this.selectedOutputDevice = deviceId;
  }

  getSelectedInputDevice(): string | null {
    return this.selectedInputDevice;
  }

  getSelectedOutputDevice(): string | null {
    return this.selectedOutputDevice;
  }

  subscribeToDeviceChanges(callback: (devices: AudioDeviceInfo[]) => void): void {
    this.deviceChangeCallbacks.push(callback);

    // Setup device change listener
    if (navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener("devicechange", () => {
        this.handleDeviceChange();
      });
    }
  }

  cleanup(): void {
    this.deviceChangeCallbacks = [];
    this.selectedInputDevice = null;
    this.selectedOutputDevice = null;

    if (this.deviceChangeObserver) {
      this.deviceChangeObserver.disconnect();
      this.deviceChangeObserver = null;
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async handleDeviceChange(): Promise<void> {
    const devices = await this.enumerateDevices();
    this.deviceChangeCallbacks.forEach(callback => callback(devices));
  }
}
