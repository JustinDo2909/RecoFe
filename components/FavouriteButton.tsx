import React from "react";
import Button from "../CustomButton";
import { Heart } from "lucide-react";

interface FavouriteButtonProps {
  isWishlisted: boolean;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({isWishlisted}) => {
  return (
    <Button
      label={
        <Heart
          className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? "fill-current" : ""}`}
        />
      }
      className={`p-3 w-auto sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
        isWishlisted
          ? "border-pink-400 bg-pink-50 text-pink-600"
          : "border-gray-200 hover:border-pink-400 hover:bg-pink-50"
      }`}
    ></Button>
  );
};

export default FavouriteButton;
