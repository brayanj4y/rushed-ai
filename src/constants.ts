export const PROJECT_TEMPLATES = [
  {
    emoji: "📊",
    title: "Admin Dashboard",
    prompt:
      "Create a responsive admin dashboard with a sidebar, stat cards, a chart placeholder, and a sortable, paginated table. Use consistent spacing, visual grouping, and modern, professional UI patterns.",
  },
  {
    emoji: "🗂️",
    title: "Kanban Board",
    prompt:
      "Build a kanban board with drag-and-drop (react-beautiful-dnd), task add/remove, and smooth hover states. Ensure balanced column widths, clean spacing, and polished interaction design.",
  },
  {
    emoji: "🎵",
    title: "Music Player",
    prompt:
      "Design a Spotify-style music player with playlists in a sidebar, song details in the main view, and intuitive playback controls. Use local state for playback and selection, with dark mode and a sleek, balanced layout.",
  },
] as const;

export const MAX_SEGMENTS = 4;

export const SANDBOX_TIMEOUT_IN_MS = 60_000 * 10 * 3; // 30 mins
