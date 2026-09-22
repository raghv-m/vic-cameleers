import { business } from "@/config/business";

export interface SuburbContent {
  slug: string;
  name: string;
  postcode: string;
  lga: string;
  /** Short, honest, non-invented description of the area's general character. */
  character: string;
  nearbySlugs: string[];
}

/**
 * Launch suburb list (CLAUDE.md section 7), Cranbourne area first. Postcode
 * and LGA are sourced from public directories (Wikipedia/Domain), not
 * invented, but like everything else on these pages they're drafted content
 * and need an owner sign-off before launch, see the review notice rendered
 * on every suburb page and TODO-OWNER.md. Nothing here claims a specific
 * travel time (that needs the Google Maps integration, still pending) or
 * any landmark, council rule, or parking law we haven't verified.
 */
export const suburbs: SuburbContent[] = [
  {
    slug: "cranbourne",
    name: "Cranbourne",
    postcode: "3977",
    lga: "City of Casey",
    character: `Our home base. ${business.tradingName} is based in Cranbourne, so this is the suburb we know best and can usually get a crew to fastest.`,
    nearbySlugs: [
      "cranbourne-east",
      "cranbourne-north",
      "cranbourne-west",
      "clyde",
      "botanic-ridge",
    ],
  },
  {
    slug: "cranbourne-east",
    name: "Cranbourne East",
    postcode: "3977",
    lga: "City of Casey",
    character:
      "A growing residential pocket right next to our Cranbourne base, with a mix of established streets and newer housing.",
    nearbySlugs: ["cranbourne", "cranbourne-north", "clyde", "clyde-north"],
  },
  {
    slug: "cranbourne-north",
    name: "Cranbourne North",
    postcode: "3977",
    lga: "City of Casey",
    character:
      "One of the newer growth areas bordering Cranbourne, with a lot of recently built homes and estates.",
    nearbySlugs: ["cranbourne", "cranbourne-east", "hampton-park", "narre-warren-south"],
  },
  {
    slug: "cranbourne-west",
    name: "Cranbourne West",
    postcode: "3977",
    lga: "City of Casey",
    character: "Another close neighbour to our base, with established residential streets.",
    nearbySlugs: ["cranbourne", "cranbourne-south", "cranbourne-north", "botanic-ridge"],
  },
  {
    slug: "clyde",
    name: "Clyde",
    postcode: "3978",
    lga: "City of Casey",
    character:
      "Part of the fast-growing Casey growth corridor, with a lot of new estate development.",
    nearbySlugs: ["cranbourne", "cranbourne-east", "clyde-north"],
  },
  {
    slug: "clyde-north",
    name: "Clyde North",
    postcode: "3978",
    lga: "City of Casey",
    character:
      "One of the biggest growth areas in outer south-east Melbourne, mostly newer housing estates.",
    nearbySlugs: ["clyde", "cranbourne-east", "berwick", "officer"],
  },
  {
    slug: "berwick",
    name: "Berwick",
    postcode: "3806",
    lga: "City of Casey",
    character:
      "An established township with a mix of older character homes and newer estates further out.",
    nearbySlugs: ["clyde-north", "narre-warren", "narre-warren-south", "officer"],
  },
  {
    slug: "narre-warren",
    name: "Narre Warren",
    postcode: "3805",
    lga: "City of Casey",
    character: "A well-established residential and retail hub in the City of Casey.",
    nearbySlugs: ["narre-warren-south", "berwick", "hampton-park", "cranbourne-north"],
  },
  {
    slug: "narre-warren-south",
    name: "Narre Warren South",
    postcode: "3805",
    lga: "City of Casey",
    character: "A large, established residential area south of the Narre Warren town centre.",
    nearbySlugs: ["narre-warren", "berwick", "hampton-park", "lynbrook"],
  },
  {
    slug: "hampton-park",
    name: "Hampton Park",
    postcode: "3976",
    lga: "City of Casey",
    character: "An established suburb with a mix of housing types close to Narre Warren.",
    nearbySlugs: ["narre-warren", "narre-warren-south", "lynbrook", "cranbourne-north"],
  },
  {
    slug: "lynbrook",
    name: "Lynbrook",
    postcode: "3975",
    lga: "City of Casey",
    character: "A smaller, mostly residential suburb bordering Hampton Park and Lyndhurst.",
    nearbySlugs: ["hampton-park", "lyndhurst", "narre-warren-south"],
  },
  {
    slug: "lyndhurst",
    name: "Lyndhurst",
    postcode: "3975",
    lga: "City of Casey / City of Greater Dandenong",
    character: "A newer residential and industrial mix bordering the Dandenong area.",
    nearbySlugs: ["lynbrook", "hampton-park", "keysborough"],
  },
  {
    slug: "officer",
    name: "Officer",
    postcode: "3809",
    lga: "Shire of Cardinia",
    character: "A fast-growing suburb in the Cardinia growth corridor, mostly newer estates.",
    nearbySlugs: ["clyde-north", "berwick", "pakenham"],
  },
  {
    slug: "pakenham",
    name: "Pakenham",
    postcode: "3810",
    lga: "Shire of Cardinia",
    character:
      "A major town centre further out the south-east growth corridor, with both established and new housing.",
    nearbySlugs: ["officer", "berwick"],
  },
  {
    slug: "dandenong",
    name: "Dandenong",
    postcode: "3175",
    lga: "City of Greater Dandenong",
    character:
      "A major regional centre with a mix of established residential streets, apartments, and industrial areas.",
    nearbySlugs: ["keysborough", "lyndhurst"],
  },
  {
    slug: "keysborough",
    name: "Keysborough",
    postcode: "3173",
    lga: "City of Greater Dandenong",
    character:
      "An established residential suburb next to Dandenong, with a range of housing types.",
    nearbySlugs: ["dandenong", "lyndhurst"],
  },
  {
    slug: "frankston",
    name: "Frankston",
    postcode: "3199",
    lga: "City of Frankston",
    character:
      "A bayside regional city with established suburbs, apartments near the foreshore, and a busy town centre.",
    nearbySlugs: ["carrum-downs", "langwarrin", "skye"],
  },
  {
    slug: "carrum-downs",
    name: "Carrum Downs",
    postcode: "3201",
    lga: "City of Frankston",
    character: "An established residential and light industrial suburb north of Frankston.",
    nearbySlugs: ["frankston", "langwarrin", "skye"],
  },
  {
    slug: "skye",
    name: "Skye",
    postcode: "3977",
    lga: "City of Frankston",
    character: "A residential area bordering Cranbourne and the Frankston growth corridor.",
    nearbySlugs: ["carrum-downs", "botanic-ridge", "frankston"],
  },
  {
    slug: "botanic-ridge",
    name: "Botanic Ridge",
    postcode: "3977",
    lga: "City of Casey",
    character: "A newer residential estate near the Royal Botanic Gardens Cranbourne site.",
    nearbySlugs: ["cranbourne", "cranbourne-west", "skye"],
  },
  {
    slug: "langwarrin",
    name: "Langwarrin",
    postcode: "3910",
    lga: "City of Frankston",
    character: "An established leafy suburb on the Frankston side of our service area.",
    nearbySlugs: ["carrum-downs", "frankston", "skye"],
  },
];

export function getSuburbBySlug(slug: string): SuburbContent | undefined {
  return suburbs.find((suburb) => suburb.slug === slug);
}
