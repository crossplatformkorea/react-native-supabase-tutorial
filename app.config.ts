import 'dotenv/config';

import type {ConfigContext, ExpoConfig} from '@expo/config';
import withAndroidLocalizedName from '@mmomtchev/expo-android-localized-app-name';
import dotenv from 'dotenv';
import {expand} from 'dotenv-expand';
import path from 'path';

import {version} from './package.json';

// https://github.com/expo/expo/issues/23727#issuecomment-1651609858
if (process.env.STAGE) {
  expand(
    dotenv.config({
      path: path.join(
        __dirname,
        ['./.env', process.env.STAGE].filter(Boolean).join('.'),
      ),
      override: true,
    }),
  );
}

const DEEP_LINK_URL = '[firebaseAppId].web.app';

const buildNumber = 1;

export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Supabase Tutorial',
  scheme: 'supabase_tutorial',
  slug: 'supabase-tutorial',
  privacy: 'public',
  platforms: ['ios', 'android', 'web'],
  version,
  orientation: 'default',
  icon: './assets/icon.png',
  plugins: [
    '@react-native-google-signin/google-signin',
    [
      'expo-build-properties',
      {
        ios: {newArchEnabled: true},
        android: {newArchEnabled: true},
      },
    ],
    // @ts-ignore
    withAndroidLocalizedName,
    'expo-router',
    'expo-tracking-transparency',
    'expo-localization',
    [
      'expo-font',
      {
        fonts: [
          'node_modules/dooboo-ui/uis/Icon/doobooui.ttf',
          'node_modules/dooboo-ui/uis/Icon/Pretendard-Bold.otf',
          'node_modules/dooboo-ui/uis/Icon/Pretendard-Regular.otf',
          'node_modules/dooboo-ui/uis/Icon/Pretendard-Thin.otf',
        ],
      },
    ],
    [
      'expo-av',
      {
        microphonePermission:
          '$(PRODUCT_NAME)은(는) 음성 녹음 및 오디오 입력 기능을 제공하기 위해 마이크 접근 권한이 필요합니다. 이러한 기능을 계속 사용하려면 마이크 접근을 허용해 주세요.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1B1B1B',
  },
  extra: {
    supabaseUrl: process.env.supabaseUrl,
    supabaseAnonKey: process.env.supabaseAnonKey,
    googleClientIdAndroid: process.env.googleClientIdAndroid,
    googleClientIdIOS: process.env.googleClientIdIOS,
    googleClientIdWeb: process.env.googleClientIdWeb,
    eas: {projectId: '1f68ead4-c229-48b4-9193-f4a4b2cd8c2f'},
  },
  updates: {
    fallbackToCacheTimeout: 0,
    // requestHeaders: {'expo-channel-name': 'production'},
    // url: '',
  },
  assetBundlePatterns: ['**/*'],
  userInterfaceStyle: 'automatic',
  ios: {
    googleServicesFile: './GoogleService-Info.plist',
    buildNumber: buildNumber.toString(),
    bundleIdentifier: 'io.supabasetutorial',
    associatedDomains: [`applinks:${DEEP_LINK_URL}`],
    supportsTablet: true,
    entitlements: {
      'com.apple.developer.applesignin': ['Default'],
    },
    infoPlist: {
      CFBundleAllowMixedLocalizations: true,
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            'com.googleusercontent.apps.3787908749-2qdl7esl5h52d0uhhaul8fsbso5o4sp8',
          ],
        },
      ],
    },
  },
  android: {
    userInterfaceStyle: 'automatic',
    permissions: [
      'RECEIVE_BOOT_COMPLETED',
      'CAMERA',
      'CAMERA_ROLL',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'NOTIFICATIONS',
      'USER_FACING_NOTIFICATIONS',
    ],
    adaptiveIcon: {
      foregroundImage: './assets/adaptive_icon.png',
      backgroundColor: '#2F2F2F',
    },
    googleServicesFile: './google-services.json',
    package: 'io.supabasetutorial',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: {
          scheme: 'https',
          host: DEEP_LINK_URL,
          pathPrefix: '/',
        },
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  description: 'Starter project from dooboo-cli.',
  web: {bundler: 'metro', favicon: './assets/favicon.png'},
});
