import Constants from 'expo-constants';

const extra = Constants?.expoConfig?.extra;

export const supabaseUrl = extra?.supabaseUrl;
export const supabaseAnonKey = extra?.supabaseAnonKey;
export const googleClientIdAndroid = extra?.googleClientIdAndroid;
export const googleClientIdIOS = extra?.googleClientIdIOS;
export const googleClientIdWeb = extra?.googleClientIdWeb;
