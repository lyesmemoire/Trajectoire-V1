/**
 * Trajectoire Design System - Color Tokens
 * Official color palette for the application
 */
// @ts-nocheck


export const colors = {
  // Background Colors
  background: {
    DEFAULT: '#F8F6F3', // Cream background
  },
  
  // Surface Colors
  surface: {
    DEFAULT: '#FFFFFF', // White surface
  },
  
  // Primary Colors
  primary: {
    DEFAULT: '#0F766E', // Emerald green
    hover: '#115E59', // Darker emerald
    light: 'rgba(15, 118, 110, 0.08)',
    lighter: 'rgba(15, 118, 110, 0.04)',
  },
  
  // Secondary Colors
  secondary: {
    DEFAULT: '#C89B3C', // Gold
    hover: '#B8860B', // Darker gold
    light: 'rgba(200, 155, 60, 0.08)',
    lighter: 'rgba(200, 155, 60, 0.04)',
  },
  
  // Text Colors
  text: {
    primary: '#111827', // Near black
    secondary: '#6B7280', // Gray
    tertiary: 'rgba(17, 24, 39, 0.4)',
    inverse: '#FFFFFF',
  },
  
  // Border Colors
  border: {
    DEFAULT: '#E5E7EB', // Light gray
    hover: 'rgba(17, 24, 39, 0.12)',
    focus: '#0F766E',
  },
  
  // Semantic Colors
  success: {
    DEFAULT: '#16A34A', // Green
    light: 'rgba(22, 163, 74, 0.08)',
    lighter: 'rgba(22, 163, 74, 0.04)',
  },
  
  warning: {
    DEFAULT: '#F59E0B', // Orange
    light: 'rgba(245, 158, 11, 0.08)',
    lighter: 'rgba(245, 158, 11, 0.04)',
  },
  
  danger: {
    DEFAULT: '#DC2626', // Red
    light: 'rgba(220, 38, 38, 0.08)',
    lighter: 'rgba(220, 38, 38, 0.04)',
  },
  
  info: {
    DEFAULT: '#2563EB', // Blue
    light: 'rgba(37, 99, 235, 0.08)',
    lighter: 'rgba(37, 99, 235, 0.04)',
  },
} as const;

export type ColorToken = typeof colors;
