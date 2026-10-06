import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tadka · What to cook today?",
    short_name: "Tadka",
    description: "Describe what you feel like eating; Jev finds the Indian dish that fits.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdf1f2",
    theme_color: "#e3256b",
    categories: ["food", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
