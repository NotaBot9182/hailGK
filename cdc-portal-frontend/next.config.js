/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api_proxy/:path*',
        // Route requests internally inside WSL to the Laravel server
        destination: 'http://127.0.0.1:8000/api/:path*', 
      },
      {
        source: '/storage/:path*',
        destination: 'http://127.0.0.1:8000/storage/:path*', 
      },
    ];
  },
  env: {
    // We use the proxy path so it works everywhere (localhost, mobile)
    NEXT_PUBLIC_API_URL: '/api_proxy',
  },
}

module.exports = nextConfig
