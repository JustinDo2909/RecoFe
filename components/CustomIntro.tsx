import React from "react";
import { Button } from "./ui/button";

interface CustomProps {
  cusTitle: string;
  description?: string;
  button?: string;
  button2?: string;
  onClick?: () => void;
}

const CustomIntro = (CustomProps: CustomProps) => {
  return (
    <div className="max-w-lg text-center md:text-left mx-auto">
      <h2 className="text-gray-600 text-xl">RECO</h2>
      <h2 className="text-4xl font-semibold mb-2">{CustomProps.cusTitle}</h2>
      <p className="text-gray-700">{CustomProps.description}</p>
      <div className="flex gap-5">
        <Button onClick={CustomProps.onClick} className={`mt-4 ${CustomProps.button ? 'block' : "hidden"} `}>{CustomProps.button}</Button>
      
        <Button  onClick={CustomProps.onClick} className={`mt-4 ${CustomProps.button2 ? 'block' : "hidden"}`}>{CustomProps.button2}</Button>
      </div>
    </div>
  );
};

export default CustomIntro;
