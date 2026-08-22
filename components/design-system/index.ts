// Core Components (from ui-rebuild)
export { Button, buttonVariants } from "./button";
export { Input } from "./input";
export { Textarea } from "./textarea";
export { Badge, badgeVariants } from "./badge";

// Card Components (from ui-rebuild)
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
} from "./card";
export { HeroCard } from "./hero-card";
export { PricingCard } from "./pricing-card";
export { DashboardCard } from "./dashboard-card";

// Layout Components (from ui-rebuild)
export { Section } from "./section";
export { Container } from "./container";
export { Navbar, NavbarLogo, NavbarLink, NavbarActions } from "./navbar";
export { Footer, FooterColumn, FooterLink } from "./footer";
export { Sidebar, SidebarHeader, SidebarLogo, SidebarContent, SidebarSection, SidebarLink, SidebarFooter } from "./sidebar";

// Marketing Components (from ui-rebuild)
export { CTA } from "./cta";
export { Timeline } from "./timeline";
export { FAQ } from "./faq";
export { Testimonial } from "./testimonial";
export { LogoCloud } from "./logo-cloud";
export { Hero } from "./hero";
export { HeroBadge, HeroActions } from "./hero";

// Utility Components (from ui-rebuild)
export { StatCard } from "./stat-card";
export { MetricCard, MetricCardIcon, MetricCardValue } from "./metric-card";
export { EmptyState } from "./empty-state";
export { Alert, alertVariants } from "./alert";

// UX Enhancement Components (from ui-rebuild)
export {
  Toast,
  ToastContainer,
  ToastProvider,
  useToast,
} from "./toast";
export { Confetti, ConfettiBurst } from "./confetti";
export {
  Loader,
  PageLoader,
  Skeleton,
  CardSkeleton,
  ListSkeleton,
} from "./loader";
export {
  Progress,
  CircularProgress,
  SteppedProgress,
  LoadingBar,
} from "./progress";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";
// Charts are excluded from the barrel to avoid pulling recharts (~125 kB)
// into the shared JS. Import directly from "@/components/design-system/charts"
// when needed.
export {
  PageTransition,
  PageTransitionWrapper,
  StaggerChildren,
  Reveal,
  ViewportReveal,
} from "./page-transition";
export { FadeIn } from "./fade-in";
export {
  ScrollAnimation,
  Parallax,
  StaggeredScroll,
  ScaleOnScroll,
  RotateOnScroll,
} from "./scroll-animation";
export {
  HoverEffect,
  FocusVisible,
  Ripple,
  MagneticButton,
  Tooltip,
  PressFeedback,
  HoverCard,
} from "./hover-focus";
export {
  Shake,
  Bounce,
  Pulse,
  TypingAnimation,
  Counter,
  Heart,
  AnimatedCheckbox,
  AnimatedSwitch,
  CopyButton,
  Rating,
} from "./micro-interactions";
export {
  TouchButton,
  Swipe,
  PullToRefresh,
  BottomSheet,
  SafeArea,
  ResponsiveContainer,
  HapticFeedback,
  LongPress,
} from "./mobile-optimization";
export {
  useKeyboardNavigation,
  useFocusTrap,
  SkipToContent,
  AccessibleButton,
  KeyboardShortcut,
  CommandPalette,
  LiveRegion,
  FocusIndicator,
  AccessibleCard,
  AccessibleMenu,
} from "./keyboard-navigation";
export {
  useRoutePreloader,
  ImagePreloader,
  ResourcePreloader,
  SmartPreloader,
  LazyLoad,
  SuspenseBoundary,
  ProgressiveImage,
  CriticalCSS,
  PrefetchLinks,
  useConnectionAwarePreloading,
} from "./preloader";
export {
  checkContrastRatio,
  validateAriaAttributes,
  manageFocus,
  announceToScreenReader,
  generateSkipLinks,
  validateLandmarks,
  validateHeadingStructure,
  validateFormAccessibility,
  validateImageAlts,
  WCAGReport,
} from "./wcag-compliance";
