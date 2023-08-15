import FormLabel, { FormLabelProps } from '@/components/FormLabel/FormLabel';
import CommonTextFieldProps from '@/lib/types/CommonTextFieldProps';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> &
  CommonTextFieldProps &
  Omit<FormLabelProps, 'children' | 'htmlFor' | 'label'>;

const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  className,
  ...props
}) => {
  const Input = useMemo(() => {
    return (
      <input
        id={id}
        type="text"
        className={cn(
          'block outline-none outline-2 rounded-lg px-2 outline-black py-1  focus:outline-blue-500',
          className
        )}
        {...props}
      />
    );
  }, [className, id, props]);

  return (
    <div className="flex-col space-y-1  ">
      {label ? (
        <FormLabel htmlFor={id} label={label}>
          {Input}
        </FormLabel>
      ) : (
        Input
      )}
    </div>
  );
};

export default TextField;
