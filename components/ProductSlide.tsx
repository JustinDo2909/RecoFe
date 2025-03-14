import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useRef, useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import Image from "next/image";
import { Button } from "./ui/button";

interface ProductSlideProps {
  products: Product[];
}

const CustomSwiper: React.FC<ProductSlideProps> = ({ products }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const swiperContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          swiperRef.current?.autoplay.stop();
        } else {
          swiperRef.current?.autoplay.start();
        }
      },
      { threshold: 0.2 }
    );

    if (swiperContainerRef.current) {
      observer.observe(swiperContainerRef.current);
    }

    return () => {
      if (swiperContainerRef.current) {
        observer.unobserve(swiperContainerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={swiperContainerRef}
      className="relative w-full max-w-[95vw] mx-auto py-8 px-4"
    >
      <Swiper
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        spaceBetween={30}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        modules={[Navigation, Pagination, Autoplay]}
        className="w-full"
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
          1024: { slidesPerView: 2.5, spaceBetween: 30 },
        }}
      >
        {products?.map((product, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <div
              className={`relative transition-all duration-500 ease-in-out ${
                index === activeIndex ? "scale-115 " : " scale-90 "
              }`}
            >
              <Image
                src={product.picture}
                alt={product.name}
                width={1200}
                height={400}
                className="transition-transform duration-500 hover:scale-105 object-contain rounded-xl h-[300px]"
                priority={index === 0}
              />

              <div className="absolute bottom-10 left-6 right-0 p-4 text-black">
                <div className="space-y-2">
                  <h3 className="text-xl md:text-3xl font-semibold tracking-tight drop-shadow-md uppercase">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-black line-clamp-2 drop-shadow">
                    {product.description}
                  </p>
                  <Button
                    className="mt-3 bg-black text-white font-medium
                    px-5 py-1.5 rounded-md transition-all duration-300 transform hover:scale-105"
                  >
                    Mua Ngay
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full 
          shadow-lg hover:bg-white transition-all duration-300 z-20 group"
      >
        <ChevronLeft className="w-5 h-5 text-gray-800 group-hover:text-red-500" />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2.5 rounded-full 
          shadow-lg hover:bg-white transition-all duration-300 z-20 group"
      >
        <ChevronRight className="w-5 h-5 text-gray-800 group-hover:text-red-500" />
      </button>

      <div className="flex justify-center gap-2 mt-6">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperRef.current?.slideToLoop(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "bg-black scale-125"
                : "border border-black hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomSwiper;
