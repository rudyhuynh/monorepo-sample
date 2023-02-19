type InputProps = {
  name: string;
  value: string;
};

export const Input = (props: InputProps) => <input {...props} />;
