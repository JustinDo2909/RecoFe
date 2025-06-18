"use client";

import { useUser } from "@/hooks/useUser";
import loginImage from "@/images/Bglogin_new.jpg";
import { useForgotPasswordMutation } from "@/state/api";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // Import icons cho show/hide password
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CustomInput2 from "./seg";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [formData, setFormData] = useState({}); // State để lưu dữ liệu form
  const [showPassword, setShowPassword] = useState(false); // State cho show/hide password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State cho confirm password
  const [forgotPassword, { isLoading: isForgotPasswordLoading }] =
    useForgotPasswordMutation();
  const { login, signUp } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hàm reset form data
  const resetForm = () => {
    setFormData({});
  };

  const handleSubmit = async (data: Record<string, string>) => {
    if (!isUpdate) {
      const res = await login({
        email: data.Email,
        password: data.Password,
      });
      console.log('res', res)
      if (res.token) {
        resetForm(); // Xóa dữ liệu form khi login thành công
        if (res.user.role === "admin") {
          router.push("/dashboard/user");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        toast.error(res.error.data.message || "Login failed. Please try again.");
      }
    } else {
      console.log("data", data);
      const res = await signUp({
        username: data.UserName,
        password: data.Password,
        email: data.Email,
        phone: data.Phone,
        role: "user",
        passwordConfirm: data["Confirm Password"],
      });

      if (res.success) {
        // Giả sử API trả về success khi đăng ký thành công
        resetForm(); // Xóa dữ liệu form
        setIsUpdate(false); // Chuyển sang login
        alert("Registration successful! Please login.");
      } else {
        alert(res.message || "Registration failed. Please try again.");
      }
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email: forgotPasswordEmail }).unwrap();
      setForgotPasswordMessage("Kiểm tra email của bạn đi!");
      setForgotPasswordEmail("");
      setTimeout(() => {
        setForgotPasswordMessage("");
        setIsForgotPassword(false);
      }, 3000);
    } catch (err: any) {
      setForgotPasswordMessage(
        err.data?.message || "Failed to send reset link. Please try again."
      );
    }
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsUpdate(false);
    setForgotPasswordMessage("");
    setForgotPasswordEmail("");
    resetForm(); // Xóa dữ liệu form khi chuyển sang forgot password
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Cập nhật CustomInput để hỗ trợ show/hide password
  const renderInput = (
    field: string,
    formData: Record<string, string>,
    onInputChange: (field: string, value: string) => void
  ) => {
    const isPasswordField =
      field === "Password" || field === "Confirm Password";
    return (
      <div className="relative">
        <label className="text-sm font-medium text-gray-600">{field}</label>
        <input
          type={
            isPasswordField &&
            !(
              (field === "Password" && showPassword) ||
              (field === "Confirm Password" && showConfirmPassword)
            )
              ? "password"
              : "text"
          }
          value={formData[field] || ""}
          onChange={(e) => onInputChange(field, e.target.value)}
          className="mt-1 w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
          placeholder={`Nhập ${field.toLowerCase()}`}
          required
        />
        {isPasswordField && (
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500"
            onClick={() =>
              field === "Password"
                ? setShowPassword(!showPassword)
                : setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {(field === "Password" && showPassword) ||
            (field === "Confirm Password" && showConfirmPassword) ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
      </div>
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden min-h-[400px]">
        <Image
          src={loginImage}
          alt="Welcome to Reco"
          height={300}
          width={0}
          className={`hidden md:flex duration-1000 transition-all md:w-1/2 h-full object-cover ${
            isUpdate || isForgotPassword
              ? "translate-x-[100%]"
              : "translate-x-0"
          }`}
        />

        <div
          className={`min-h-[500px] w-full md:w-1/2 p-8 duration-1000 transition-all ${
            isUpdate || isForgotPassword
              ? "md:-translate-x-[100%]"
              : "md:translate-x-0"
          }`}
        >
          {isForgotPassword ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Quên Mật Khẩu
              </h2>
              {forgotPasswordMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mb-4 p-3 rounded-lg text-center ${
                    forgotPasswordMessage.includes("sent")
                      ? "bg-green-100 text-green-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {forgotPasswordMessage}
                </motion.div>
              )}
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="mt-1 w-full p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Nhập email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isForgotPasswordLoading}
                  className={`w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors ${
                    isForgotPasswordLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isForgotPasswordLoading ? "Đang gửi..." : "Gửi liên kết"}
                </button>
              </form>
              <div className="flex justify-center mt-4">
                <button
                  onClick={toggleForgotPassword}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Trở lại đăng nhập
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <CustomInput2
                fields={
                  isUpdate
                    ? [
                        "UserName",
                        "Email",
                        "Phone",
                        "Password",
                        "Confirm Password",
                      ]
                    : ["Email", "Password"]
                }
                onSubmit={handleSubmit}
                title={isUpdate ? "Đăng ký " : "Đăng nhập "}
                typeSubmit={isUpdate ? "Đăng ký " : "Đăng nhập"}
                formData={formData}
                onInputChange={handleInputChange}
                renderInput={renderInput}
              />

              <div className="flex my-4 gap-4 justify-center cursor-pointer text-gray-600 text-sm">
                <div
                  onClick={() => {
                    setIsUpdate(!isUpdate);
                    setIsForgotPassword(false);
                    resetForm(); // Xóa dữ liệu form khi chuyển đổi
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-transform duration-500 hover:bg-gray-200"
                >
                  <p className="hover:underline">
                    {isUpdate ? "Đã có tài khoản?" : "Chưa có tài khoản"}
                  </p>
                </div>

                <div
                  onClick={toggleForgotPassword}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-transform duration-500 hover:bg-gray-200"
                >
                  <p className="hover:underline">
                    {isUpdate ? "Quên mật khẩu" : "Quên mật khẩu"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
