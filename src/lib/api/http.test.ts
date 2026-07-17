import { describe, expect, it } from "vitest";
import { z } from "zod";
import { jsonError, parseJsonBody } from "@/lib/api/http";

describe("jsonError", () => {
  it("returns error envelope with no-store cache", async () => {
    const response = jsonError("boom", 400, { field: "x" });
    expect(response.status).toBe(400);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    await expect(response.json()).resolves.toEqual({
      error: "boom",
      details: { field: "x" },
    });
  });
});

describe("parseJsonBody", () => {
  const schema = z.object({ id: z.string().min(1) });

  it("accepts valid JSON body", async () => {
    const request = new Request("http://localhost/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "abc" }),
    });

    const result = await parseJsonBody(request, schema);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ id: "abc" });
    }
  });

  it("rejects non-JSON content type", async () => {
    const request = new Request("http://localhost/api", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "nope",
    });

    const result = await parseJsonBody(request, schema);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(415);
    }
  });

  it("rejects invalid schema", async () => {
    const request = new Request("http://localhost/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "" }),
    });

    const result = await parseJsonBody(request, schema);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(400);
    }
  });
});
