import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Emergency fix to ensure images show up immediately
    remotePatterns: [
      { protocol: 'https', hostname: 'myanimelist.net', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.myanimelist.net', pathname: '/**' },
      { protocol: 'https', hostname: 'api.dicebear.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 's4.anilist.co', pathname: '/**' },
    ],
  },
};

export default nextConfig;
