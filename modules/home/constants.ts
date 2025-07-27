export const PROJECT_TEMPLATES = [
    {
        emoji: "🔐",
        title: "Login & Signup UI",
        prompt:
            "Build a login and signup form with toggle tabs, email/password fields, show/hide password toggle, and frontend-only validation. Include basic error handling and a fake loading state after submit.",
    },
    {
        emoji: "💰",
        title: "Pricing Page",
        prompt:
            "Create a clean pricing section with 3 tiers (e.g., Free, Pro, Premium), toggles for monthly/yearly billing, and a highlight on the most popular plan. Use responsive cards and a checkout button stub.",
    },
    {
        emoji: "📩",
        title: "Newsletter Signup",
        prompt:
            "Design a compact newsletter form with name and email input, validation, and a success state with a thank-you message. Use a fake submit delay and disable the button on click.",
    },
    {
        emoji: "⚙️",
        title: "Settings Panel",
        prompt:
            "Design a user settings page with sections like Profile Info, Notifications, and Appearance. Use tabs or accordions and local state to simulate saving changes and toggling switches.",
    }
] as const;
