import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import tailwind from '~/styles/root.css';

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: tailwind,
  },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Another youtube downloader, but with Remix',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
