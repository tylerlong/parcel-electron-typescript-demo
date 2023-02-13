import {AfterPackContext, build, CliOptions} from 'electron-builder';
import {notarize} from 'electron-notarize';

const options: CliOptions = {
  x64: true,
  arm64: true,
  publish: 'always',
  mac: ['default'],
  win: ['default'],
  config: {
    appId: 'parcel-electron-typescript-demo.chuntaoliu.com',
    productName: 'Parcel Electron TypeScript Demo',
    copyright: `Copyright © ${new Date().getFullYear()} CHUNTAO LIU`,
    publish: [
      {
        provider: 'github',
        releaseType: 'release',
      },
    ],
    files: ['build'],
    mac: {
      category: 'public.app-category.productivity',
    },
    win: {
      sign: async () => {}, // disable windows sign
      verifyUpdateCodeSignature: false,
    },
    dmg: {
      contents: [
        {
          x: 128,
          y: 160,
        },
        {
          x: 384,
          y: 160,
          type: 'link',
          path: '/Applications',
        },
      ],
    },
    compression: 'maximum',
    afterSign: async (context: AfterPackContext) => {
      if (context.electronPlatformName === 'darwin') {
        await notarize({
          appBundleId: 'parcel-electron-typescript-demo.chuntaoliu.com',
          appPath: `${context.appOutDir}/${context.packager.appInfo.productFilename}.app`,
          appleId: process.env.APPLE_ID!,
          appleIdPassword: process.env.APPLE_ID_PASSWORD!,
        });
      }
    },
  },
};

build(options);
