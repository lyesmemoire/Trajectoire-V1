/**
 * Trajectoire Design System - Motion Tokens
 * Official animation and transition tokens
 */
// @ts-nocheck


export const motion = {
  // Transition Durations
  duration: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
    slower: '700ms',
  },
  
  // Transition Easing
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  
  // Animation Presets
  animations: {
    // Fade
    fade: {
      in: 'fadeIn 0.3s ease-out forwards',
      out: 'fadeOut 0.3s ease-in forwards',
    },
    
    // Fade with direction
    fadeUp: {
      in: 'fadeInUp 0.5s ease-out forwards',
      out: 'fadeOutUp 0.3s ease-in forwards',
    },
    fadeDown: {
      in: 'fadeInDown 0.5s ease-out forwards',
      out: 'fadeOutDown 0.3s ease-in forwards',
    },
    fadeLeft: {
      in: 'fadeInLeft 0.5s ease-out forwards',
      out: 'fadeOutLeft 0.3s ease-in forwards',
    },
    fadeRight: {
      in: 'fadeInRight 0.5s ease-out forwards',
      out: 'fadeOutRight 0.3s ease-in forwards',
    },
    
    // Scale
    scale: {
      in: 'scaleIn 0.3s ease-out forwards',
      out: 'scaleOut 0.3s ease-in forwards',
    },
    
    // Zoom
    zoom: {
      in: 'zoomIn 0.5s ease-out forwards',
      out: 'zoomOut 0.3s ease-in forwards',
    },
    
    // Drawer
    drawer: {
      in: 'drawerIn 0.3s ease-out forwards',
      out: 'drawerOut 0.3s ease-in forwards',
    },
    
    // Modal
    modal: {
      in: 'modalIn 0.3s ease-out forwards',
      out: 'modalOut 0.3s ease-in forwards',
    },
    
    // Toast
    toast: {
      in: 'toastIn 0.3s ease-out forwards',
      out: 'toastOut 0.3s ease-in forwards',
    },
    
    // Hover effects
    hover: {
      card: 'cardHover 0.2s ease-out forwards',
      button: 'buttonHover 0.15s ease-out forwards',
    },
    
    // Page transitions
    page: {
      in: 'pageIn 0.5s ease-out forwards',
      out: 'pageOut 0.3s ease-in forwards',
    },
    
    // Skeleton loading
    skeleton: 'skeleton 1.5s ease-in-out infinite',
    
    // Pulse
    pulse: 'pulse 2s ease-in-out infinite',
    
    // Spin
    spin: 'spin 1s linear infinite',
  },
  
  // Keyframes
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
    fadeInUp: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    fadeOutUp: {
      from: { opacity: 1, transform: 'translateY(0)' },
      to: { opacity: 0, transform: 'translateY(-20px)' },
    },
    fadeInDown: {
      from: { opacity: 0, transform: 'translateY(-20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    fadeOutDown: {
      from: { opacity: 1, transform: 'translateY(0)' },
      to: { opacity: 0, transform: 'translateY(20px)' },
    },
    fadeInLeft: {
      from: { opacity: 0, transform: 'translateX(-20px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
    },
    fadeOutLeft: {
      from: { opacity: 1, transform: 'translateX(0)' },
      to: { opacity: 0, transform: 'translateX(-20px)' },
    },
    fadeInRight: {
      from: { opacity: 0, transform: 'translateX(20px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
    },
    fadeOutRight: {
      from: { opacity: 1, transform: 'translateX(0)' },
      to: { opacity: 0, transform: 'translateX(20px)' },
    },
    scaleIn: {
      from: { opacity: 0, transform: 'scale(0.95)' },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    scaleOut: {
      from: { opacity: 1, transform: 'scale(1)' },
      to: { opacity: 0, transform: 'scale(0.95)' },
    },
    zoomIn: {
      from: { opacity: 0, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    zoomOut: {
      from: { opacity: 1, transform: 'scale(1)' },
      to: { opacity: 0, transform: 'scale(0.9)' },
    },
    drawerIn: {
      from: { transform: 'translateX(100%)' },
      to: { transform: 'translateX(0)' },
    },
    drawerOut: {
      from: { transform: 'translateX(0)' },
      to: { transform: 'translateX(100%)' },
    },
    modalIn: {
      from: { opacity: 0, transform: 'scale(0.95)' },
      to: { opacity: 1, transform: 'scale(1)' },
    },
    modalOut: {
      from: { opacity: 1, transform: 'scale(1)' },
      to: { opacity: 0, transform: 'scale(0.95)' },
    },
    toastIn: {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    toastOut: {
      from: { opacity: 1, transform: 'translateY(0)' },
      to: { opacity: 0, transform: 'translateY(20px)' },
    },
    cardHover: {
      from: { transform: 'translateY(0)' },
      to: { transform: 'translateY(-4px)' },
    },
    buttonHover: {
      from: { transform: 'scale(1)' },
      to: { transform: 'scale(1.02)' },
    },
    pageIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    pageOut: {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
    skeleton: {
      '0%, 100%': { backgroundPosition: '200% 0' },
      '50%': { backgroundPosition: '-200% 0' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  },
  
  // Stagger Delays
  stagger: {
    1: '100ms',
    2: '200ms',
    3: '300ms',
    4: '400ms',
    5: '500ms',
  },
} as const;

export type MotionToken = typeof motion;
