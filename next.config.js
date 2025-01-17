/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-big-calendar', 'moment'],
  experimental: {
    esmExternals: 'loose'
  },
  typescript: {
    // Apenas para produção, não recomendado para desenvolvimento
    ignoreBuildErrors: true
  },
  eslint: {
    // Apenas para produção, não recomendado para desenvolvimento
    ignoreDuringBuilds: true
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true
}

module.exports = nextConfig