export type ServiceSlug =
  | "house-removals"
  | "apartment-removals"
  | "office-removals"
  | "furniture-removals"
  | "packing"
  | "heavy-items"
  | "same-day-removals";

export interface ServiceConfig {
  slug: ServiceSlug;
  name: string;
  shortDescription: string;
  enabled: boolean;
}

/**
 * Toggle `enabled` to switch a service on or off across the whole site
 * (nav, services hub, homepage grid, sitemap) without touching code.
 */
export const services: ServiceConfig[] = [
  {
    slug: "house-removals",
    name: "House removals",
    shortDescription: "Full home moves, any number of bedrooms, anywhere in Melbourne.",
    enabled: true,
  },
  {
    slug: "apartment-removals",
    name: "Apartment removals",
    shortDescription: "Units and apartments, including lift bookings and tight access.",
    enabled: true,
  },
  {
    slug: "office-removals",
    name: "Office removals",
    shortDescription: "Desks, equipment, and files moved with minimal downtime.",
    enabled: true,
  },
  {
    slug: "furniture-removals",
    name: "Furniture removals",
    shortDescription: "Single items or marketplace pickups, no full move required.",
    enabled: true,
  },
  {
    slug: "packing",
    name: "Packing",
    shortDescription: "Full or partial packing and unpacking, boxes and materials supplied.",
    enabled: true,
  },
  {
    slug: "heavy-items",
    name: "Heavy items",
    // TODO(owner): confirm which heavy items the crew actually handles (piano, safe, pool table)
    // and update this description and the flag below before launch.
    shortDescription: "Pianos, safes, and other heavy or awkward items, handled carefully.",
    enabled: false,
  },
  {
    slug: "same-day-removals",
    name: "Same-day removals",
    shortDescription: "Mover cancelled on you? We can often get a crew out today.",
    enabled: true,
  },
];

export function getEnabledServices(): ServiceConfig[] {
  return services.filter((service) => service.enabled);
}

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return services.find((service) => service.slug === slug && service.enabled);
}
