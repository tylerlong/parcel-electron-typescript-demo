import path from 'path';
import fs from 'fs';
import {
  AfterPackContext,
  CliOptions,
  Metadata,
  build as electronBuild,
} from 'electron-builder';
import {notarize} from 'electron-notarize';
import dotenv from 'dotenv-override-true';

dotenv.config();

const release = async (app: string) => {
  fs.copyFileSync(
    path.join(__dirname, '..', 'common', 'background.png'),
    path.join(__dirname, '..', 'build', 'background.png')
  );
  fs.copyFileSync(
    path.join(__dirname, '..', 'apps', app, 'icon.png'),
    path.join(__dirname, '..', 'build', 'icon.png')
  );
  const metadata: Metadata = (await import(`../apps/${app}/metadata.ts`))
    .default;
  const options: CliOptions = {
    x64: true,
    arm64: true,
    publish: 'always',
    mac: ['default'],
    win: ['default'],
    config: {
      extraMetadata: metadata,
      appId: `${app}.chuntaoliu.com`,
      // productName: 'Parcel Electron TypeScript Demo',
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
            appBundleId: `${app}.chuntaoliu.com`,
            appPath: `${context.appOutDir}/${context.packager.appInfo.productFilename}.app`,
            appleId: process.env.APPLE_ID!,
            appleIdPassword: process.env.APPLE_ID_PASSWORD!,
          });
        }
      },
    },
  };

  await electronBuild(options);
};

export default release;
