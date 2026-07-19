"use client";

import { useState } from "react";

type Strings = {
  nameLabel: string;
  emailLabel: string;
  topicLabel: string;
  messageLabel: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  errorMessage: string;
  submitErrorMessage: string;
  topics: { value: string; label: string }[];
  consentLabel: string;
};

type ContactFormProps = { strings: Strings; lang: "en" | "es" };

export function ContactForm({ strings, lang }: ContactFormProps) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "submit-error"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "general");
    const message = String(data.get("message") ?? "").trim();
    const consent = data.get("consent");

    const next: Record<string, string> = {};
    if (!name) next.name = "required";
    if (!email.includes("@")) next.email = "invalid";
    if (message.length < 10) next.message = "too-short";
    if (!consent) next.consent = "required";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message, lang }),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("submit-error");
    }
  };

  if (status === "success") {
    return (
      <div
        className="card p-8"
        style={{ backgroundColor: "var(--color-accent-50)", borderColor: "var(--color-accent)" }}
        role="status"
      >
        <h3 style={{ marginTop: 0, color: "var(--color-accent-700)" }}>
          {strings.successTitle}
        </h3>
        <p style={{ marginBottom: 0 }}>{strings.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status === "submit-error" && (
        <div
          className="card p-4"
          style={{ backgroundColor: "var(--color-danger)", opacity: 0.95 }}
          role="alert"
        >
          <p style={{ margin: 0, color: "var(--color-surface)" }}>
            {strings.submitErrorMessage}
          </p>
        </div>
      )}
      <Field
        label={strings.nameLabel}
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        required
        error={errors.name ? strings.errorMessage : undefined}
      />
      <Field
        label={strings.emailLabel}
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={errors.email ? strings.errorMessage : undefined}
      />
      <SelectField
        label={strings.topicLabel}
        id="topic"
        name="topic"
        options={strings.topics}
      />
      <TextareaField
        label={strings.messageLabel}
        id="message"
        name="message"
        rows={6}
        required
        error={errors.message ? strings.errorMessage : undefined}
      />

      <label
        className="flex items-start gap-3 text-[0.95rem]"
        style={{ fontFamily: "var(--font-ui)", color: "var(--color-text-soft)" }}
      >
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1.5"
          style={{ width: 18, height: 18, accentColor: "var(--color-primary)" }}
        />
        <span>
          {strings.consentLabel}
          {errors.consent && (
            <span style={{ color: "var(--color-danger)" }}> *</span>
          )}
        </span>
      </label>

      <button
        type="submit"
        className="btn-primary"
        disabled={status === "submitting"}
        style={{ minWidth: 180 }}
      >
        {status === "submitting" ? "…" : strings.submitLabel}
      </button>
    </form>
  );
}

function fieldStyle(error?: string): React.CSSProperties {
  return {
    backgroundColor: "white",
    border: `2px solid ${error ? "var(--color-danger)" : "var(--color-border)"}`,
    borderRadius: 12,
    padding: "0.75rem 1rem",
    fontSize: "1.0625rem",
    fontFamily: "var(--font-ui)",
    color: "var(--color-text)",
    width: "100%",
    minHeight: 52,
    outline: "none",
  };
}

function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block mb-1.5 text-[0.95rem] font-medium"
        style={{ fontFamily: "var(--font-ui)", color: "var(--color-text)" }}
      >
        {label}
      </label>
      <input {...props} style={fieldStyle(error)} />
      {error && (
        <p
          className="mt-1.5 text-sm"
          style={{ color: "var(--color-danger)", fontFamily: "var(--font-ui)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function TextareaField({
  label,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block mb-1.5 text-[0.95rem] font-medium"
        style={{ fontFamily: "var(--font-ui)", color: "var(--color-text)" }}
      >
        {label}
      </label>
      <textarea {...props} style={{ ...fieldStyle(error), minHeight: 140 }} />
      {error && (
        <p
          className="mt-1.5 text-sm"
          style={{ color: "var(--color-danger)", fontFamily: "var(--font-ui)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block mb-1.5 text-[0.95rem] font-medium"
        style={{ fontFamily: "var(--font-ui)", color: "var(--color-text)" }}
      >
        {label}
      </label>
      <select {...props} style={fieldStyle()}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
