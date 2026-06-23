export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: ["/favorites", "/api/favorites/:path*"],
}