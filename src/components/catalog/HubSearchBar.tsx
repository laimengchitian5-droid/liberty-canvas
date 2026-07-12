"use client";

import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./hubSearchBar.module.css";

interface HubSearchBarProps {
  placeholder: string;
  ariaLabel: string;
}

export const HubSearchBar = ({ placeholder, ariaLabel }: HubSearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);

  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  const commitQuery = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = next.trim();

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <form
      className={styles.bar}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        commitQuery(value);
      }}
    >
      <label className={styles.label}>
        <Search className={styles.icon} aria-hidden="true" />
        <input
          className={styles.input}
          type="search"
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel}
          enterKeyHint="search"
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => commitQuery(value)}
        />
      </label>
    </form>
  );
};
