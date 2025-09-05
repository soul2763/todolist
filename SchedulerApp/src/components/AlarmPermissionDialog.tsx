import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Dialog, Button, Text } from 'react-native-paper';
import { Platform } from 'react-native';

// Notifee를 조건부로 import
let notifee = null;
try {
  notifee = require('@notifee/react-native').default;
} catch (error) {
  console.error('Notifee 로드 실패:', error);
}

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onPermissionGranted: () => void;
};

const AlarmPermissionDialog: React.FC<Props> = ({ 
  visible, 
  onDismiss, 
  onPermissionGranted 
}) => {
  const requestPermission = async () => {
    try {
      if (!notifee) {
        console.log('Notifee가 로드되지 않아 권한 요청을 건너뜁니다.');
        onPermissionGranted();
        onDismiss();
        return;
      }

      // Notifee로 권한 요청
      const authStatus = await notifee.requestPermission();
      console.log('알림 권한 상태:', authStatus);
      
      if (authStatus.authorizationStatus === 1) { // AUTHORIZED = 1
        onPermissionGranted();
        onDismiss();
      } else {
        Alert.alert(
          '알림 권한 필요',
          '알람 기능을 사용하려면 알림 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [
            { text: '취소', style: 'cancel' },
            { text: '설정으로 이동', onPress: () => {
              // 설정 앱으로 이동하는 로직
              onDismiss();
            }}
          ]
        );
      }
    } catch (error) {
      console.error('알림 권한 요청 실패:', error);
      Alert.alert('오류', '알림 권한 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
      <Dialog.Title style={styles.title}>알림 권한 필요</Dialog.Title>
      <Dialog.Content>
        <Text style={styles.message}>
          일정 알람 기능을 사용하려면 알림 권한이 필요합니다.{'\n\n'}
          이 권한을 통해 다음과 같은 기능을 사용할 수 있습니다:{'\n'}
          • 일정 시작 전 알림{'\n'}
          • 반복 일정 알림{'\n'}
          • 백그라운드 알림
        </Text>
      </Dialog.Content>
      <Dialog.Actions style={styles.actions}>
        <Button 
          mode="outlined" 
          onPress={onDismiss}
          style={styles.cancelButton}
          textColor="#718096"
        >
          나중에
        </Button>
        <Button 
          mode="contained" 
          onPress={requestPermission}
          style={styles.confirmButton}
          buttonColor="#2C5282"
        >
          권한 허용
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
  },
  title: {
    color: '#2C5282',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    color: '#4A5568',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  cancelButton: {
    borderColor: '#E2E8F0',
    minWidth: 100,
  },
  confirmButton: {
    minWidth: 100,
  },
});

export default AlarmPermissionDialog;
