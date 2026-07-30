/**
 * Design tokens — Trajectoire (Premium Professionnel)
 * Source de vérité unique. Toute nouvelle page/composant DOIT s'y référer.
 * Ne jamais introduire slate/indigo/blue/stone brut ailleurs.
 */

export const colors = {
  bg: {
    primary: '#FBF9F6',   // ivoire-50 — fond global
    elevated: '#F5F2EC',  // ivoire-100 — sections alternées
    card: '#FFFFFF',
  },
  text: {
    primary: '#1C1917',   // ink-900
    secondary: '#57534E', // ink-600
    muted: '#A8A29E',     // ink-400
    inverse: '#FBF9F6',
  },
  accent: {
    bronze: '#A67C3D',
    bronzeHover: '#8B6529',
    bronzeSoft: '#F0E4CC',
  },
  border: {
    default: '#E7E2DB',
    hover: '#D6CFC3',
  },
  cta: {
    primary: '#1C1917',
    primaryHover: '#292524',
  },
  state: {
    success: {
      bg: '#F0F5F1',
      text: '#2F6844',
      border: '#CDE0D1',
    },
    warning: {
      bg: '#FBF0EA',
      text: '#B7472A',   // terracotta — distinct du bronze
      border: '#F0D9CC',
    },
    error: {
      bg: '#FAEEEE',
      text: '#9B2C2C',
      border: '#EBCFCF',
    },
    info: {
      bg: '#F5F2EC',
      text: '#57534E',
      border: '#E7E2DB',
    },
  },
} as const

export const radius = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
} as const

export const shadow = {
  card: 'shadow-premium',
  cardHover: 'shadow-premium-lg',
} as const

export const fonts = {
  heading: 'font-serif', // Fraunces / Georgia
  body: 'font-sans',     // Inter / system-ui
} as const

/** Règle : le bronze est un accent RARE (CTA secondaire, badge PRO, hover discret).
 * Le CTA principal reste toujours ink-900. Ne jamais mettre le bronze en fond large. */
