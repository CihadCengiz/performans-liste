/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    API_PATH: process.env.API_PATH,
    JWT_SECRET: process.env.JWT_SECRET,
    MESAJ_DOSYA_YOL: process.env.MESAJ_DOSYA_YOL,
    PROFIL_RESIM_YOL: process.env.PROFIL_RESIM_YOL,
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // These modules are used by Node.js but not by the browser, so exclude them
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        dgram: false,
      };
    }
    return config;
  },
};

export default nextConfig;
