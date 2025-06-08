"use client";

import {
  useAuthLoginMutation,
  useAuthLogoutMutation,
  useAuthRegisterMutation,
  useLazyGetMeQuery,
} from "@/state/api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

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
          console.error("Lỗi khi gọi getMe:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    fetchUser();
  }, [triggerGetMe]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const data = await loginAPI({ email, password }).unwrap();
      const { token } = data;
      console.log(data, "dv");

      Cookies.set("authToken", token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      // // Gọi getMe sau khi login để lấy thông tin user
      // const me = await triggerGetMe().unwrap();
      // const userInfo = me.data.user;

      setUser(data.user);
      Cookies.set("user", encodeURIComponent(JSON.stringify(data.user)), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });
      return data;
    } catch (error) {
      console.error("Login failed:", error);
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

      return data;
    } catch (error) {
      console.error("SignUp failed:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    Cookies.remove("authToken");
    Cookies.remove("user");
    setUser(null);
  };

  const isLogged = !!user;

  return { user, loading, login, logout, signUp, isLogged };
};
