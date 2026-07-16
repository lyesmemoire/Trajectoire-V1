import { MotionValue, animate } from "framer-motion";
import { HaloState } from "./HaloState";
import { haloPresets } from "./HaloPresets";

/**
 * Handles smooth interpolation between states and physics-based audio reactivity.
 */
export class HaloPhysics {
  private scaleSource: MotionValue<number>;
  private opacitySource: MotionValue<number>;
  
  private currentAnimation: any = null;

  constructor(scaleSource: MotionValue<number>, opacitySource: MotionValue<number>) {
    this.scaleSource = scaleSource;
    this.opacitySource = opacitySource;
  }

  public applyState(state: HaloState) {
    if (this.currentAnimation) {
      this.currentAnimation.stop();
    }

    if (state === "candidateSpeaking") {
      // For candidate speaking, we don't loop an animation, 
      // we let applyAudioVolume() drive the physics smoothly.
      // We just ensure a baseline.
      animate(this.opacitySource, haloPresets.candidateSpeaking.opacity[0], { duration: 0.5 });
      return;
    }

    const preset = haloPresets[state];
    
    this.currentAnimation = animate(this.scaleSource, preset.scale, {
      duration: preset.duration,
      ease: "easeInOut",
      repeat: Infinity,
    });

    animate(this.opacitySource, preset.opacity, {
      duration: preset.duration,
      ease: "easeInOut",
      repeat: Infinity,
    });
  }

  public applyAudioVolume(volume: number, isCandidateSpeaking: boolean) {
    if (!isCandidateSpeaking) return;

    // Smoothly apply volume to scale (e.g. 1.0 to 1.3)
    const targetScale = 1 + Math.min(volume, 1) * 0.3;
    const targetOpacity = 0.5 + Math.min(volume, 1) * 0.3;

    // We use a spring-like smooth approach by animating to the target
    animate(this.scaleSource, targetScale, {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 0.5
    });

    animate(this.opacitySource, targetOpacity, {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 0.5
    });
  }
}
