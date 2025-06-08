import { RText, Wrap } from '@/lib/by/Div';
import React from 'react';
import Button from '../CustomButton';
import { Minus, Plus } from 'lucide-react';

interface QuantityButtonProps {
  quantity: number;
  increment?: () => void;
  decrement?: () => void;
  disabled?: boolean;
  size?: 'default' | 'small';
}

const QuantityButton: React.FC<QuantityButtonProps> = ({
  quantity,
  increment,
  decrement,
  disabled = false,
  size = 'default',
}) => {
  const isSmall = size === 'small';

  return (
    <Wrap
      className={`flex w-auto items-center gap-1.5 border border-gray-300 rounded-xl ${
        isSmall ? 'py-[2px]' : 'py-2'
      }`}
    >
      <Button
        disabled={disabled}
        label={<Minus size={isSmall ? 14 : 18} />}
        onClick={decrement}
        variant="outline"
        className={`!p-0 justify-center border-r border-l-0 border-y-0 rounded-none ${
          isSmall ? 'w-6 h-5' : 'w-12 h-8'
        }`}
      />
      <RText
        className={`text-center font-semibold justify-center ${
          isSmall ? 'w-5 text-xs' : 'w-16 text-base'
        }`}
      >
        {quantity}
      </RText>
      <Button
        disabled={disabled}
        label={<Plus size={isSmall ? 14 : 18} />}
        onClick={increment}
        variant="outline"
        className={`!p-0 justify-center border-l border-r-0 border-y-0 rounded-none ${
          isSmall ? 'w-6 h-5' : 'w-12 h-8'
        }`}
      />
    </Wrap>
  );
};

export default QuantityButton;
