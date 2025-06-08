import { Star } from "lucide-react";
import { Row, RText, Wrap } from "@/lib/by/Div";
import { formatPrice } from '../../lib/share/formatPrice';

export function ProductInfo({ productData }: { productData: IProduct }) {
  const { productCategory, productBrand, productSkinType } = productData;
  return (
    <>
      <RText className="text-pink-500 font-bold">{productBrand.title}</RText>
        <h1 className="text-3xl font-bold text-gray-900 leading-none">{productData.title}</h1>

      <Row className="flex items-center justify-start gap-0">
        <Wrap className="flex-start flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(productData.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
          ))}
          <RText className="w-auto mx-2">{productData.rating}</RText>
          <RText className="text-gray-500">
          ({productData.reviews_count ?? 0} reviews)
        </RText>
        </Wrap>
      </Row>

      <Row className="justify-start space-x-2 flex items-center">
        <h2 className="text-3xl font-semibold text-primary">
          {formatPrice(productData.sale_price ?? productData.price)}
        </h2>
        {productData.sale_price && (
        <RText className="text-xl text-muted-foreground line-through">{formatPrice(productData.price)}</RText>
        )}
      </Row>

      <RText>{productData.description}</RText>

      <Row className="flex items-center gap-2"><RText className="text-right flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">{productCategory.title}</RText>
     <RText className="text-right flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full">{productSkinType.title}</RText></Row>


      
    </>
  );
}
