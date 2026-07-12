"use client";

interface DirectionalIconProps {
  name: "send" | "chevron";
  className?: string;
  label?: string;
}

export function DirectionalIcon({ name, className = "", label }: DirectionalIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {name === "send" ? (
        <>
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </>
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  );
}

interface StaticIconProps {
  name: "spinner";
  className?: string;
  label?: string;
}

export function StaticIcon({ name, className = "", label }: StaticIconProps) {
  if (name === "spinner") {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden={label ? undefined : true}
        role={label ? "img" : undefined}
        aria-label={label}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.25"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return null;
}
