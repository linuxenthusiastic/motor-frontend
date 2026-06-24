import { renderLogin } from "./pages/login";
import { getToken } from "./api/client";

const app = document.querySelector("#app");

function showLogin(): void {
  if (app instanceof HTMLElement) {
    renderLogin(app, () => {
      showHome();
    });
  }
}

function showHome(): void {
  if (app instanceof HTMLElement) {
    app.innerHTML = `<h2>Bienvenido a Motora</h2><p>Login exitoso.</p><button id="logout-btn">Cerrar sesión</button>`;
    document.querySelector("#logout-btn")?.addEventListener("click", () => {
      localStorage.removeItem("token");
      showLogin();
    });
  }
}

if (app instanceof HTMLElement) {
  if (getToken()) {
    showHome();
  } else {
    showLogin();
  }
}
