/**
 * The Vic Cameleers camel: a single-hump dromedary (the camels that came to Australia) in side
 * view, drawn as one filled silhouette so it reads at 16px and at 400px. Uses currentColor.
 * TODO(owner): swap for a commissioned logo mark once one exists (CLAUDE.md section 2).
 */
export const CAMEL_PATH =
  "M5.5 18.2c.2-3 2.6-5.6 5.6-6.4 1.4-.4 2.4-1.2 3.2-2.4 2.3-3.6 6.3-5.6 10.3-4.9 3.5.6 6.3 3 7.6 6.2.5 1.2 1.6 2 2.9 2 1.6 0 2.9-.9 3.6-2.3l3.1-6.1c.9-1.8 2.9-2.8 4.9-2.4l3.4.7c1.1.2 1.9 1.1 2 2.2l.1 1.2c.1.9-.6 1.7-1.5 1.7h-2.4c-.9 0-1.7.6-2 1.5l-2.3 7.3c-.5 1.6-1.3 3.1-2.4 4.4l-.8.9c-.5.6-.7 1.3-.6 2.1l1.5 12.7h-2.6l-2.6-11.3h-1.5l-.7 11.3h-2.6l-.4-11.5c-4 .9-8.2.9-12.2.1l-1.1 11.4h-2.6l-.5-11.6h-1.3l-1.9 11.6H9.7l1.1-12.9c-1.1-.5-2-1.4-2.5-2.5-.6.9-1.2 2.1-1.4 3.6l-.3 2.1H5.3l.3-3.4c.1-1-.1-2-.1-3z";

export function CamelMark({
  className,
  title,
}: {
  className?: string;
  /** Pass a title only where the mark stands alone; next to the wordmark it's decorative. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 44"
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path d={CAMEL_PATH} />
    </svg>
  );
}
