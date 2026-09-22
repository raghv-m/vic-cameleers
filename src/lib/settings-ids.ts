/**
 * BusinessSettings and PricingSettings are singleton rows (CLAUDE.md
 * section 1). Fixed ids so seeding and admin writes always target the
 * same row instead of accidentally creating a second one.
 */
export const BUSINESS_SETTINGS_ID = "business_settings_singleton";
export const PRICING_SETTINGS_ID = "pricing_settings_singleton";
