import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ghnApi = createApi({
  reducerPath: "ghnApi",
  tagTypes: ["Districts"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://online-gateway.ghn.vn/shiip/public-api/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set(
        "Token",
        process.env.GHN_API_TOKEN || "2097f4fe-1bfe-11f0-8aaa-9ed348b01f47",
      );
      headers.set("ShopId", process.env.GHN_SHOP_ID || "5738915");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // getProvinces
    getProvinces: builder.query<any[], {}>({
      query: ({}) => ({
        url: `master-data/province`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data.map((item: any) => ({
          name: item.ProvinceName,
          codeId: item.ProvinceID.toString(),
        }));
      },
    }),
    // getProvinces
    getDistricts: builder.query<any[], { provinceId: number }>({
      query: ({ provinceId }) => ({
        url: `master-data/district?province_id=${provinceId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data.map((item: any) => ({
          name: item.DistrictName,
          codeId: item.DistrictID.toString(),
        }));
      },
    }),
    // getProvinces
    getWards: builder.query<any[], { districtId: number }>({
      query: ({ districtId }) => ({
        url: `/master-data/ward?district_id=${districtId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response.data.map((item: any) => ({
          name: item.WardName,
          codeId: item.WardCode.toString(),
        }));
      },
    }),
    //caculate fee
    getShippingFee: builder.mutation<
      any,
      {
        service_type_id?: number;
        // from_district_id: number;
        // from_ward_code: string;
        to_district_id: number;
        to_ward_code: string;
        length?: number;
        width?: number;
        height?: number;
        weight: number;
        insurance_value?: number;
        coupon?: string | null;
        items: {
          name: string;
          quantity: number;
          length?: number;
          width?: number;
          height?: number;
          weight?: number;
        }[];
      }
    >({
      query: (body) => ({
        url: "/v2/shipping-order/fee",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetDistrictsQuery,
  useGetWardsQuery,
  useGetProvincesQuery,
  useGetShippingFeeMutation,
} = ghnApi;
