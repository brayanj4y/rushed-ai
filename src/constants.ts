export const PROJECT_TEMPLATES = [
  {
    emoji: "⚙️",
    title: "Build a settings page",
    prompt:
      "Build a modern, responsive settings page with a sidebar for sections (Profile, Security, Notifications), editable form fields with labels and validation, and Save/Cancel buttons. Use clear section grouping, consistent spacing, and typography. Ensure light and dark mode support.",
  },

  {
    emoji: "🔑",
    title: "Build a login page",
    prompt:
      "Create a sleek login page with a centered form (email + password inputs), a prominent login button, 'Forgot password?' and 'Sign up' links, and a background with a subtle gradient or illustration. Ensure mobile responsiveness and dark mode compatibility.",
  },

  {
    emoji: "💳",
    title: "Build a pricing page",
    prompt:
      "Design a clean pricing page with 3 pricing tiers in responsive cards, feature checklists per tier, and clear 'Select Plan' buttons. Highlight the recommended plan with emphasis. Use balanced spacing, typography, and color contrast for clarity and appeal.",
  },
] as const;

export const MAX_SEGMENTS = 4;

export const SANDBOX_TIMEOUT_IN_MS = 60_000 * 10 * 3; // 30 mins
