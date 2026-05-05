import type { ReactNode } from "react";

export function SectionCard({
  title,
  hint,
  children,
  actions,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="section animate-rise">
      <div className="section-header">
        <div className="stack" style={{ gap: "0.35rem" }}>
          <h3>{title}</h3>
          {hint ? <span className="helper">{hint}</span> : null}
        </div>
        {actions}
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "warn" | "danger";
}) {
  const className =
    tone === "success"
      ? "badge badge-success"
      : tone === "warn"
        ? "badge badge-warn"
        : "badge badge-danger";

  return <span className={className}>{label}</span>;
}

export function StatBlock({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <div className="mini-card">
      <div className="muted">{label}</div>
      <div className="stat-value" style={{ fontSize: "1.65rem" }}>
        {value}
      </div>
      {helper ? <div className="helper">{helper}</div> : null}
    </div>
  );
}

export function FormGroup({
  label,
  htmlFor,
  helper,
  children,
  wide,
}: {
  label: string;
  htmlFor: string;
  helper?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "field field-full" : "field"}>
      <label className="label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {helper ? <span className="helper">{helper}</span> : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-hero">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h1>{title}</h1>
      {description ? <p className="muted">{description}</p> : null}
      {children ? <div className="hero-actions">{children}</div> : null}
    </div>
  );
}
