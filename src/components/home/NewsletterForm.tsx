"use client";

import { useState } from "react";
import type { StringSet } from "@/lib/i18n/strings";

type NewsletterFormProps = {
  strings: StringSet["home"];
};

export function NewsletterForm({ strings }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    // Wire to ConvertKit / Firestore in Phase 6. For now, soft-success.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div
        className="max-w-xl mx-auto p-6 rounded-2xl"
        style={{
          backgroundColor: "var(--color-secondary-50)",
          border: "1px solid var(--color-secondary-100)",
        }}
        role="status"
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            color: "var(--color-secondary-900)",
            marginTop: 0,
            marginBottom: "0.5rem",
            fontWeight: 600,
          }}
        >
          {strings.newsletterSuccessTitle}
        </p>
        <p
          style={{
            color: "var(--color-text-soft)",
            margin: 0,
            fontSize: "1rem",
          }}
        >
          {strings.newsletterSuccessBody}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder={strings.newsletterPlaceholder}
        className="flex-1 px-4 py-3 rounded-xl outline-none transition-colors text-[1.0625rem]"
        style={{
          backgroundColor: "#FFFEFC",
          border: `1.5px solid ${
            status === "error" ? "var(--color-secondary)" : "var(--color-border-strong)"
          }`,
          fontFamily: "var(--font-ui)",
          color: "var(--color-text)",
          minHeight: 52,
        }}
        disabled={status === "submitting"}
      />
      <button
        type="submit"
        className="btn-primary"
        style={{ minHeight: 52, minWidth: 140 }}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "…" : strings.newsletterSubmit}
      </button>
    </form>
  );
}
