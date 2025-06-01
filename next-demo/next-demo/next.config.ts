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
            // ONA_WIDGETS: 'ONA_WIDGETS@https://mbdev.alfabank.ru/ona-widgets/assets/remoteEntry.js',
            [process.env.SCOPE as string]: `${process.env.SCOPE}@${process.env.REMOTE_ADDRESS}`,
          },
          exposes: {},
          // shared: {
          //   react: {
          //     // singleton: true,
          //     // requiredVersion: false,
          //     // eager: true,
          //   },
          //   'react-dom': {
          //     // singleton: true,
          //     // requiredVersion: false,
          //     // eager: true,
          //   },
          // },
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
