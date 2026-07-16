import { colors } from "../tokens/colors";

export const lightTheme = {
  surface: colors.slate[50],
  "surface-secondary": colors.white,
  "surface-elevated": colors.white,

  primary: colors.sky[400],
  "primary-soft": colors.sky[50],

  success: colors.emerald[400],
  warning: colors.amber[400],
  danger: colors.amber[500], // Pas de rouge, on utilise Amber

  "text-primary": colors.slate[800],
  "text-secondary": colors.slate[600],
  "text-muted": colors.slate[400],
  "text-inverse": colors.white,

  "border-subtle": colors.slate[100],
  "border-default": colors.slate[200],
};
