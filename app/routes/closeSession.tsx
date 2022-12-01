import { redirect, type LoaderFunction } from '@remix-run/node';
import { destroySession, getSession } from '~/sessions';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (session.has('userId')) {
    console.log(`Cerrando sesion ${JSON.stringify(session)}`)
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });
  }  
  return null;
};