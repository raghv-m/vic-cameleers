import { emailColors } from "./layout";

/** The terracotta call-to-action button shared by customer emails. */
export const emailButtonStyle = {
  backgroundColor: emailColors.primary,
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
  marginTop: 16,
} as const;
