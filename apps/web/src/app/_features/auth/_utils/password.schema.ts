import { z } from "zod";

export const PasswordSchema = z
  .string()
  .regex(
    new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d\W_]{8,}$/),
    "Ihr Passwort muss mindestens 8 Zeichen enthalten, darunter mindestens eine Zahl, einen Buchstaben und ein Sonderzeichen."
  );
