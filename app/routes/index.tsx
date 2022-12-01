import { LoaderFunction, type ActionFunction, redirect } from '@remix-run/node';
import ytdl from 'ytdl-core';
import { type ChangeEvent, useState } from 'react';
import Button from '~/components/Button';
import Input from '~/components/Input';
import MiniTable, { type Format } from './MiniTable';
import Header from '~/components/Header';
import Spinner from '../components/Spinner';
import { getSession } from '~/sessions';

interface ActionData {
  title: string;
  thumbnail: string;
  duration: number | string;
  formats: Format[];
}
export const action: ActionFunction = async (): Promise<ActionData | null> => {
  // 1.- necesitamos obtener la url del video de youtube
  let url;
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

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('userId')) {
    return redirect('/login');
  }
  return null;
};

export default function Thumb() {
  // 2.- Necesitamos una manera de recibir la respuesta del action y/o las transiciones (loading, idle etc.)
  const [url, setURL] = useState('https://youtu.be/lV61TDHiALo');

  const handleDownload = (format: Format) => {
    //5.- una vez que mostramos los resultados necesitamos abrir una nueva pestaña para descargar el video
  };

  return (
    <section className='bg-violet-200 text-violet-800 h-screen flex flex-col gap-8 items-center py-20'>
      <Header />
      {/* 3.-  Necesitamos un form para enviar la petición post */}
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
          {true ? 'Analizar' : <Spinner />}
        </Button>
      </div>
      {/* 6.- La data que nos devuelve el action tiene que usarse para mostrar la mini tabla, así como entregarsele */}
      {false && <MiniTable data={'data'} onClick={handleDownload} />}
    </section>
  );
}
