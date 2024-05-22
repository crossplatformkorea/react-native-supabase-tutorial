import styled, {css} from '@emotion/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Button, SwitchToggle, useDooboo} from 'dooboo-ui';
import {Stack, useRouter} from 'expo-router';

import {googleClientIdIOS, googleClientIdWeb} from '../config';
import {t} from '../src/STRINGS';
import {AsyncStorageKey} from '../src/utils/constants';
import {supabase} from '../supabase';

const Container = styled.View`
  background-color: ${({theme}) => theme.bg.basic};

  flex: 1;
  align-self: stretch;
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  padding: 16px;

  justify-content: center;
  align-items: center;
`;

export default function Index(): JSX.Element {
  const {themeType, changeThemeType} = useDooboo();
  const {push} = useRouter();

  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: googleClientIdWeb,
    iosClientId: googleClientIdIOS,
  });

  return (
    <Container>
      <Stack.Screen
        options={{
          title: t('HOME'),
        }}
      />
      <Content>
        <SwitchToggle
          isOn={themeType === 'dark'}
          onPress={() => {
            const nextTheme = themeType === 'dark' ? 'light' : 'dark';
            AsyncStorage.setItem(
              AsyncStorageKey.DarkMode,
              themeType === 'dark' ? 'false' : 'true',
            );
            changeThemeType(nextTheme);
          }}
        />
        <GoogleSigninButton
          color={GoogleSigninButton.Color.Dark}
          onPress={async () => {
            try {
              await GoogleSignin.hasPlayServices();

              const userInfo = await GoogleSignin.signIn();
              if (userInfo.idToken) {
                const {data, error} = await supabase.auth.signInWithIdToken({
                  provider: 'google',
                  token: userInfo.idToken,
                });
                console.log(error, data);
              } else {
                throw new Error('no ID token present!');
              }
            } catch (error: any) {
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
              } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
              } else if (
                error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
              ) {
                // play services not available or outdated
              } else {
                // some other error happened
              }
            }
          }}
          size={GoogleSigninButton.Size.Wide}
        />
        <Button
          onPress={() => push('/details')}
          style={css`
            margin-top: 28px;
            margin-bottom: 40px;
          `}
          styles={{
            text: css`
              font-family: Pretendard-Bold;
            `,
          }}
          text={t('SEE_DETAILS')}
        />
      </Content>
    </Container>
  );
}
