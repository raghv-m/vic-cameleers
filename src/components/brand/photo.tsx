import Image from "next/image";
import { cn } from "cn";

import { SceneIllustration } from "@/components/brand/illustrations";
import { images, type ImageId } from "@/config/images";

/**
 * One photo slot from src/config/images.ts. With a real photo: a responsive next/image
 * (AVIF/WebP, sized by `sizes`, lazy unless `priority`). Without one: an illustrated kraft
 * placeholder at the same aspect ratio, labelled with what the photo will be. Either way the
 * box is reserved up front, so nothing shifts and nothing renders as an empty gap.
 */
export function Photo({
  id,
  sizes,
  priority = false,
  className,
  ratio,
  label = true,
  roller = false,
}: {
  id: ImageId;
  /** The `sizes` attribute for next/image, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Override the aspect ratio for this placement, e.g. "4 / 5" on mobile via a class instead. */
  ratio?: string;
  /** Show the "PHOTO: ..." label on the placeholder. Off for tiny thumbnails. */
  label?: boolean;
  /** Roller-door clip reveal as it scrolls in (never fully hidden, see globals.css). */
  roller?: boolean;
}) {
  const image = images[id];
  const aspectRatio = ratio ?? `${image.width} / ${image.height}`;

  return (
    <div
      className={cn("relative overflow-hidden rounded-sm", roller && "vc-roller", className)}
      style={{ aspectRatio }}
    >
      {image.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: image.focal }}
        />
      ) : (
        <div aria-hidden="true" className="kraft-band absolute inset-0">
          <div className="blueprint-grid absolute inset-0 opacity-60" />
          <SceneIllustration
            scene={image.scene}
            className="text-navy-900/55 absolute inset-0 m-auto h-[78%] w-[88%]"
          />
          {label && (
            <p className="bg-sand-50/90 text-navy-900 absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-sm px-2 py-1 text-[0.6875rem] leading-snug font-semibold tracking-[0.08em] uppercase">
              Photo: {image.purpose}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
