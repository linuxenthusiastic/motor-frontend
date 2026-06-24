import { createVehicle } from "../api/vehicles";

export function renderCreateVehicle(
  container: HTMLElement,
  onSuccess: () => void,
  onCancel: () => void,
): void {
  container.innerHTML = `
    <form id="create-vehicle-form">
      <h2>Agregar vehículo</h2>
      <label for="brand">Marca</label>
      <input type="text" id="brand" required />
      <label for="model">Modelo</label>
      <input type="text" id="model" required />
      <label for="year">Año</label>
      <input type="number" id="year" min="1900" max="2100" required />
      <label for="color">Color</label>
      <input type="text" id="color" required />
      <label for="plate">Patente</label>
      <input type="text" id="plate" required />
      <label for="vin">VIN</label>
      <input type="text" id="vin" required />
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button type="submit">Guardar</button>
        <button type="button" id="cancel-btn">Cancelar</button>
      </div>
      <p id="create-error" style="color:red;"></p>
    </form>
  `;

  document.querySelector("#cancel-btn")?.addEventListener("click", onCancel);

  const form = document.querySelector("#create-vehicle-form");
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const get = (id: string) => (document.querySelector(`#${id}`) as HTMLInputElement).value;
    const errorEl = document.querySelector("#create-error");

    try {
      await createVehicle({
        brand: get("brand"),
        model: get("model"),
        year: parseInt(get("year"), 10),
        color: get("color"),
        plate: get("plate"),
        vin: get("vin"),
      });
      onSuccess();
    } catch (err) {
      if (errorEl instanceof HTMLElement) {
        errorEl.textContent = err instanceof Error ? err.message : "Error al crear vehículo";
      }
    }
  });
}
