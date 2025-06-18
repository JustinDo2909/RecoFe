"use client";

import { Provider } from "react-redux";
import React from "react";
import { store } from "@/state/redux";
// import StoreProvider from "@/app/StoreProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
