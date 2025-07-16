"use client";

import { useAuthLoginMutation, useAuthLogoutMutation, useAuthRegisterMutation, useLazyGetMeQuery } from "@/state/api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signUpApi] = useAuthRegisterMutation();
  const [loginAPI] = useAuthLoginMutation();
  const [logoutUser] = useAuthLogoutMutation();
  const [triggerGetMe] = useLazyGetMeQuery(); // dùng lazy để gọi thủ công

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("authToken");

      if (token) {
        try {
          const result = await triggerGetMe().unwrap();
          setUser(result);
        } catch (error) {
          toast.error("Lỗi khi gọi getMe:", error || "Lỗi khi gọi getMe");
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    fetchUser();
  }, [triggerGetMe]);

  const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      const data = await loginAPI({ email, password }).unwrap();
      const { token } = data;
      console.log(data, "dv");
      localStorage.setItem("token", token);
      Cookies.set("authToken", token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      setUser(data.user);
      Cookies.set("user", encodeURIComponent(JSON.stringify(data.user)), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      toast.success("Login successful!");
      return data;
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({
    username,
    password,
    email,
    role,
    phone,
    passwordConfirm,
  }: {
    username: string;
    password: string;
    email: string;
    role: string;
    phone: string;
    passwordConfirm: string;
  }) => {
    setLoading(true);
    try {
      const data = await signUpApi({
        username,
        password,
        email,
        role,
        phone,
        passwordConfirm,
      }).unwrap();
      toast.success("Sign up successful!");
      return data;
    } catch (error) {
      toast.error("Error signing up:", error || "Error signing up");
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    Cookies.remove("authToken");
    Cookies.remove("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const isLogged = !!user;

  return { user, loading, login, logout, signUp, isLogged };
};
