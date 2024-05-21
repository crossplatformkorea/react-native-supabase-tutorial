import styled from '@emotion/native';
import {Button, Typography} from 'dooboo-ui';
import {Stack} from 'expo-router';

import {t} from '../src/STRINGS';
import {supabase} from '../supabase';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.bg.basic};
`;

const Content = styled.View`
  padding: 16px;
`;

export default function Details(): JSX.Element {
  return (
    <Container>
      <Stack.Screen
        options={{
          title: t('DETAILS'),
        }}
      />
      <Content>
        <Typography.Body1>{t('DETAILS')}</Typography.Body1>
        <Button
          onPress={async () => {
            try {
              const {error} = await supabase
                .from('todos')
                .insert({id: 1, todo: 'Buy Milk'});

              console.log('error', error);
            } catch (err) {
              console.error(err);
            }
          }}
          text="Create todo"
        />
      </Content>
    </Container>
  );
}
