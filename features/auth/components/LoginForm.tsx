"use client";

import { useActionState } from "react";

import { initialLoginState, type LoginActionState } from "../schemas";

type LoginFormProps = {
  action: (previousState: LoginActionState, formData: FormData) => Promise<LoginActionState>;
  expired: boolean;
};

export function LoginForm({ action, expired }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(action, initialLoginState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-ivory)] px-5 py-10 text-[var(--color-text)]">
      <section
        className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)] p-8 shadow-[0_16px_48px_rgb(30_36_31_/_8%)]"
        aria-labelledby="login-title"
      >
        <h1 id="login-title" className="text-3xl font-bold leading-tight tracking-normal">
          Agrolazo Admin
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          Ingresa con tus credenciales de administrador.
        </p>

        {expired ? (
          <div
            className="mt-6 rounded-md border border-[var(--color-error)] bg-[color-mix(in_srgb,var(--color-error)_10%,white)] px-4 py-3 text-sm font-medium text-[var(--color-error)]"
            role="status"
          >
            Tu sesión expiró. Vuelve a iniciar sesión.
          </div>
        ) : null}

        {state.formError ? (
          <div
            className="mt-6 rounded-md border border-[var(--color-error)] bg-[color-mix(in_srgb,var(--color-error)_10%,white)] px-4 py-3 text-sm font-medium text-[var(--color-error)]"
            role="alert"
          >
            {state.formError}
          </div>
        ) : null}

        <form action={formAction} className="mt-6 space-y-5" noValidate>
          <div>
            <label className="block text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              className="mt-2 min-h-11 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-base text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_28%,transparent)]"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state.values.email}
              aria-describedby={state.fieldErrors.email ? "email-error" : undefined}
              aria-invalid={state.fieldErrors.email ? "true" : "false"}
            />
            {state.fieldErrors.email ? (
              <p className="mt-2 text-sm text-[var(--color-error)]" id="email-error">
                {state.fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-semibold" htmlFor="password">
              Contraseña
            </label>
            <input
              className="mt-2 min-h-11 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-base text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_28%,transparent)]"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              defaultValue={state.values.password}
              aria-describedby={state.fieldErrors.password ? "password-error" : undefined}
              aria-invalid={state.fieldErrors.password ? "true" : "false"}
            />
            {state.fieldErrors.password ? (
              <p className="mt-2 text-sm text-[var(--color-error)]" id="password-error">
                {state.fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button
            className="flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--color-primary)] px-4 text-base font-bold text-[var(--color-primary-foreground)] transition hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={pending}
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </main>
  );
}
