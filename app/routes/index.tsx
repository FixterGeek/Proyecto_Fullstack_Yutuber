import { LoaderFunction, type ActionFunction, redirect } from '@remix-run/node';
import ytdl from 'ytdl-core';
import { type ChangeEvent, useState } from 'react';
import Button from '~/components/Button';
import Input from '~/components/Input';
import MiniTable, { type Format } from './MiniTable';
import Header from '~/components/Header';
import Spinner from '../components/Spinner';
import { Form, useFetcher, useTransition, useActionData, useLoaderData } from '@remix-run/react';
import { getSession } from '~/sessions';

interface ActionData {
  title: string;
  thumbnail: string;
  duration: number | string;
  formats: Format[];
}
export const action: ActionFunction = async ({ request }): Promise<ActionData | null> => {
  // 1.- necesitamos obtener la url del video de youtube
  let params= await request.formData();
  let url= params.get('url');
  if (!url) return null;

  const info = await ytdl.getInfo(url);
  const result = {
    title: info.videoDetails.title,
    thumbnail:
      info.videoDetails?.thumbnails[info.videoDetails?.thumbnails.length - 1]
        ?.url,
    duration: info.videoDetails?.lengthSeconds,
    formats: info.formats.filter((f) => f.hasAudio && f.hasVideo),
  };
  return result;
};

export function ErrorBoundary({ error }) {
  return (
    <div className='bg-blue-200 text-blue-800 h-screen flex flex-col gap-8 items-center py-20'>
      <img className='w-[150px] rounded' src='error404.jpeg' alt='error' />
      <h1 className='text-lg font-semibold'>Error</h1>
      <p className='p-4 rounded bg-blue-300'>{error.message}</p>
      <p className='text-lg font-semibold'>The stack trace is:</p>
      <pre className='p-4 rounded bg-blue-300'>{error.stack}</pre>
    </div>
  );
}
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  console.log(`IndexSession => ${JSON.stringify(session)}`);
  if (!session.has('userId')) {
    return redirect('/login');
  }
  return null;
};

export default function Thumb() {
  // 2.- Necesitamos una manera de recibir la respuesta del action y/o las transiciones (loading, idle etc.)
  const [url, setURL] = useState('https://youtu.be/lV61TDHiALo');
  const data = useActionData();
  const fetcher= useFetcher();
  //const session = useLoaderData();
  const transition = useTransition();
  console.log(transition);
  const handleDownload = (format: Format) => {
    //5.- una vez que mostramos los resultados necesitamos abrir una nueva pestaña para descargar el video
    const informacion = {
      url: url,
      itag: format.itag,
      qualityLabel: format.qualityLabel,
      container: format.container,
      title: data.title
    }
    //fetcher.submit( informacion, { method:'get', action: '/download', contentType:"multipart/form-data"});
    //fetcher.load(`/download?url=${url}&itag=${format.itag}&qualityLabel=${format.qualityLabel}&container=${format.container}&title=${data.title}`);
    window.open(`/download?url=${url}&itag=${format.itag}&qualityLabel=${format.qualityLabel}&container=${format.container}&title=${data.title}`, '_self'); //, 'noopener,noreferrer'
  };
  return (
    <section className='bg-blue-200 text-blue-800 h-screen flex flex-col gap-8 items-center py-20'>
      <Header />
      <Button className = 'text-blue-100 bg-blue-500 text-xl p-4 rounded-r-xl hover:bg-blue-700 transition-all disabled:bg-bg-violet-100 flex justify-center' 
      type='submit' onClick={ () => {
        //fetcher.submit({ method:'post', action: '/closeSession'});
        fetcher.load('/closeSession');
      }}>
        Cerrar Sesion
      </Button>
      {/* 3.-  Necesitamos un form para enviar la petición post */}
      <Form method="post" encType="multipart/form-data">
        <div className='rounded-xl shadow-xl flex'>
          <Input
            placeholder='Escribe tu link'
            value={url}
            name='url'
            onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
              setURL(value)
            }
          />
          <Button type='submit'>
            {/* 4.- Aquí necesitamos una manera de mostrar un loading */}
            {transition.state === 'idle' ? 'Analizar' : <Spinner />}
          </Button>
        </div>
      </Form>      
      {/* 6.- La data que nos devuelve el action tiene que usarse para mostrar la mini tabla, así como entregarsele */}
      { !data?.thumbnail ? null : <MiniTable data={data} onClick={handleDownload} />}
    </section>
  );
}
