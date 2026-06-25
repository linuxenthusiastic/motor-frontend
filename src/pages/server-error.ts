export function renderServerError(container: HTMLElement, onBack: () => void): void {
  container.innerHTML = `
    <div class="error-page">
      <h1 class="error-page__code">500</h1>
      <p class="error-page__message">Error interno del servidor.</p>
      <button class="btn btn--secondary" id="server-error-back">Volver al inicio</button>
    </div>
  `;

  document.querySelector("#server-error-back")?.addEventListener("click", onBack);
}
