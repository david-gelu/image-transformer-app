/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    formats: ['image/webp'],
  },
  webpack(config, { dev }) {
    if (dev) {
      config.ignoreWarnings = [
        (warning) =>
          warning.message && /Extra attributes from the server/.test(warning.message),
      ];
    }
    return config;
  },
}

module.exports = nextConfig
