#!/usr/bin/env bash
# exit on error
set -o errexit

# Exibir versões
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Limpar cache e instalações anteriores
echo "Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache

# Instalar dependências
echo "Instalando dependências..."
npm install

# Gerar Prisma Client
echo "Gerando Prisma Client..."
npx prisma generate

# Build do Next.js
echo "Iniciando build..."
npm run build

echo "Build completo!"
