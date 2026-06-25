import { login } from "../api/auth";

export function renderLogin(
  container: HTMLElement,
  onSuccess: () => void,
  onRegisterClick?: () => void,
): void {
  container.innerHTML = `
    <form id="login-form" class="form">
      <h2 class="form__title">Iniciar sesión</h2>
      <div class="form__field">
        <label class="form__label" for="email">Email</label>
        <input class="form__input" type="email" id="email" required />
      </div>
      <div class="form__field">
        <label class="form__label" for="password">Contraseña</label>
        <input class="form__input" type="password" id="password" required />
      </div>
      <div class="form__actions">
        <button class="btn btn--primary" type="submit">Entrar</button>
      </div>
      <p class="form__error" id="login-error"></p>
      ${onRegisterClick ? '<p class="form__footer">¿No tenés cuenta? <a class="form__link" href="#" id="go-register">Registrate</a></p>' : ""}
    </form>
  `;

  document.querySelector("#go-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    onRegisterClick?.();
  });

  const form = document.querySelector("#login-form");
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const errorEl = document.querySelector("#login-error");

    if (
      !(emailInput instanceof HTMLInputElement) ||
      !(passwordInput instanceof HTMLInputElement)
    ) return;

    try {
      await login(emailInput.value, passwordInput.value);
      onSuccess();
    } catch {
      if (errorEl instanceof HTMLElement) {
        errorEl.textContent = "Email o contraseña incorrectos";
      }
    }
  });
}
