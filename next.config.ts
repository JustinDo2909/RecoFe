import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    domains: [
      "res.cloudinary.com",
      "cdnd.lystit.com",
      "static.super-shop.com",
      "cdn.shopify.com",
      "images-eu.ssl-images-amazon.com",
      "www.dhgate.com",
      "i5.walmartimages.com",
    ],
  },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
