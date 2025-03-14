"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthLoginMutation , useAuthLogoutMutation, useAuthRegisterMutation, useGetMeQuery } from "@/state/api";



export const useUser = () => {
  const [user, setUser] = useState< any>(null);
  const [loading, setLoading] = useState(true);
  const [signUpApi] = useAuthRegisterMutation();
  const [loginAPI] = useAuthLoginMutation();
  // const { refetch: getMe } = useGetMeQuery();
  const [ logoutUser ] = useAuthLogoutMutation();



  // Hàm đăng nhập
  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const data = await loginAPI({ username, password }).unwrap();
      
      const { token } = data;
        console.log(data, "kkk");
        
        Cookies.set("authToken", token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });


      // const meData = await getMe().unwrap(); 
      
    //  if(meData.success === true){
    //      Cookies.set("user", JSON.stringify(meData.Finduser), {
    //        expires: 7,
    //        secure: true,
    //        sameSite: "strict",
    //      });

         
    //      setUser(meData.Finduser);
    //  }
     return data
  
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };




  const signUp = async ({
    username,
    password,
    email,
    role,
    passwordConfirm
  }: {
    username: string;
    password: string;
    email: string
    role: string,
    passwordConfirm: string
  }) => {
    setLoading(true);
    try {
      console.log(username, password, "data");
      const data = await signUpApi({ username, password, email , role, passwordConfirm }).unwrap();

      // console.log(data.statusCode);
      // if (data.statusCode === 200) {
      //   console.log("Đăng ký thành công!");
      // } else {
      //   console.log("Đăng ký thất bại!", data.message);
      // }
      console.log(data, 'dd');
      
    } catch (error) {
      console.error("signUp failed:", error);
      return {error}

    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = async() => {
    await logoutUser()
    Cookies.remove("authToken");
    setUser(null);
  };

  const isLogged = !!user;

  return { user, loading, login, logout, signUp, isLogged };
};
