import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Title = ({ children, className }: Props) => {
  return (
    <h2
      className={cn(
        "text-2xl max-w-[70%] md:max-w-[50%] my-7  mx-auto md:text-4xl uppercase font-bold text-center font-semibold",
        className,
      )}
    >
      {children}
    </h2>
  );
};

export default Title;
