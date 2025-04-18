import {
  Product,
  User,
  Category,
  Card,
  Order,
  Service,
  Request,
} from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FetchArgs, BaseQueryApi } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { create } from "domain";

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


    return result; // ✅ Không truy cập result.data.data
  } catch (error) {
    return {
      error: {
        status: "FETCH_ERROR",
        error: (error as Error).message || "Unknown error",
      },
    };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: [
    "Users",
    "Products",
    "Categories",
    "Card",
    "Order",
    "Requests",
    "Services",
  ],
  endpoints: (build) => ({
    //login
    authLogin: build.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: `/auth/login`,
        method: "POST",
        body,
      }),
      transformResponse: (response: any): User => response.data,
      invalidatesTags: ["Users"],
    }),
    //register
    authRegister: build.mutation<
      any,
      {
        username: string;
        password: string;
        passwordConfirm: string;
        email: string;
        role: string;
      }
    >({
      query: (body) => ({
        url: `/auth/signup`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    //getMe
    getMe: build.query<any, void>({
      query: () => "/auth/me",
      providesTags: ["Users"],
      transformResponse: (response: any): User => response.data,
    }),
    //logout
    authLogout: build.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    //getProduct
    getProduct: build.query<Product[], {}>({
      query: () => ({
        url: "/product",
      }),
      providesTags: ["Products"],
      transformResponse: (response: any): Product[] => response.data,
    }),
    //getCategory
    getCategory: build.query<Category[], {}>({
      query: () => ({
        url: "/category",
      }),
      providesTags: ["Categories"],
      transformResponse: (response: any): Category[] => response.data,
    }),
    //getCard
    getCard: build.query<Card[], {}>({
      query: () => ({
        url: "/cart",
      }),
      providesTags: ["Card"],
      transformResponse: (response: any): Card[] => response.data,
    }),
    //addProductToCard
    addProductToCard: build.mutation<
      Card[],
      { productId: string; quantity: number }
    >({
      query: (body) => ({
        url: "/cart/add",
        method: "POST",
        body: body,
      }),
      transformResponse: (response: any): Card[] => response.data,
    }),
    //deleteProductToCard
    deleteAllProductToCard: build.mutation<any, {}>({
      query: () => ({
        url: "/cart/delete",
        method: "DELETE",
      }),
      invalidatesTags: ["Card"],
    }),
    //updateProductToCard
    updateProductToCard: build.mutation<
      Card[],
      { productId: string; quantity: number; action: string }
    >({
      query: (body) => ({
        url: "/cart/update",
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Card"],
      transformResponse: (response: any): Card[] => response.data,
    }),
    //Create Order
    createOrder: build.mutation<
      Order[],
      { paymentMethod: string; statusPayment: string; statusOrder: string ; feeShipping : number}
    >({
      query: (body) => ({
        url: "/order/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Order"],
      transformResponse: (response: any): Order[] => response.data,
    }),
    //Get Order
    getOrder: build.query<Order[], {}>({
      query: () => ({
        url: "/order",
      }),
      providesTags: ["Order"],
      transformResponse: (response: any): Order[] => response.data,
    }),
    //Update OrderStatus
    updateOrderStatus: build.mutation<any, { id: string; statusOrder: string }>(
      {
        query: (body) => ({
          url: `/order/updateStatus/${body.id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Order"],
      }
    ),
    ///*** Admin */

    //get Users
    getUsers: build.query<User[], {}>({
      query: () => ({
        url: "/auth/users",
      }),
      providesTags: ["Users"],
      transformResponse: (response: any): User[] => response.data,
    }),
    //delete User
    deleteUser: build.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/auth/deleteUser/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    //update User
    updateUser: build.mutation<
      any,
      { username: string; email: string; id: string }
    >({
      query: ({ id, username, email }) => ({
        url: `/auth/update/${id}`,
        method: "PUT",
        body: { username, email },
      }),
      invalidatesTags: ["Users"],
    }),
    //create Product
    createProduct: build.mutation<any, { formData: FormData }>({
      query: (formData) => ({
        url: "/product/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    //delete Product
    deleteProduct: build.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    //update Product
    updateProduct: build.mutation<
      any,
      {
        id: string;
        name: string;
        description: string;
        price: number;
        categorys: string;
      }
    >({
      query: ({ id, name, description, price, categorys }) => ({
        url: `/product/update/${id}`,
        method: "PUT",
        body: { name, description, price, categorys },
      }),
      invalidatesTags: ["Products"],
    }),
    //create Category
    createCategory: build.mutation<
      any,
      { title: string; description: string; products?: string }
    >({
      query: ({ title, description, products }) => ({
        url: "/category/create",
        method: "POST",
        body: { title, description, products },
      }),
      invalidatesTags: ["Categories"],
    }),
    //delete Category
    deleteCategory: build.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    //update Category
    updateCategory: build.mutation<
      any,
      { id: string; title: string; description: string; products?: string }
    >({
      query: ({ id, title, description, products }) => ({
        url: `/category/update/${id}`,
        method: "PUT",
        body: { title, description, products },
      }),
      invalidatesTags: ["Categories"],
    }),
    //get AllOrder
    getAllOrder: build.query<Order[], {}>({
      query: () => ({
        url: "/order/all",
      }),
      providesTags: ["Order"],
      transformResponse: (response: any): Order[] => response.data,
    }),
    //get AllService
    getAllService: build.query<Service[], {}>({
      query: () => ({
        url: "/service",
      }),
      providesTags: ["Services"],
      transformResponse: (response: any): Service[] => response.data,
    }),
    //delete Service
    deleteService: build.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/service/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
    //update Service
    updateService: build.mutation<
      Service,
      { id: string; name?: string; description?: string; price?: number }
    >({
      query: ({ id, name, description, price }) => ({
        url: `/service/update/${id}`,
        method: "PUT",
        body: { name, description, price },
      }),
      invalidatesTags: ["Services"],
    }),
    createService: build.mutation<
      Service,
      { id: string; name: string; description: string; price: number }
    >({
      query: (body) => ({
        url: "/service/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Services"],
    }),
    //get AllRequest
    getAllRequest: build.query<Request[], {}>({
      query: () => ({
        url: "/request/all",
      }),
      providesTags: ["Requests"],
      transformResponse: (response: any): Request[] => response.data,
    }),
    //get Request
    getRequest: build.query<Request[], {}>({
      query: () => ({
        url: "/request",
      }),
      providesTags: ["Requests"],
      transformResponse: (response: any): Request[] => response.data,
    }),
    //create Refund Request
    createRefundRequest: build.mutation<
      Request,
      { type: string; message: string; order: string }
    >({
      query: (body) => ({
        url: "/request/createRefundRequest",
        method: "POST",
        body: body,
      }),
      transformResponse: (response: any): Request => response.data,
      invalidatesTags: ["Requests"],
    }),
    //create Service Request
    createServiceRequest: build.mutation<
      Request,
      { type: string; message: string; service: string }
    >({
      query: (body) => ({
        url: "/request/createServiceRequest",
        method: "POST",
        body: body,
      }),
      transformResponse: (response: any): Request => response.data,
      invalidatesTags: ["Requests"],
    }),
    //update Status Request
    updateStatusRequest: build.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/request/updateStatus/${id}`,
        method: "PUT",
        body: { status },
      }),
      transformResponse: (response: any): Request => response.data,
      invalidatesTags: ["Requests", "Order"],
    }),
  }),
});

export const {
  useAuthLoginMutation,
  useAuthRegisterMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useAuthLogoutMutation,
  useGetProductQuery,
  useGetCategoryQuery,
  useGetCardQuery,
  useAddProductToCardMutation,
  useDeleteAllProductToCardMutation,
  useUpdateProductToCardMutation,
  useCreateOrderMutation,
  useLazyGetOrderQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useGetAllOrderQuery,
  useGetAllServiceQuery,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
  useCreateServiceMutation,
  useGetAllRequestQuery,
  useGetRequestQuery,
  useCreateRefundRequestMutation,
  useCreateServiceRequestMutation,
  useUpdateStatusRequestMutation,
} = api;
