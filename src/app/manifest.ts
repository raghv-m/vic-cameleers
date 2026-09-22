import type { MetadataRoute } from "next";

import { business } from "@/config/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${business.tradingName} — Melbourne Removalists`,
    short_name: business.tradingName,
    description: `Removalists based in ${business.baseSuburb}, moving homes and businesses across ${business.serviceAreaDescription}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f0",
    theme_color: "#c1502e",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
