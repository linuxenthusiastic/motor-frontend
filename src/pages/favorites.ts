import { getFavorites, type Favorite } from "../api/ugc";
import { getAllVehicles, type Vehicle } from "../api/vehicles";
import { renderVehicleDetail } from "./vehicle-detail";

export function renderFavorites(container: HTMLElement, onBack: () => void): void {
  container.innerHTML = `
    <div id="favorites">
      <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h2>Mis favoritos</h2>
        <button id="back-btn">&larr; Volver al catálogo</button>
      </header>
      <div id="favorites-list">Cargando...</div>
    </div>
  `;

  document.querySelector("#back-btn")?.addEventListener("click", onBack);

  loadFavorites(container, onBack);
}

async function loadFavorites(container: HTMLElement, onBack: () => void): Promise<void> {
  const listEl = document.querySelector("#favorites-list");
  if (!(listEl instanceof HTMLElement)) return;

  try {
    const [favorites, vehicles] = await Promise.all([getFavorites(), getAllVehicles()]);

    if (favorites.length === 0) {
      listEl.innerHTML = "<p>No tenés vehículos favoritos todavía.</p>";
      return;
    }

    const vehicleMap = new Map<string, Vehicle>(vehicles.map((v) => [v.id, v]));

    listEl.innerHTML = `
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ccc;">Marca</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ccc;">Modelo</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ccc;">Año</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ccc;">Patente</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ccc;">Color</th>
          </tr>
        </thead>
        <tbody id="favorites-tbody"></tbody>
      </table>
    `;

    const tbody = document.querySelector("#favorites-tbody");
    if (!(tbody instanceof HTMLElement)) return;

    for (const fav of favorites) {
      const vehicle = vehicleMap.get(fav.vehicle_id);
      if (!vehicle) continue;

      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      tr.innerHTML = `
        <td style="padding:8px;border-bottom:1px solid #eee;">${vehicle.brand}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${vehicle.model}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${vehicle.year}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${vehicle.plate}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${vehicle.color}</td>
      `;
      tr.addEventListener("click", () => {
        renderVehicleDetail(container, vehicle, () => renderFavorites(container, onBack));
      });
      tr.addEventListener("mouseenter", () => { tr.style.background = "#f5f5f5"; });
      tr.addEventListener("mouseleave", () => { tr.style.background = ""; });
      tbody.appendChild(tr);
    }
  } catch {
    listEl.innerHTML = "<p style='color:red;'>Error al cargar favoritos.</p>";
  }
}
