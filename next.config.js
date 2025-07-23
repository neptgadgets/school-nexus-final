/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Remove Supabase environment variables as we're using PostgreSQL
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Ensure API routes are treated as dynamic
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
}

module.exports = nextConfig
