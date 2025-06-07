import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatbotApi = createApi({
  reducerPath: "chatbotApi",
  tagTypes: ["Messages"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    postMessage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "ask",
        method: "POST",
        body: formData, // ✅ Để nguyên FormData, không tự set Content-Type
      }),
      invalidatesTags: ["Messages"], // hoặc bạn có thể xóa nếu không cần cache
    }),
  }),
});

export const { usePostMessageMutation } = chatbotApi;
