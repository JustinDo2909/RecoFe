"use client";
import { useGetProductQuery } from "@/state/api";
import { Product } from "@/types";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddToCartButton from "./AddToCartButton";
import PriceView from "./PriceView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import Image from "next/image";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { data: productData, isLoading } = useGetProductQuery();

  const fetchProducts = useCallback(() => {
    if (!search) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const filteredProducts =
        productData?.filter((product: Product) => {
          const matchesName = search
            ? product?.name?.toLowerCase().includes(search.toLowerCase())
            : true;

          return matchesName;
        }) || [];

      setProducts(filteredProducts);
    } catch (error) {
      toast.error("Failed to filter products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, productData]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, fetchProducts]);

  return (
    <Dialog open={showSearch} onOpenChange={() => setShowSearch(!showSearch)}>
      <DialogTrigger onClick={() => setShowSearch(!showSearch)}>
        <Search className="w-5 h-5 hover:text-darkColor hoverEffect" />
      </DialogTrigger>
      <DialogContent className="max-w-5xl min-h-[90vh] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="mb-1">Tìm kiếm sản phẩm</DialogTitle>
          <form
            className="relative flex gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              placeholder="Tìm kiếm..."
              className="flex-1 rounded-md py-5"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="submit"
              className={`absolute right-0 top-0 w-10 h-full flex items-center justify-center rounded-tr-md rounded-br-md hover:bg-darkColor hover:text-white hoverEffect ${search ? "bg-darkColor text-white" : "bg-darkColor/10"}`}
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </DialogHeader>
        <div className="w-full h-full overflow-y-scroll border border-darkColor/20 rounded-md">
          <div>
            {loading || isLoading ? (
              <p className="flex items-center px-6 py-10 gap-1 text-center text-yellow-600 font-semibold">
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang trong quá trình tìm kiếm...
              </p>
            ) : products.length ? (
              products
                ?.filter(
                  (product: Product) =>
                    product.stock !== 0 && product.isActive === true,
                )
                ?.map((product: Product) => (
                  <div
                    key={product._id}
                    className="bg-white overflow-hidden border-b last:border-b-0"
                  >
                    <div className="flex items-center p-1">
                      <Link
                        href={`/product/${product._id}`}
                        className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 border border-darkColor/20 rounded-md overflow-hidden group"
                        onClick={() => setShowSearch(false)}
                      >
                        {product.picture && (
                          <div className="relative w-full h-full">
                            <Image
                              src={product.picture}
                              alt="productImage"
                              fill
                              className="object-cover group-hover:scale-110 hoverEffect"
                            />
                          </div>
                        )}
                      </Link>
                      <div className="px-4 py-2 flex-grow">
                        <Link
                          href={`/product/${product._id}`}
                          onClick={() => setShowSearch(false)}
                        >
                          <h3 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {product.description || product.decription}
                          </p>
                        </Link>
                        <PriceView
                          price={product.price}
                          discount={
                            typeof product.currentDiscount === "number"
                              ? product.currentDiscount
                              : 20
                          }
                          className="md:text-lg"
                        />
                      </div>
                      <div className="w-60 mt-1">
                        <AddToCartButton product={product} />
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-10 font-semibold tracking-wide">
                {search ? (
                  <p>
                    Không có sản phầm nào trùng với{" "}
                    <span className="underline text-red-600">{search}</span>.
                    Xin hãy thử lại.
                  </p>
                ) : (
                  <p className="text-green-600 flex items-center justify-center gap-1">
                    <Search className="w-5 h-5" />
                    Tìm kiếm và trải nghiệm sản phẩm của RECO.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
