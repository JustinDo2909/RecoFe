import { useGetCategoryQuery } from "@/state/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const ProductCharacteristics = ({ product }: { product: any }) => {
  console.log("product", product);
  const { data: categories } = useGetCategoryQuery({});
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Tên sản phẩm : {product?.name}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1">
          <p className="flex items-center justify-between">
            Loại:
            <span className="font-semibold tracking-wide">
              {categories?.find(
                (item) =>
                  item._id ===
                  (product?.categories ? product?.categories[0] : ""),
              )?.title || "Không xác định"}
            </span>
          </p>
          <p className="flex items-center justify-between">
            Xản xuất: <span className="font-semibold tracking-wide">2024</span>
          </p>

          <p className="flex items-center justify-between">
            Số lượng còn lại:{" "}
            <span className="font-semibold tracking-wide">
              {product?.stock}
            </span>
          </p>
          <p className="flex items-center justify-between">
            Mô tả:{" "}
            <span className="font-semibold tracking-wide">
              {product?.description}
            </span>
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;
