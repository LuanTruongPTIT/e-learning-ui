export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Lấy token từ localStorage hoặc cookie
  return localStorage.getItem("authToken") || null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
