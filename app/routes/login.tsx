import {type ActionFunction, redirect } from '@remix-run/node';
import { commitSession, getSession } from '~/sessions';
import { db } from "~/db/db.server";
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import SignForm from "./signup";
//import userSchema from "./signup";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
});
export type UserTpe = z.infer<typeof userSchema>;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const form = Object.fromEntries(formData);
  const validationResult = userSchema.safeParse(form);
  if (!validationResult.success) return validationResult.error;
  const exists = await db.user.findUnique({
    where: {
      email: form.email as string,
    },
  });
  // search
  if (!exists) return { message: 'El usuario no existe' };
  const isSame = bcrypt.compareSync(form.password, exists.hash);
  if (!isSame) return { message: 'Contraseña incorrecta' };
  // cookie
  const session = await getSession(request.headers.get('Cookie'));
  session.set('userId', exists.id);
  console.log(`session => ${JSON.stringify(session)}`);
  // redirection with commit
  return redirect('/', {
    headers: { 'Set-Cookie': await commitSession(session) },
  });
};

export default function Login() {
  return <SignForm />
}