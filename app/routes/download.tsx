import { type LoaderFunction } from '@remix-run/node';
import ytdl from 'ytdl-core';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const link = url.searchParams.get('url') as string;
  const itag = url.searchParams.get('itag') as string;
  const container = url.searchParams.get('container') as string;
  const qualityLabel = url.searchParams.get('qualityLabel') as string;
  let title = url.searchParams.get('title') as string;
  if( title != null )
    title= title.replace('(', '').replace(')', '').replace('/', '').replace('ㅣ', ' ').replace('|', ' ').replace(/ /g, '_');
  console.log(`Recibi =>[${request.url}]`)
  console.log(`Archivo =>[${title}_${qualityLabel}.${container}]`)
  const stream = ytdl(link, {
    filter: (format) => format.itag === Number(itag),
  });
  return new Response(stream, { status:200,
    headers: {
      'Content-Disposition': `attachment; filename="${title}_${qualityLabel}.${container}"`,
    },
  });
};