"use client";

import CustomInput from "@/components/CustomInput";
import { useUser } from "@/hooks/useUser";
import { useForgotPasswordMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import loginImage from "@/images/login.jpg"; 
const LoginPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPassword] = useForgotPasswordMutation();
  const { login, signUp } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (data: Record<string, string>) => {
    if (!isUpdate) {
      const res = await login({
        email: data.Email,
        password: data.Password,
      });

      if (res.token) {
        if (res.user.role === "admin") {
          router.push("/dashboard/user");
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        alert(res.message);
      }
    } else {
      await signUp({
        username: data.UserName,
        password: data.Password,
        email: data.Eamil, // Note: Typo in original code ('Eamil' instead of 'Email')
        role: "user",
        passwordConfirm: data["Confirm Password"],
      });
      setIsUpdate(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email: forgotPasswordEmail }).unwrap();
      setForgotPasswordMessage("Password reset link sent to your email!");
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
    isUpdate || isForgotPassword ? "translate-x-[100%]" : "translate-x-0"
  }`}
/>


        <div
          className={`min-h-[500px] w-full md:w-1/2 p-8 duration-1000 transition-all ${
            isUpdate || isForgotPassword ? "md:-translate-x-[100%]" : "md:translate-x-0"
          }`}
        >
          {isForgotPassword ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Forgot Password
              </h2>
              {forgotPasswordMessage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mb-4 p-3 rounded-lg text-center ${
                    forgotPasswordMessage.includes("successfully")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
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
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotPassword.isLoading}
                  className={`w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors ${
                    forgotPassword.isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {forgotPassword.isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <div className="flex justify-center mt-4">
                <button
                  onClick={toggleForgotPassword}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <CustomInput
                fields={
                  isUpdate
                    ? ["UserName", "Eamil", "Password", "Confirm Password"]
                    : ["Email", "Password"]
                }
                onSubmit={handleSubmit}
                title={
                  isUpdate ? "Register Your Account" : "Login to Your Account"
                }
                typeSubmit={isUpdate ? "Register Now" : "Login Now"}
              />

              <div className="flex my-4 gap-4 justify-center cursor-pointer text-gray-600 text-sm">
                <div
                  onClick={() => {
                    setIsUpdate(!isUpdate);
                    setIsForgotPassword(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-transform duration-500 hover:bg-gray-200"
                >
                  <p className="hover:underline">
                    {isUpdate ? "I Already Have Account" : "I don’t have an account"}
                  </p>
                </div>

                <div
                  onClick={toggleForgotPassword}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-transform duration-500 hover:bg-gray-200"
                >
                  <p className="hover:underline">
                    {isUpdate ? "I forgot Password" : "I forgot Password"}
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