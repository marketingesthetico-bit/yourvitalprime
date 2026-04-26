type PageHeaderProps = {
  title: string;
  subtitle?: string;
  meta?: string;
};

export function PageHeader({ title, subtitle, meta }: PageHeaderProps) {
  return (
    <header
      className="border-b"
      style={{
        backgroundColor: "var(--color-surface-2)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="container-narrow py-14 lg:py-20">
        {meta && (
          <p
            className="mb-3 text-sm uppercase tracking-wider"
            style={{
              fontFamily: "var(--font-ui)",
              color: "var(--color-text-muted)",
              letterSpacing: "0.08em",
              fontWeight: 500,
            }}
          >
            {meta}
          </p>
        )}
        <h1
          style={{
            fontSize: "var(--text-h1)",
            color: "var(--color-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-4 max-w-2xl"
            style={{
              fontSize: "var(--text-body-lg)",
              color: "var(--color-text-soft)",
              lineHeight: 1.55,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
