"use client";
/** Surface rejected saves and network failures in the shared admin shell. */
export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(input, { ...init, cache: "no-store" });
    const body = await response.clone().json().catch(() => ({}));
    if (!response.ok || body.success === false) window.dispatchEvent(new CustomEvent("admin-error", { detail: body.error || `Request failed (${response.status}).` }));
    return response;
  } catch {
    const error = "Network request failed. Your changes have not been saved.";
    window.dispatchEvent(new CustomEvent("admin-error", { detail: error }));
    return Response.json({ success: false, error }, { status: 503 });
  }
}
