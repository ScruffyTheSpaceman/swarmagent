/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['node-vault', 'bcryptjs', 'jsonwebtoken']
  },
  env: {
    CUSTOM_LLM_ENDPOINT: 'https://oi-server.onrender.com/chat/completions',
    CUSTOM_LLM_CUSTOMER_ID: 'cus_Sxr3rlGaox3rKZ',
    CUSTOM_LLM_AUTHORIZATION: 'Bearer xxx'
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/vault/:path*',
        destination: '/api/vault/:path*'
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    return config
  },
  images: {
    domains: ['localhost', 'vercel.app'],
    unoptimized: true
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  }
}

export default nextConfig