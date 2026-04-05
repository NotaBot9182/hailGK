/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const isLocal = !apiUrl || apiUrl.startsWith('http://localhost') || apiUrl.startsWith('http://127.0.0.1');
    
    if (isLocal) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:8000/api/:path*',
        },
        {
          source: '/storage/:path*',
          destination: 'http://127.0.0.1:8000/storage/:path*',
        },
      ];
    }
    return [];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
}

module.exports = nextConfig
