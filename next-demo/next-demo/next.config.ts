// next.config.js
const { container } = require('webpack');
const { ModuleFederationPlugin } = container;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint-disable-next-line
  // @ts-ignore
  webpack(config, { isServer }) {
    if (!isServer) {
      console.log('✅ Webpack client config активен');

      config.plugins.push(
        new ModuleFederationPlugin({
          name: 'nextjs_host',
          filename: 'static/chunks/remoteEntry.js',
          remotes: {
            [process.env.SCOPE as string]: `${process.env.NEXT_PUBLIC_SCOPE}@${process.env.NEXT_PUBLIC_REMOTE_ADDRESS}`,
          },
          exposes: {},
          // shared: {
          //   react: {
          //     // singleton: true,
          //     // requiredVersion: false,
          //     eager: false,
          //   },
          //   'react-dom': {
          //     // singleton: true,
          //     // requiredVersion: false,
          //     eager: false,
          //   },
          // },
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
