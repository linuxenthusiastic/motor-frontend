import { getAllVehicles, type Vehicle } from "../api/vehicles";
import { getFavorites, addFavorite } from "../api/ugc";
import { renderCreateVehicle } from "./create-vehicle";
import { renderVehicleDetail } from "./vehicle-detail";
import { renderFavorites } from "./favorites";
import { renderProfile } from "./profile";

export function renderCatalog(container: HTMLElement, onLogout: () => void): void {
  container.innerHTML = `
    <div class="page">
      <div class="page__header">
        <h2 class="page__title">Catálogo de vehículos</h2>
        <div class="page__actions">
          <button class="btn btn--secondary" id="profile-btn">Mi perfil</button>
          <button class="btn btn--secondary" id="favorites-btn">★ Mis favoritos</button>
          <button class="btn btn--primary" id="add-vehicle-btn">+ Agregar vehículo</button>
          <button class="btn btn--danger" id="logout-btn">Cerrar sesión</button>
        </div>
      </div>
      <div id="vehicle-list" class="page__body">Cargando...</div>
    </div>
  `;

  document.querySelector("#logout-btn")?.addEventListener("click", onLogout);
  document.querySelector("#add-vehicle-btn")?.addEventListener("click", () => {
    renderCreateVehicle(
      container,
      () => renderCatalog(container, onLogout),
      () => renderCatalog(container, onLogout),
    );
  });
  document.querySelector("#profile-btn")?.addEventListener("click", () => {
    renderProfile(container, () => renderCatalog(container, onLogout));
  });
  document.querySelector("#favorites-btn")?.addEventListener("click", () => {
    renderFavorites(container, () => renderCatalog(container, onLogout));
  });

  loadVehicles(container, onLogout);
}

async function loadVehicles(container: HTMLElement, onLogout: () => void): Promise<void> {
  const listEl = document.querySelector("#vehicle-list");
  if (!(listEl instanceof HTMLElement)) return;

  try {
    const [vehicles, favorites] = await Promise.all([getAllVehicles(), getFavorites()]);
    const favoritedIds = new Set(favorites.map((f) => f.vehicle_id));

    if (vehicles.length === 0) {
      listEl.innerHTML = '<p class="page__empty">No hay vehículos registrados.</p>';
      return;
    }

    listEl.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th class="data-table__head-cell data-table__head-cell--icon"></th>
            <th class="data-table__head-cell">Marca</th>
            <th class="data-table__head-cell">Modelo</th>
            <th class="data-table__head-cell">Año</th>
            <th class="data-table__head-cell">Patente</th>
            <th class="data-table__head-cell">Color</th>
          </tr>
        </thead>
        <tbody id="vehicle-tbody"></tbody>
      </table>
    `;

    const tbody = document.querySelector("#vehicle-tbody");
    if (!(tbody instanceof HTMLElement)) return;

    for (const vehicle of vehicles) {
      const isFav = favoritedIds.has(vehicle.id);
      const tr = document.createElement("tr");
      tr.className = "data-table__row--clickable";
      tr.innerHTML = `
        <td class="data-table__cell data-table__cell--icon">
          <button class="btn--icon ${isFav ? "btn--icon--active" : ""} fav-btn"
            data-id="${vehicle.id}"
            title="${isFav ? "Ya en favoritos" : "Agregar a favoritos"}">★</button>
        </td>
        <td class="data-table__cell">${vehicle.brand}</td>
        <td class="data-table__cell">${vehicle.model}</td>
        <td class="data-table__cell">${vehicle.year}</td>
        <td class="data-table__cell">${vehicle.plate}</td>
        <td class="data-table__cell">${vehicle.color}</td>
      `;

      const favBtn = tr.querySelector(".fav-btn") as HTMLButtonElement;
      favBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (favoritedIds.has(vehicle.id)) return;
        try {
          await addFavorite(vehicle.id);
          favoritedIds.add(vehicle.id);
          favBtn.classList.add("btn--icon--active");
          favBtn.title = "Ya en favoritos";
        } catch {
          // silently ignore if already favorited
        }
      });

      tr.addEventListener("click", () => {
        renderVehicleDetail(container, vehicle, () => renderCatalog(container, onLogout));
      });

      tbody.appendChild(tr);
    }
  } catch {
    listEl.innerHTML = '<p class="page__error">Error al cargar los vehículos.</p>';
  }
}
