import { apiFetch } from "./client";

export interface Favorite {
  id: string;
  dealer_id: string;
  vehicle_id: string;
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await apiFetch("/ugc/favorites");
  if (!response.ok) throw new Error("Error al obtener favoritos");
  return response.json() as Promise<Favorite[]>;
}

export async function addFavorite(vehicleId: string): Promise<Favorite> {
  const response = await apiFetch("/ugc/favorites", {
    method: "POST",
    body: JSON.stringify({ vehicle_id: vehicleId }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "Error al guardar favorito");
  }
  return response.json() as Promise<Favorite>;
}
