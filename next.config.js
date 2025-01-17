/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['jztbkimlcrfndooyhohg.supabase.co'],
    unoptimized: true,
  },
  transpilePackages: ['react-big-calendar', 'moment'],
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    esmExternals: 'loose'
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
}

module.exports = nextConfig