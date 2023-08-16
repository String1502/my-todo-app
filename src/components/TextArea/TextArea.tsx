import FormLabel, { FormLabelProps } from '@/components/FormLabel/FormLabel';
import CommonTextFieldProps from '@/types/CommonTextFieldProps';
import { cn } from '@/utils/tailwind';
import { useMemo } from 'react';

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  CommonTextFieldProps &
  Omit<FormLabelProps, 'children' | 'htmlFor'>;

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  className,
  ...props
}) => {
  const Input = useMemo(() => {
    return (
      <textarea
        id={id}
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

export default TextArea;
