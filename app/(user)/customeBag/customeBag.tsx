"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer, Text as KonvaText } from "react-konva";
import {
  Upload,
  Sparkles,
  Type,
  Palette,
  Download,
  ImageIcon,
  Wand2,
  Layers,
  Move3D,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import img1 from "../../../asset/Img/1.png";
import img2 from "../../../asset/Img/2.png";
import img3 from "../../../asset/Img/3.png";
import img4 from "../../../asset/Img/4.png";
import img5 from "../../../asset/Img/5.png";
import img6 from "../../../asset/Img/6.png";
import img7 from "../../../asset/Img/7.png";
import img8 from "../../../asset/Img/8.png";
import img9 from "../../../asset/Img/9.png";
import img10 from "../../../asset/Img/10.png";
import img11 from "../../../asset/Img/11.png";
import img12 from "../../../asset/Img/12.png";
import img13 from "../../../asset/Img/13.png";
import img14 from "../../../asset/Img/14.png";
import img15 from "../../../asset/Img/15.png";
import img16 from "../../../asset/Img/16.png";
import img17 from "../../../asset/Img/17.png";
import img18 from "../../../asset/Img/18.png";
import img19 from "../../../asset/Img/19.png";
import img20 from "../../../asset/Img/20.png";

// Import Product type
import type { Product } from "@/types";
import AddToCartButton from "@/components/AddToCartButton";

const imageList = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
  img19,
  img20,
];

// Hook tải ảnh từ src
const useImageSrc = (src: string | null) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);
  return image;
};

// Interface cho sticker props
interface StickerProps {
  shapeProps: any;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attrs: any) => void;
}

// Component Sticker
const Sticker = ({ shapeProps, isSelected, onSelect, onChange }: StickerProps) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const image = useImageSrc(shapeProps.src);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const commonProps = {
    x: shapeProps.x,
    y: shapeProps.y,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    ref: shapeRef,
    onDragEnd: (e: any) =>
      onChange({
        x: e.target.x(),
        y: e.target.y(),
      }),
  };

  if (shapeProps.type === "image") {
    return (
      <>
        <KonvaImage
          {...commonProps}
          image={image}
          width={shapeProps.width}
          height={shapeProps.height}
          onTransformEnd={() => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(20, node.width() * scaleX),
              height: Math.max(20, node.height() * scaleY),
            });
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            rotateEnabled
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
              "top-center",
              "bottom-center",
            ]}
            boundBoxFunc={(oldBox, newBox) => (newBox.width < 20 || newBox.height < 20 ? oldBox : newBox)}
          />
        )}
      </>
    );
  }

  if (shapeProps.type === "text") {
    return (
      <>
        <KonvaText
          ref={shapeRef}
          {...shapeProps}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e: any) =>
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            })
          }
          onTransformEnd={() => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              fontSize: Math.max(10, shapeProps.fontSize * scaleX),
            });
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            enabledAnchors={["middle-left", "middle-right"]}
            rotateEnabled={false}
            boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 ? oldBox : newBox)}
          />
        )}
      </>
    );
  }

  return null;
};

// Component background
const BackgroundImage = ({ src, ...rest }: { src: string } & any) => {
  const image = useImageSrc(src);
  return image ? <KonvaImage image={image} {...rest} /> : null;
};

interface StickerEditorProps {
  product?: Product;
}

