import { createVehicle } from "../api/vehicles";

export function renderCreateVehicle(
  container: HTMLElement,
  onSuccess: () => void,
  onCancel: () => void,
): void {
  container.innerHTML = `
    <form id="create-vehicle-form" class="form">
      <h2 class="form__title">Agregar vehículo</h2>
      <div class="form__field">
        <label class="form__label" for="brand">Marca</label>
        <input class="form__input" type="text" id="brand" required />
      </div>
      <div class="form__field">
        <label class="form__label" for="model">Modelo</label>
        <input class="form__input" type="text" id="model" required />
      </div>
      <div class="form__field">
        <label class="form__label" for="year">Año</label>
        <input class="form__input" type="number" id="year" min="1900" max="2100" required />
      </div>
      <div class="form__field">
        <label class="form__label" for="color">Color</label>
        <input class="form__input" type="text" id="color" required />
      </div>
      <div class="form__field">
        <label class="form__label" for="plate">Patente</label>
        <input class="form__input" type="text" id="plate" required />
      </div>
      <div class="form__field">
        <label class="form__label" for="vin">VIN</label>
        <input class="form__input" type="text" id="vin" required />
      </div>
      <div class="form__actions">
        <button class="btn btn--primary" type="submit">Guardar</button>
        <button class="btn btn--secondary" type="button" id="cancel-btn">Cancelar</button>
      </div>
      <p class="form__error" id="create-error"></p>
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
