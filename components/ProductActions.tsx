// 'use client'
// import { Box, Row, RText } from '@/lib/by/Div';
// import React from 'react';
// import AddToCartButton from './AddToCartButton';
// import FavouriteButton from './FavouriteButton';
// import QuantityButton from './QuantityButton';
// import { useProductActions } from './seg/useProductActions';

// interface ProductActionsProps {
//   totalStock: number;
//   productId: string;
// }

// const ProductActions: React.FC<ProductActionsProps> = ({
//   totalStock,
//   productId
// }) => {

//   const { quantity, increment, decrement } = useProductActions(1, 1, totalStock || 99);
//   return (
//     <Box className="flex flex-col gap-4">
//       <Row className='flex items-center gap-4'>
//         <QuantityButton quantity={quantity} increment={increment} decrement={decrement}/>
//         <RText className='text-gray-500'>{totalStock} left in stock</RText>
//       </Row>
//       <Row className='flex space-x-4'>
//         <AddToCartButton product={productId} quantity={quantity}/>
//         <FavouriteButton isWishlisted={true}/>
//       </Row>
//     </Box>
//   );
// };

// export default ProductActions;
