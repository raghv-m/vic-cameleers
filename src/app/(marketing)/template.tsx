import { ViewTransition } from "react";

/**
 * Page-to-page fade for every marketing route: the old page fades out over 150ms, then the new
 * one fades in over 200ms (CSS: .vc-page in globals.css). A template remounts on each navigation,
 * so enter and exit fire here, while the header and footer in the layout stay put. Browsers
 * without the View Transitions API just swap pages; reduced motion switches it off.
 */
export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="vc-page" exit="vc-page" default="none">
      {children}
    </ViewTransition>
  );
}
