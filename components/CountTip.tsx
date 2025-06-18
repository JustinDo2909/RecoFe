import { CountUpProps } from "@/types";
import CountUp from "react-countup";

export default function MyCountUp({
  start,
  end,
  duration,
  title,
  description,
}: CountUpProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-red-500 text-5xl font-bold">
        <CountUp start={start} end={end} duration={duration} />
        <div className="text-2xl font-semibold">{title}</div>
      </div>
      <div className="text-gray-500 text-sm mt-1">{description}</div>
    </div>
  );
}
