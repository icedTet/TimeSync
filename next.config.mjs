/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
      },
    };

    // config.module.rules.push({
    //   test: /\.worker\.js$/,
    //   use: { loader: 'worker-loader' },
    // })
    // config.plugins.push(new NodePolyfillPlugin())
    // config.plugins.push(new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    // })) //TODO: Uncomment to enable bundle analyzer
    // Important: return the modified config
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
