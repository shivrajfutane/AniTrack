import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Emergency fix to ensure images show up immediately
    remotePatterns: [
      { protocol: 'https', hostname: 'myanimelist.net', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.myanimelist.net', pathname: '/**' },
      { protocol: 'https', hostname: 'api.dicebear.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
