import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';

import type {Database} from './src/types/supabase';
import {supabaseAnonKey, supabaseUrl} from './config';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const uploadFileToSupabase = async ({
  file,
  bucket,
  destPath,
}: {
  file: string;
  bucket: string;
  destPath: string;
}): Promise<string> => {
  const {data, error} = await supabase.storage
    .from(bucket)
    .upload(destPath, file, {});

  if (error) {
    throw error;
  }

  return data.path;
};
