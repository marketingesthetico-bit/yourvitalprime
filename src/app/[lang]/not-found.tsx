import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-narrow py-24 lg:py-32 text-center">
      <p
        className="text-sm uppercase mb-4"
        style={{
          fontFamily: "var(--font-ui)",
          color: "var(--color-text-muted)",
          letterSpacing: "0.12em",
          fontWeight: 500,
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "var(--text-h1)",
          color: "var(--color-primary)",
          marginBottom: "1rem",
        }}
      >
        We couldn't find that page.
      </h1>
      <p
        className="max-w-xl mx-auto mb-8"
        style={{ color: "var(--color-text-soft)", fontSize: "1.125rem" }}
      >
        The link may be broken, or the page may have moved. Try the homepage
        or browse our latest articles.
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Link href="/en" className="btn-primary">
          Home
        </Link>
        <Link href="/en/blog" className="btn-secondary">
          All articles
        </Link>
      </div>
    </section>
  );
}
