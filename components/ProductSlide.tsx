import { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

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
                src={product.picture || ""}
                alt={product.name || ""}
                width={1200}
                height={400}
                className="transition-transform duration-500 hover:scale-105 object-contain rounded-xl h-[300px]"
                priority={index === 0}
              />
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
