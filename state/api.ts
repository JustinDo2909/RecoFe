import {
  Card,
  Category,
  CustomResponse,
  DashboardParams,
  DashboardStats,
  Discount,
  Order,
  Product,
  Request,
  Service,
  User,
  Wallet
} from "@/types";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  DiscountRequestOrder,
  DiscountRequestProduct,
  Response,
} from "./../types/index";

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
    "Wallet",
    "Dashboard",
    "Discount",
    "Custom",
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
        phone: string;
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
    changePassword: build.mutation<
      any,
      {
        confirmNewPassword: string;
        newPassword: string;
        currentPassword: string;
      }
    >({
      query: (body) => ({
        url: `/auth/changePassword`,
        method: "PUT",
        body,
      }),
    }),
    forgotPassword: build.mutation<any, { email: string }>({
      query: (body) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body,
      }),
    }),
    resetPassword: build.mutation<
      any,
      { resetToken: string; newPassword: string }
    >({
      query: ({ resetToken, newPassword }) => ({
        url: `/auth/reset-password/${resetToken}`,
        method: "POST",
        body: { newPassword },
      }),
    }),

    //updateProfile
    updateProfile: build.mutation<
      any,
      { phone: string; email: string; username: string }
    >({
      query: (body) => ({
        url: `/auth/update`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
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
    getProduct: build.query<Product[], void>({
      query: () => ({
        url: "/product",
      }),
      providesTags: ["Products"],
      transformResponse: (response: any): Product[] => response.data,
    }),
    getProductById: build.query<Product, { id: any }>({
      query: ({ id }) => ({
        url: `/product/${id}`,
      }),
      providesTags: ["Products"],
      transformResponse: (response: any): Product => response.data,
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
    getCard: build.query<Card[], void>({
      query: () => ({
        url: "/cart",
      }),
      providesTags: (result) => (result ? [{ type: "Card", id: "LIST" }] : []),
      transformResponse: (response: any): Card[] => response?.data ?? [],
      transformErrorResponse: (error: any): Card[] => {
        if (error?.status === 404) return [];
        return [];
      },
    }),

    //addProductToCard
    addProductToCard: build.mutation<
      Response<null>,
      { productId: string; quantity: number }
    >({
      query: (body) => ({
        url: "/cart/add",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response,
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
      {
        paymentMethod: string;
        statusPayment: string;
        statusOrder: string;
        feeShipping: number;
        address: any;
      }
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
    updateOrderStatus: build.mutation<
      Response<unknown>,
      { id: string; statusOrder: string; reason?: string }
    >({
      query: ({ id, statusOrder, reason }) => ({
        url: `/order/updateStatus/${id}`,
        method: "PUT",
        body: {
          statusOrder,
          ...(reason && { reason }), // chỉ thêm reason nếu có
        },
      }),
      invalidatesTags: ["Order"],
    }),

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
    // createProduct: build.mutation<any, { formData: FormData }>({
    //   query: (formData) => ({
    //     url: "/product/create",
    //     method: "POST",
    //     body: formData,
    //   }),
    //   invalidatesTags: ["Products"],
    // }),
    //delete Product
    deleteProduct: build.mutation<any, { id: string }>({
      query: (id) => ({
        url: `/product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    //update Product
    // updateProduct: build.mutation<
    //   any,
    //   {
    //     id: string;
    //     name: string;
    //     description: string;
    //     price: number;
    //     categorys: string;
    //   }
    // >({
    //   query: ({ id, name, description, price, categorys }) => ({
    //     url: `/product/update/${id}`,
    //     method: "PUT",
    //     body: { name, description, price, categorys },
    //   }),
    //   invalidatesTags: ["Products"],
    // }),
    //create Category
    createCategory: build.mutation<
      any,
      { title: string; description: string; products?: string[] }
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
      { id: string; title: string; description: string; products?: string[] }
    >({
      query: ({ id, title, description, products }) => ({
        url: `/category/update/${id}`,
        method: "PUT",
        body: { title, description, products },
      }),
      invalidatesTags: ["Categories"],
    }),
    //get AllOrder
    getAllOrder: build.query<Order[], void>({
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

    //get Wallet
    getWallet: build.query<Wallet, {}>({
      query: () => ({ url: "/wallet" }),
      providesTags: ["Wallet"],
      transformResponse: (response: any): Wallet => response.data,
    }),

    getDashboard: build.query<DashboardStats, DashboardParams>({
      query: ({ start, end }) => ({
        url: "/admin/dashboard/stats",
        params: { start, end },
      }),
      transformResponse: (response: any): DashboardStats => response.data,
    }),

    disableUser: build.mutation<any, { id: string; message: string }>({
      query: ({ id, message }) => ({
        url: `/auth/disable/${id}`,
        method: "PATCH",
        body: { message },
      }),
      invalidatesTags: ["Users"], // hoặc ["Users"] nếu bạn có tag tương ứng
    }),

    enableUser: build.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/auth/enable/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"], // hoặc ["Users"] nếu bạn có tag tương ứng
    }),

    //  Khuyến mãi
    getDiscounts: build.query<Discount[], void>({
      query: () => ({
        url: "/discount",
      }),
      transformResponse: (response: any): Discount[] => response.data,
    }),

    disableDiscount: build.mutation<
      Response<Discount>,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/discount/deactivate/${id}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Discount"], // hoặc ["Users"] nếu bạn có tag tương ứng
    }),
    activeDiscount: build.mutation<Response<Discount>, { id: string }>({
      query: ({ id }) => ({
        url: `/discount/activate/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Discount"], // hoặc ["Users"] nếu bạn có tag tương ứng
    }),

    createDiscountProduct: build.mutation<any, DiscountRequestProduct>({
      query: (body) => ({
        url: "/discount/product",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["Discount"],
    }),

    createDiscountOrder: build.mutation<any, DiscountRequestOrder>({
      query: (body) => ({
        url: "/discount/order",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ["Discount"],
    }),

    updateDiscountProduct: build.mutation<
      void,
      { id: string; body: DiscountRequestProduct }
    >({
      query: ({ id, body }) => ({
        url: `/discount/update/product/${id}`,
        method: "PUT",
        body,
      }),
    }),

    updateDiscountOrder: build.mutation<
      void,
      { id: string; body: DiscountRequestOrder }
    >({
      query: ({ id, body }) => ({
        url: `/discount/update/order/${id}`,
        method: "PUT",
        body,
      }),
    }),

    createProduct: build.mutation({
      query: (newProduct) => ({
        url: "/product/create",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // Cập nhật sản phẩm
    updateProduct: build.mutation({
      query: ({ id, data }) => ({
        url: `/product/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    deactivateProduct: build.mutation<
      Response<Product>,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/product/deactivate/${id}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Products"], // gắn tag nếu bạn dùng để refetch lại list
    }),

    reactivateProduct: build.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/product/reactivate/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Products"],
    }),

    addDiscountProduct: build.mutation<
      Response<void>,
      { productId: string; discountId: string }
    >({
      query: ({ productId, discountId }) => ({
        url: `/discount/discountProduct`,
        method: "PATCH",
        body: { productId, discountId },
      }),
    }),

    removeDiscountProduct: build.mutation<
      Response<unknown>,
      { productId: string; discountId: string }
    >({
      query: ({ productId, discountId }) => ({
        url: `/discount/products/${productId}/remove`,
        method: "PATCH",
        body: { discountId },
      }),
    }),

    createCate: build.mutation({
      query: (newCate) => ({
        url: "/category/create",
        method: "POST",
        body: newCate,
      }),
      invalidatesTags: ["Categories"],
    }),

    updateCate: build.mutation({
      query: ({ id, data }) => ({
        url: `/category/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    deactivateCate: build.mutation<
      Response<Product>,
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/category/disable/${id}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Categories"],
    }),

    EnableCate: build.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/category/enable/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Categories"],
    }),

    walletPay: build.mutation<
      any,
      {
        items: any;
        totalPrice: any;
        feeShipping: any;
        currentDiscount: any;
        address: any;
      }
    >({
      query: (body) => ({
        url: "/wallet/pay",
        method: "POST",
        body: body,
        transformResponse: (response: any) => response.data,
      }),
      invalidatesTags: ["Wallet"],
    }),

    customeDesign: build.mutation<Response<null>, FormData>({
      query: (formData) => ({
        url: `/custome/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Custom"],
    }),

    getAllCustom: build.query<Response<CustomResponse[]>, void>({
      query: () => ({
        url: `/custome/all`,
        method: "GET",
      }),
      providesTags: ["Custom"],
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
  useGetProductByIdQuery,
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
  useGetWalletQuery,
  useGetDashboardQuery,
  useDisableUserMutation,
  useEnableUserMutation,
  useGetDiscountsQuery,
  useDisableDiscountMutation,
  useActiveDiscountMutation,

  useDeactivateProductMutation,
  useReactivateProductMutation,

  useCreateDiscountOrderMutation,
  useCreateDiscountProductMutation,
  useUpdateDiscountProductMutation,
  useUpdateDiscountOrderMutation,

  useRemoveDiscountProductMutation,
  useAddDiscountProductMutation,

  useCreateCateMutation,
  useUpdateCateMutation,
  useDeactivateCateMutation,
  useEnableCateMutation,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,

  useUpdateOrderStatusMutation,
  useWalletPayMutation,

  useCustomeDesignMutation,
  useGetAllCustomQuery,
} = api;
