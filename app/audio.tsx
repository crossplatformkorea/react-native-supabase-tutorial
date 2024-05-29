import {useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {css} from '@emotion/native';
import {IconButton, Typography} from 'dooboo-ui';
import {Audio} from 'expo-av';
import * as FileSystem from 'expo-file-system';

import {uploadFileToSupabase} from '../supabase';

export default function AudioPage(): JSX.Element {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = useState<Audio.Recording>();
  const [uri, setUri] = useState<string>();
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const width = useSharedValue(0);

  console.log('rerender');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
    };
  }, []);

  const _playBack: Audio.Sound['_onPlaybackStatusUpdate'] = (status) => {
    if (status.isLoaded) {
      width.value =
        (status.positionMillis / (status?.durationMillis || 0)) * 100;

      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const startRecording = async (): Promise<void> => {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');

      const {recording: recorded} = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(recorded);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async (): Promise<void> => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({allowsRecordingIOS: false});

    const recordingUri = recording?.getURI();
    recordingUri && setUri(recordingUri);
  };

  const playSound = async (): Promise<void> => {
    if (isPlaying) {
      setIsPlaying(false);
      sound?.stopAsync();

      return;
    }

    if (uri) {
      setIsPlaying(true);

      const {sound: audioSound} = await Audio.Sound.createAsync(
        {uri},
        {},
        _playBack,
      );
      setSound(audioSound);

      console.log('Playing Sound');
      await audioSound.playAsync();
    }
  };

  const uploadFile = async (): Promise<void> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri!, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const path = await uploadFileToSupabase({
        base64: base64,
        bucket: 'audios',
        destPath: 'audio.m4a',
      });

      console.log('Uploaded to', path);
    } catch (err) {
      console.error('Failed to upload file', err);
    }
  };

  return (
    <SafeAreaView
      style={css`
        flex: 1;
        justify-content: center;
        align-items: center;
        gap: 12px;
      `}
    >
      <Typography.Heading3>Record</Typography.Heading3>
      <IconButton
        icon={recording ? 'Stop' : 'Microphone'}
        onPress={recording ? stopRecording : startRecording}
        size={40}
      />
      <Typography.Heading3>Play</Typography.Heading3>
      <IconButton
        icon={isPlaying ? 'Stop' : uri ? 'Play' : 'Question'}
        onPress={uri ? playSound : undefined}
        size={40}
      />
      {/* Playing Bar */}
      <View
        style={css`
          flex-direction: row;
          padding: 12px;
        `}
      >
        <View
          style={css`
            flex: 1;
            background-color: black;
            height: 12px;

            flex-direction: row;
          `}
        >
          <Animated.View
            style={[
              css`
                background-color: white;
                height: 12px;
              `,
              animatedStyle,
            ]}
          />
        </View>
      </View>
      <Typography.Heading3>Upload</Typography.Heading3>
      {uri ? <IconButton icon="Upload" onPress={uploadFile} size={40} /> : null}
      <View
        style={css`
          height: 80px;
        `}
      />
    </SafeAreaView>
  );
}
