import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Only Math",
    short_name: "Only Math",
    description:
      "Practice Olympiad Mathematics, SAT Math and Daily Problems.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#16a34a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}