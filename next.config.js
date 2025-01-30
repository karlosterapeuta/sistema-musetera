/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-big-calendar', 'jspdf', 'html2canvas'],
  experimental: {
    esmExternals: true,
    // Ajustei o valor para um limite mais razoável ou você pode remover a linha se não for necessário
    largePageDataBytes: 128 * 1000, // ou remova esta linha
  },
  images: {
    domains: ['jztbkimlcrfndooyhohg.supabase.co'],
    unoptimized: true,
  },
  typescript: {
    // Removi a configuração de ignorar erros de build, recomendável corrigir os erros ao invés de ignorá-los
    ignoreBuildErrors: false,
  },
  eslint: {
    // Removi a configuração de ignorar erros do ESLint durante builds, é melhor corrigir esses erros
    ignoreDuringBuilds: false,
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  distDir: '.next',
  generateEtags: true,
  // Deixei o optimizeFonts como true, para melhorar o desempenho de carregamento das fontes
  optimizeFonts: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src'
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      canvas: false,
      encoding: false
    }
    return config
  }
}

module.exports = nextConfig
