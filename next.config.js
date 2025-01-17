/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['jztbkimlcrfndooyhohg.supabase.co'],
    unoptimized: true,
  },
  transpilePackages: ['react-big-calendar'],
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    esmExternals: true
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src'
    }
    return config;
  },
}

module.exports = nextConfig