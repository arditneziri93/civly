interface IZodErrorsProps {
  error?: string[];
}

export function ZodErrors({ error }: IZodErrorsProps) {
  if (!error) return null;
  return error.map((err: string, index: number) => (
    <div key={index} className="text-pink-500 text-xs italic mt-1 py-2">
      {err}
    </div>
  ));
}