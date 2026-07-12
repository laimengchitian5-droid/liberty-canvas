"use client";

import { useEffect, useState } from "react";

export function PwaRegister() {
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let registration: ServiceWorkerRegistration | null = null;

    const registerServiceWorker = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        registration.addEventListener("updatefound", () => {
          const installing = registration?.installing;

          if (!installing) {
            return;
          }

          installing.addEventListener("statechange", () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setUpdateReady(true);
            }
          });
        });
      } catch (error) {
        console.error("[pwa] service worker registration failed:", error);
      }
    };

    const onControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    if (document.readyState === "complete") {
      void registerServiceWorker();
    } else {
      window.addEventListener("load", () => void registerServiceWorker(), {
        once: true,
      });
    }

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
    };
  }, []);

  const applyUpdate = () => {
    if (!navigator.serviceWorker.controller) {
      window.location.reload();
      return;
    }

    navigator.serviceWorker.ready
      .then((registration) => {
        registration.waiting?.postMessage({ type: "SKIP_WAITING" });
      })
      .catch(() => {
        window.location.reload();
      });
  };

  if (!updateReady) {
    return null;
  }

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: "0.65rem",
        padding: "0.75rem 1rem",
        borderRadius: "999px",
        background: "rgb(15 23 42 / 0.92)",
        color: "rgb(248 250 252)",
        boxShadow: "0 12px 32px rgb(0 0 0 / 0.25)",
        fontSize: "0.88rem",
      }}
    >
      <span>新しいバージョンがあります</span>
      <button
        type="button"
        onClick={applyUpdate}
        style={{
          minHeight: "2.25rem",
          padding: "0.35rem 0.85rem",
          border: "none",
          borderRadius: "999px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        更新
      </button>
    </div>
  );
}
