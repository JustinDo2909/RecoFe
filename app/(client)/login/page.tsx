"use client";

import CustomInput from "@/components/CustomInput";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const { login, signUp } = useUser();
  const router = useRouter();
  const handleSubmit = async (data: Record<string, string>) => {
    if (!isUpdate) {
      console.log(data.Password, data.UserName);

      const res = await login({
        username: data.UserName,
        password: data.Password,
      });

      if (res.success === true) {
        router.push('/');
        router.refresh();
      } else {
        console.log(res.message, "cut roi");
      }
    } else {
       await signUp({
        username: data.UserName,
        password: data.Password,
        email: data.Eamil,
        role: "user",
        passwordConfirm: data.Password,
      });
     
      setIsUpdate(!isUpdate)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden min-h-[400px]">
        <div
          className={`hidden md:flex flex-col duration-1000 transition-all justify-center items-center bg-gradient-to-br from-teal-500 to-teal-700 text-white p-8 md:w-1/2 ${isUpdate ? "translate-x-[100%]" : "translate-x-0"}`}
        >
          <h1 className="text-3xl font-bold">Welcome to Reco</h1>
          <p className="mt-2 text-lg text-center">
            Join us and experience the best services!
          </p>
        </div>

        <div
          className={`min-h-[500px] w-full md:w-1/2 p-8 duration-1000 transition-all ${isUpdate ? " md:-translate-x-[100%]" : "md:translate-x-0"}`}
        >
          <CustomInput
            fields={
              isUpdate
                ? ["UserName", "Eamil", "Password", "Confirm Password"]
                : ["UserName", "Password"]
            }
            onSubmit={handleSubmit}
            title={isUpdate ? `Register Your Account` : `Login to Your Account`}
            typeSubmit={isUpdate ? "Register Now" : "Login Now"}
          />

          <div className="flex my-4 gap-4 justify-center cursor-pointer text-gray-600 text-sm">
            <div
              onClick={() => setIsUpdate(!isUpdate)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-transform duration-500 hover:bg-gray-200"
            >
              <p className="hover:underline">I don’t have an account</p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg transition-transform duration-500 hover:bg-gray-200">
              <p className="hover:underline">
                {isUpdate ? "I Already Have Account" : "I forgot Password"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
