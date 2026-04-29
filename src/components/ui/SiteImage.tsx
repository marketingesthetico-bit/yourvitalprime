import * as fs from "node:fs";
import * as path from "node:path";

type SiteImageProps = {
  /** Filename inside public/images (e.g. "hero-home.jpg") */
  name: string;
  alt: string;
  /** CSS aspect ratio. Defaults to "16/9". Use "auto" to let intrinsic size win. */
  aspect?: string;
  /** Object-fit override. Defaults to "cover". */
  fit?: "cover" | "contain";
  /** Object-position. Defaults to "center". */
  position?: string;
  /** Native loading attr. Defaults to "lazy"; pass "eager" for above-the-fold. */
  loading?: "lazy" | "eager";
  /** Native fetchPriority. Use "high" for the LCP image. */
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
  /** Optional caption for placeholder when image is missing — context only. */
  placeholderLabel?: string;
};

/**
 * Renders an editorial photo from /public/images/. If the file isn't there yet
 * (e.g. before running `npm run gen:images`), renders a warm gradient placeholder
 * so layouts still look intentional. The check happens at render-time on the
 * server, so the choice is baked into the HTML.
 */
export function SiteImage({
  name,
  alt,
  aspect = "16/9",
  fit = "cover",
  position = "center",
  loading = "lazy",
  fetchPriority = "auto",
  className,
  placeholderLabel,
}: SiteImageProps) {
  const exists = fileExists(name);
  const aspectStyle: React.CSSProperties =
    aspect === "auto" ? {} : { aspectRatio: aspect };

  if (!exists) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative overflow-hidden ${className ?? ""}`}
        style={{
          ...aspectStyle,
          backgroundColor: "var(--color-surface-2)",
          backgroundImage:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-secondary) 22%, transparent) 0%, transparent 35%), linear-gradient(225deg, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, transparent 45%), radial-gradient(ellipse at 30% 70%, color-mix(in srgb, var(--color-secondary-100) 65%, transparent) 0%, transparent 60%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.18  0 0 0 0 0.13  0 0 0 0 0.09  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
        />
        {placeholderLabel && (
          <div
            className="absolute inset-0 flex items-end p-5 lg:p-7"
            aria-hidden="true"
          >
            <span
              className="eyebrow"
              style={{
                color: "var(--color-secondary-700)",
                background:
                  "color-mix(in srgb, var(--color-surface) 85%, transparent)",
                padding: "0.25rem 0.5rem",
                borderRadius: 4,
              }}
            >
              {placeholderLabel}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`/images/${name}`}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
      style={{
        ...aspectStyle,
        objectFit: fit,
        objectPosition: position,
        width: "100%",
        height: aspect === "auto" ? "auto" : "100%",
        display: "block",
      }}
    />
  );
}

function fileExists(name: string): boolean {
  try {
    const resolved = path.resolve(process.cwd(), "public", "images", name);
    return fs.existsSync(resolved);
  } catch {
    return false;
  }
}
