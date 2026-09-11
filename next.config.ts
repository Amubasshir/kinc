import type { NextConfig } from "next";

const deploymentId = process.env.DEPLOYMENT_VERSION || process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA;

const nextConfig: NextConfig = {
  deploymentId,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
