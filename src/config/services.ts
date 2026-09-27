export type ServiceSlug =
  | "house-removals"
  | "apartment-removals"
  | "office-removals"
  | "furniture-removals"
  | "packing"
  | "heavy-items"
  | "same-day-removals"
  | "marketplace-pickups"
  | "end-of-lease-moves";

export interface ServiceConfig {
  slug: ServiceSlug;
  name: string;
  /** Primary search phrase for the page title, e.g. "House removals Melbourne". */
  seoKeyword: string;
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
    seoKeyword: "House removals Melbourne",
    shortDescription: "Full home moves, any number of bedrooms, anywhere in Melbourne.",
    enabled: true,
  },
  {
    slug: "apartment-removals",
    name: "Apartment removals",
    seoKeyword: "Apartment removals Melbourne",
    shortDescription: "Units and apartments, including lift bookings and tight access.",
    enabled: true,
  },
  {
    slug: "office-removals",
    name: "Office removals",
    seoKeyword: "Office removals Melbourne",
    shortDescription: "Desks, equipment, and files moved with minimal downtime.",
    enabled: true,
  },
  {
    slug: "furniture-removals",
    name: "Furniture removals",
    seoKeyword: "Furniture removals Melbourne",
    shortDescription: "Single items or marketplace pickups, no full move required.",
    enabled: true,
  },
  {
    slug: "packing",
    name: "Packing",
    seoKeyword: "Packing services Melbourne",
    shortDescription: "Full or partial packing and unpacking, boxes and materials supplied.",
    enabled: true,
  },
  {
    slug: "heavy-items",
    name: "Heavy items",
    seoKeyword: "Heavy item removals Melbourne",
    // TODO(owner): confirm which heavy items the crew actually handles (piano, safe, pool table)
    // and update this description and the flag below before launch.
    shortDescription: "Pianos, safes, and other heavy or awkward items, handled carefully.",
    enabled: false,
  },
  {
    slug: "same-day-removals",
    name: "Same-day removals",
    seoKeyword: "Same-day removals Melbourne",
    shortDescription: "Mover cancelled on you? We can often get a crew out today.",
    enabled: true,
  },
  {
    slug: "marketplace-pickups",
    name: "Marketplace pickups",
    seoKeyword: "Marketplace pickups Melbourne",
    shortDescription: "Facebook Marketplace and Gumtree furniture, picked up and brought home.",
    enabled: true,
  },
  {
    slug: "end-of-lease-moves",
    name: "End-of-lease moves",
    seoKeyword: "End of lease removalists Melbourne",
    shortDescription: "Renters moving out on a deadline, planned around your key handover.",
    enabled: true,
  },
];

export function getEnabledServices(): ServiceConfig[] {
  return services.filter((service) => service.enabled);
}

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return services.find((service) => service.slug === slug && service.enabled);
}
