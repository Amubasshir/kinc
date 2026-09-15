import type { NextConfig } from "next";

const deploymentId = process.env.DEPLOYMENT_VERSION || process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA;

const nextConfig: NextConfig = {
  deploymentId,
  images: {
    unoptimized: true,
  },
  // Everything under /public/video uses versioned filenames (…v1.mp4), so a
  // given URL never changes content. Serve it immutable: repeat visitors reuse
  // it with no revalidation request at all. Bump the filename to publish a change.
  async headers() {
    return [
      {
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
