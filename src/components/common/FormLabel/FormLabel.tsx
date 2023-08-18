
type FormLabelProps = {
  htmlFor: string;
  label: string;
  position?: 'start' | 'end'
  children: React.ReactNode;
}

const FormLabel: React.FC<FormLabelProps> = ({ htmlFor, label, position = 'start', children }) => {
  return (
    <>
      <div className="flex-col space-y-2">
        {position === 'start' ? <><label htmlFor={htmlFor} className="font-bold text-black">{label}</label>
          {children}</> : <>{children}<label htmlFor={htmlFor} className="font-bold text-black">{label}</label></>}
      </div>
    </>
  )
}

export default FormLabel;
export type { FormLabelProps };

