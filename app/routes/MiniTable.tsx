import Button from '~/components/Button';

export interface Format {
  qualityLabel: string;
  container: string;
  url: string;
  itag: number;
}
interface DataType {
  thumbnail: string;
  title: string;
  duration: number;
  formats: Format[];
}
interface MiniTableProps {
  data: DataType;
  onClick: (arg0: Format) => void;
}
export default function MiniTable({ data, onClick }: MiniTableProps) {
  return (
    <article className='bg-blue-200 flex items-start'>
      <div className='w-[50%]'>
        <img className='w-80' src={data.thumbnail} alt='thumbnail' />
        <h2 className='text-lg font-semibold'>{data.title}</h2>
        <p>
          Duración: {Math.floor((data.duration / 0x3c) % 0x3c)} min{' '}
          {Math.round(data.duration % 0x3c)} seg
        </p>
      </div>
      <div className=''>
        <h2>Descarga el video como:</h2>
        {data.formats?.map((f, i) => (
          <div key={i} className='flex'>
            <p className='p-4 border border-blue-500 w-32'>
              {f.qualityLabel}.{f.container}
            </p>
            <Button variant='outline' onClick={() => onClick(f)}>
              Descargar
            </Button>
          </div>
        ))}
      </div>
    </article>
  );
}
