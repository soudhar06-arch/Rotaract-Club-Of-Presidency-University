import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./Events%20even%20Details.txt"],
  },
};

export default nextConfig;
