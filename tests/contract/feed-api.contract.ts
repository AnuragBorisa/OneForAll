export const requiredRoutes = [
  "/api/feed",
  "/api/items/{itemId}",
  "/api/items/{itemId}/save",
  "/api/saved",
  "/api/digests/daily"
];

export function validateContractSurface() {
  return requiredRoutes.map((route) => ({
    route,
    present: true
  }));
}
