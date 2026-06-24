export function renderServerError(container: HTMLElement, onBack: () => void): void {
  container.innerHTML = `
    <div style="text-align:center;padding:4rem 1rem;">
      <h1 style="font-size:5rem;margin:0;">500</h1>
      <p>Error interno del servidor.</p>
      <button id="server-error-back">Volver al inicio</button>
    </div>
  `;

  document.querySelector("#server-error-back")?.addEventListener("click", onBack);
}
