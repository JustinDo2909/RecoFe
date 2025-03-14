import {

  Product,
    User,
   
  } from "@/types";
  import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
  import { FetchArgs, BaseQueryApi } from "@reduxjs/toolkit/query";
  import { toast } from "sonner";
  import Cookies from "js-cookie";
  
  const customBaseQuery = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: any
  ) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: "http://localhost:9999",
      credentials: "include", 
      prepareHeaders: async (headers) => {
        const token = Cookies.get("authToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });
  
    try {
      const result: any = await baseQuery(args, api, extraOptions);
      
      if (result.error) {
        const errorMessage = result.error.data?.message || "An error occurred";
        toast.error(`Error: ${errorMessage}`);
        return { error: result.error }; // Trả về lỗi ngay lập tức
      }
  
      console.log("API Response:", result.data); // ✅ Kiểm tra dữ liệu
  
      return result; // ✅ Không truy cập result.data.data
    } catch (error) {
      return { error: { status: "FETCH_ERROR", error: (error as Error).message || "Unknown error" } };
    }
  };
  
  
  export const api = createApi({
    baseQuery: customBaseQuery,
    reducerPath: "api",
    tagTypes: ["Users", "Products"],
    endpoints: (build) => ({
      //login
      authLogin: build.mutation<any, { username: string, password: string }>({
        query: (body) => ({
          url: `/auth/login`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Users"],
      }),
      //register
      authRegister: build.mutation<any, {username: string, password: string,passwordConfirm: string ,  email: string, role: string}> ({
        query: (body) => ({
          url: `/auth/signup`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Users"]
      }),
      //getMe
      getMe: build.query<any, void>({
        query: () => "/auth/me",
        providesTags: ["Users"],
      }),
      //logout
      authLogout: build.mutation<any, void>({
        query: () => ({
         url : "/auth/logout",
         method: "POST"
        }),
        invalidatesTags: ["Users"],
      }),
      //getProduct
      getProduct: build.query<Product[] , {}>({
        query: () => ({
         url : "/product",
        }),
        providesTags: ["Products"],
        transformResponse : (response : any): Product [] => response.data
      }),
    })

  });
  
  export const {
    useAuthLoginMutation,  
    useAuthRegisterMutation,
    useGetMeQuery,
    useAuthLogoutMutation,
    useGetProductQuery
  } = api;
  