type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = (props: ButtonProps) => {
  return <button {...props}>button text 1234</button>;
};
