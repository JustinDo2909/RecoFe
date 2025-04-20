import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatbotApi = createApi({
  reducerPath: "chatbotApi",
  tagTypes: ["Districts"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json")
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // postMessage
   postMessage: builder.mutation<any, { message: string }>({
    query: ({ message }) => ({
      url: `ask`,
      method: "POST",
      body: { question: message },
    }),
   })
  }),
});

export const { usePostMessageMutation } =
  chatbotApi;
