"use client";

import { useState } from "react";
import type { StringSet } from "@/lib/i18n/strings";

type NewsletterFormProps = {
  strings: StringSet["home"];
};

export function NewsletterForm({ strings }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

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
        className="flex-1 px-4 py-3 rounded-xl border-2 outline-none transition-colors text-[1.0625rem]"
        style={{
          backgroundColor: "white",
          borderColor:
            status === "error" ? "var(--color-danger)" : "var(--color-border)",
          fontFamily: "var(--font-ui)",
          color: "var(--color-text)",
          minHeight: 52,
        }}
        disabled={status === "submitting" || status === "success"}
      />
      <button
        type="submit"
        className="btn-primary"
        style={{ minHeight: 52 }}
        disabled={status === "submitting" || status === "success"}
      >
        {status === "submitting"
          ? "…"
          : status === "success"
            ? "✓"
            : strings.newsletterSubmit}
      </button>
      {status === "error" && (
        <p
          className="sm:absolute sm:translate-y-14 text-sm"
          style={{ color: "var(--color-danger)", fontFamily: "var(--font-ui)" }}
          role="alert"
        >
          Please enter a valid email.
        </p>
      )}
    </form>
  );
}
