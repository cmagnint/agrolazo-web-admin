import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Ingresa tu email.").email("Ingresa un email válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>;

export type LoginActionState = {
  ok: false;
  values: LoginFormValues;
  fieldErrors: LoginFieldErrors;
  formError: string | null;
};

export const initialLoginState: LoginActionState = {
  ok: false,
  values: {
    email: "",
    password: "",
  },
  fieldErrors: {},
  formError: null,
};