export default function StickerEditor({ product }: StickerEditorProps) {
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);
  const [stickers, setStickers] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const stageRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Lấy URL hình ảnh sản phẩm nếu có
  const productImageUrl = product?.picture || null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUploadBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBackgroundSrc(url);
  };

  // Sử dụng hình ảnh sản phẩm làm background
  const useProductAsBackground = () => {
    if (productImageUrl) {
      setBackgroundSrc(productImageUrl);
    }
  };

  useEffect(() => {
    setBackgroundSrc(productImageUrl);
  }, [productImageUrl]);

  // Sử dụng hình ảnh sản phẩm làm sticker
  const useProductAsSticker = () => {
    if (productImageUrl) {
      addSticker(productImageUrl);
    }
  };

  const handleStickerChange = (id: number, newAttrs: any) => {
    setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...newAttrs } : s)));
  };

  const addSticker = (src: any) => {
    try {
      if (!src) {
        console.error("Invalid image source");
        return;
      }

      const newId = Date.now();
      setStickers((prev) => [
        ...prev,
        {
          id: newId,
          type: "image",
          src: src,
          x: 100,
          y: 100,
          width: 80,
          height: 80,
        },
      ]);
      setSelectedId(newId);
    } catch (error) {
      console.error("Error adding sticker:", error);
    }
  };

  const addText = () => {
    const newId = Date.now();
    const newText = textInput || "Nhập text ở đây";
    setStickers((prev) => [
      ...prev,
      {
        id: newId,
        type: "text",
        text: newText,
        x: 100,
        y: 100,
        fontSize: 24,
        fill: "#000000",
        fontFamily: "Arial",
        width: 200,
      },
    ]);
    setSelectedId(newId);
    setTextInput(newText);
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setTextInput(newText);

    if (selectedId) {
      setStickers((prev) =>
        prev.map((st) => (st.id === selectedId && st.type === "text" ? { ...st, text: newText } : st))
      );
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setStickers((prev) => prev.map((st) => (st.id === selectedId && st.type === "text" ? { ...st, fill: color } : st)));
  };

  const handleDownload = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 3 });
    const link = document.createElement("a");
    link.download = "custom-sticker-design.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendToAdmin = async () => {
    if (!stageRef.current) return;

    setSendStatus("sending");

    try {
      // Capture canvas as base64
      const imageData = stageRef.current.toDataURL({ pixelRatio: 2 });

      // Prepare design data
      const designData = {
        image: imageData,
        stickers: stickers,
        backgroundSrc: backgroundSrc,
        message: sendMessage,
        timestamp: new Date().toISOString(),
        canvasSize: { width: 800, height: 600 },
        productId: product?._id || null,
      };

      // Simulate API call (replace with actual API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Sending design to admin:", designData);

      setSendStatus("success");
      setTimeout(() => {
        setShowSendModal(false);
        setSendStatus("idle");
        setSendMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error sending design:", error);
      setSendStatus("error");
      setTimeout(() => setSendStatus("idle"), 3000);
    }
  };

  useEffect(() => {
    const selectedTextSticker = stickers.find((s) => s.id === selectedId && s.type === "text");
    if (selectedTextSticker) {
      setTextInput(selectedTextSticker.text);
    } else if (selectedId && !stickers.find((s) => s.id === selectedId && s.type === "text")) {
      setTextInput("");
    }
  }, [selectedId, stickers]);

  const selectedTextSticker = stickers.find((s) => s.id === selectedId && s.type === "text");

  // Send to Admin Modal
  const SendModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {/* <div className="text-center mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl w-fit mx-auto mb-4">
            <Send className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Gửi thiết kế cho Admin</h3>
          <p className="text-gray-600 text-sm">Thiết kế của bạn sẽ được gửi để admin xem xét</p>
        </div> */}

        {sendStatus === "idle" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú cho admin (tùy chọn)</label>
              <textarea
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
                placeholder="Mô tả thiết kế hoặc yêu cầu đặc biệt..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 p-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSendToAdmin}
                className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Gửi ngay
              </button>
            </div>
          </div>
        )}

        {sendStatus === "sending" && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Đang gửi thiết kế...</p>
            <p className="text-gray-500 text-sm mt-1">Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {sendStatus === "success" && (
          <div className="text-center py-8">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-gray-700 font-medium mb-1">Gửi thành công!</p>
            <p className="text-gray-500 text-sm">Admin sẽ xem xét thiết kế của bạn</p>
          </div>
        )}

        {sendStatus === "error" && (
          <div className="text-center py-8">
            <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-gray-700 font-medium mb-1">Có lỗi xảy ra!</p>
            <p className="text-gray-500 text-sm mb-4">Vui lòng thử lại sau</p>
            <button
              onClick={() => setSendStatus("idle")}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-6"></div>
            <Wand2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Đang khởi tạo Studio</h3>
          <p className="text-gray-600">Chuẩn bị không gian sáng tạo của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      {/* <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Wand2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Reco - Sticker Design Studio
                </h1>
                <p className="text-sm text-gray-600">Tạo thiết kế sticker độc đáo của riêng bạn</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Layers className="h-4 w-4" />
              <span>{stickers.length} elements</span>
            </div>
          </div>
        </div>
      </div> */}

      <div className="flex gap-6 p-6 max-w-7xl mx-auto">
        {/* Enhanced Sidebar */}
        <div className="w-80 space-y-6">
          {/* Product Image Section - Chỉ hiển thị khi có sản phẩm */}
          {productImageUrl && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Hình ảnh sản phẩm</h3>
                  <p className="text-xs text-gray-600">Sử dụng hình ảnh sản phẩm</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={productImageUrl || "/placeholder.svg"}
                    alt="Product"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>

                {/* <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={useProductAsBackground}
                    className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 text-sm flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Dùng làm nền
                  </button>
                  <button
                    onClick={useProductAsSticker}
                    className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-rose-700 transition-all duration-200 text-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Thêm sticker
                  </button>
                </div> */}
              </div>
            </div>
          )}

          {/* Upload Background Section */}
          {/* <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Background</h3>
                <p className="text-xs text-gray-600">Tải lên ảnh nền</p>
              </div>
            </div>

            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadBackground}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="background-upload"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-300 group-hover:border-indigo-400 group-hover:bg-indigo-50/50">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-3 group-hover:text-indigo-500 transition-colors" />
                <p className="text-sm font-medium text-gray-700 mb-1">Kéo thả hoặc click để chọn</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (tối đa 10MB)</p>
              </div>
            </div>
          </div> */}

          {/* Add Stickers Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Stickers</h3>
                <p className="text-xs text-gray-600">Thêm sticker vào thiết kế</p>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 rounded-2xl">
              <div className="grid grid-cols-3 gap-3 p-1">
                {imageList.map((src, idx) => {
                  const imageSrc = typeof src === "string" ? src : src.src || " src.default" || src;

                  return (
                    <div
                      key={idx}
                      className="group aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 border-transparent bg-gradient-to-br from-gray-50 to-gray-100 p-2 hover:scale-105 hover:border-pink-400 hover:shadow-lg hover:from-pink-50 hover:to-rose-50"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addSticker(imageSrc);
                      }}
                      title={`Sticker ${idx + 1}`}
                    >
                      <img
                        src={imageSrc || "/placeholder.svg"}
                        alt={`Sticker ${idx + 1}`}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                        draggable={false}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add Text Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                <Type className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Text</h3>
                <p className="text-xs text-gray-600">Thêm và chỉnh sửa text</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={textInput}
                  onChange={handleTextInputChange}
                  placeholder="Nhập nội dung text..."
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-400 focus:outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white text-sm font-medium"
                />
              </div>

              <button
                onClick={addText}
                className="w-full p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Type className="h-4 w-4" />
                Thêm Text
              </button>
            </div>

            {/* Text Editor - Only show when text is selected */}
            {selectedTextSticker && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-gray-700">Chỉnh sửa text đã chọn</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Nội dung:</label>
                    <input
                      type="text"
                      value={textInput}
                      onChange={handleTextInputChange}
                      className="w-full p-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors duration-200 bg-emerald-50/50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Màu sắc:</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="color"
                        onChange={handleTextColorChange}
                        value={selectedTextSticker.fill || "#000000"}
                        className="w-8 h-8 border-none rounded-lg cursor-pointer shadow-sm"
                      />
                      <span className="text-sm text-gray-700 font-medium">Chọn màu</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Export & Share</h3>
                <p className="text-xs text-gray-600">Tải xuống hoặc gửi thiết kế</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full p-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Tải xuống PNG
              </button>

              <AddToCartButton product={product ?? {}} />
            </div>
          </div>
        </div>

        {/* Enhanced Canvas Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex justify-center">
              <div className="relative">
                <Stage
                  width={800}
                  height={600}
                  ref={stageRef}
                  className="border-2 border-gray-200 rounded-2xl bg-white shadow-lg"
                  onMouseDown={(e) => {
                    const clickedOnEmpty = e.target === e.target.getStage();
                    if (clickedOnEmpty) {
                      setSelectedId(null);
                    }
                  }}
                >
                  <Layer>
                    {backgroundSrc && <BackgroundImage src={backgroundSrc} x={0} y={0} width={800} height={600} />}
                    {stickers.map((sticker) => (
                      <Sticker
                        key={sticker.id}
                        shapeProps={sticker}
                        isSelected={sticker.id === selectedId}
                        onSelect={() => setSelectedId(sticker.id)}
                        onChange={(newAttrs) => handleStickerChange(sticker.id, newAttrs)}
                      />
                    ))}
                  </Layer>
                </Stage>

                {/* Canvas overlay info */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-xs font-medium">
                  800 × 600px
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tips */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Move3D className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-800">Hướng dẫn sử dụng</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-800">Thêm elements</p>
                  <p className="text-gray-600">Click vào sticker hoặc nhập text để thêm vào canvas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-800">Chỉnh sửa</p>
                  <p className="text-gray-600">Click vào element trên canvas để chọn và chỉnh sửa</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-800">Di chuyển & resize</p>
                  <p className="text-gray-600">Kéo thả để di chuyển, dùng handles để thay đổi kích thước</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-800">Xuất file</p>
                  <p className="text-gray-600">Click "Tải xuống PNG" để lưu thiết kế của bạn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Send Modal */}
      {showSendModal && <SendModal />}
    </div>
  );
}
