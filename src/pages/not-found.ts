export function renderNotFound(container: HTMLElement, onBack: () => void): void {
  container.innerHTML = `
    <div style="text-align:center;padding:4rem 1rem;">
      <h1 style="font-size:5rem;margin:0;">404</h1>
      <p>Página no encontrada.</p>
      <button id="not-found-back">Volver al inicio</button>
    </div>
  `;

  document.querySelector("#not-found-back")?.addEventListener("click", onBack);
}
