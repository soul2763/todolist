import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Notifee를 조건부로 import
let notifee = null;
let TriggerType = null;
try {
  const notifeeModule = require('@notifee/react-native');
  notifee = notifeeModule.default;
  TriggerType = notifeeModule.TriggerType;
} catch (error) {
  console.error('Notifee 로드 실패:', error);
}

class AlarmService {
  constructor() {
    this.initializeNotifications();
  }

  // 알림 초기화
  async initializeNotifications() {
    if (!notifee) {
      console.log('AlarmService: Notifee가 로드되지 않아 알림 기능을 비활성화합니다.');
      return;
    }

    try {
      // 알림 채널 생성 (Android)
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'schedule-alarms',
          name: '일정 알림',
          description: '일정 알림을 위한 채널',
          sound: 'default',
          importance: 4, // HIGH importance
          vibration: true,
          vibrationPattern: [300, 500],
        });
      }

      // iOS 권한 요청
      if (Platform.OS === 'ios') {
        await notifee.requestPermission();
      }

      console.log('AlarmService: 알림 초기화 완료');
    } catch (error) {
      console.error('AlarmService: 알림 초기화 실패:', error);
    }
  }

  // 알람 설정
  async scheduleAlarm(schedule) {
    try {
      if (!notifee) {
        console.log('AlarmService: Notifee가 로드되지 않아 알람을 설정할 수 없습니다.');
        return;
      }

      if (!schedule.alarmEnabled || !schedule.alarmTime) {
        console.log('알람이 비활성화되어 있거나 알람 시간이 없습니다.');
        return;
      }

      const alarmTime = new Date(schedule.alarmTime);
      const now = new Date();

      // 과거 시간인 경우 스킵
      if (alarmTime <= now) {
        console.log('알람 시간이 과거입니다:', schedule.title);
        return;
      }

      const notificationId = `schedule_${schedule.id}`;

      const isDebugMode = __DEV__;
      
      if (isDebugMode) {
        
        await notifee.createTriggerNotification(
          {
            id: notificationId,
            title: '일정 알림',
            body: `${schedule.title} - ${this.formatTime(new Date(schedule.startTime))}`,
            android: {
              channelId: 'schedule-alarms',
              sound: 'default',
              importance: 4, // HIGH importance
              vibrationPattern: [300, 500],
              pressAction: {
                id: 'default',
              },
            },
            ios: {
              sound: 'default',
              critical: true,
            },
            data: {
              scheduleId: schedule.id,
              scheduleTitle: schedule.title,
              scheduleStartTime: schedule.startTime,
            },
          },
          {
            type: TriggerType ? TriggerType.TIMESTAMP : 1,
            timestamp: alarmTime.getTime(),
          }
        );
      } else {
        // 릴리즈 모드에서는 정상적인 스케줄 알림
        await notifee.createTriggerNotification(
          {
            id: notificationId,
            title: '일정 알림',
            body: `${schedule.title} - ${this.formatTime(new Date(schedule.startTime))}`,
            android: {
              channelId: 'schedule-alarms',
              sound: 'default',
              importance: 4, // HIGH importance
              vibrationPattern: [300, 500],
              pressAction: {
                id: 'default',
              },
            },
            ios: {
              sound: 'default',
              critical: true,
            },
            data: {
              scheduleId: schedule.id,
              scheduleTitle: schedule.title,
              scheduleStartTime: schedule.startTime,
            },
          },
          {
            type: TriggerType ? TriggerType.TIMESTAMP : 1,
            timestamp: alarmTime.getTime(),
          }
        );
      }

      // 알람 정보 저장
      await this.saveAlarmInfo(schedule.id, {
        notificationId,
        alarmTime: schedule.alarmTime,
        scheduleTitle: schedule.title,
      });

      console.log(`✅ 알람 설정 완료: ${schedule.title} (${alarmTime.toLocaleString()})`);
    } catch (error) {
      console.error('알람 설정 실패:', error);
    }
  }

  // 알람 취소
  async cancelAlarm(scheduleId) {
    try {
      if (!notifee) {
        console.log('AlarmService: Notifee가 로드되지 않아 알람을 취소할 수 없습니다.');
        return;
      }

      const alarmInfo = await this.getAlarmInfo(scheduleId);
      if (alarmInfo && alarmInfo.notificationId) {
        await notifee.cancelNotification(alarmInfo.notificationId);
        await this.removeAlarmInfo(scheduleId);
        console.log(`❌ 알람 취소 완료: ${scheduleId}`);
      }
    } catch (error) {
      console.error('알람 취소 실패:', error);
    }
  }

  // 알람 정보 저장
  async saveAlarmInfo(scheduleId, alarmInfo) {
    try {
      const allAlarms = await this.getAllAlarmInfo();
      allAlarms[scheduleId] = alarmInfo;
      await AsyncStorage.setItem('alarmInfo', JSON.stringify(allAlarms));
    } catch (error) {
      console.error('알람 정보 저장 실패:', error);
    }
  }

  // 알람 정보 가져오기
  async getAlarmInfo(scheduleId) {
    try {
      const allAlarms = await this.getAllAlarmInfo();
      return allAlarms[scheduleId] || null;
    } catch (error) {
      console.error('알람 정보 가져오기 실패:', error);
      return null;
    }
  }

  // 모든 알람 정보 가져오기
  async getAllAlarmInfo() {
    try {
      const stored = await AsyncStorage.getItem('alarmInfo');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('모든 알람 정보 가져오기 실패:', error);
      return {};
    }
  }

  // 알람 정보 제거
  async removeAlarmInfo(scheduleId) {
    try {
      const allAlarms = await this.getAllAlarmInfo();
      delete allAlarms[scheduleId];
      await AsyncStorage.setItem('alarmInfo', JSON.stringify(allAlarms));
    } catch (error) {
      console.error('알람 정보 제거 실패:', error);
    }
  }

  // 알람 업데이트
  async updateAlarm(schedule) {
    try {
      // 기존 알람 취소
      await this.cancelAlarm(schedule.id);
      
      // 새로운 알람 설정
      if (schedule.alarmEnabled && schedule.alarmTime) {
        await this.scheduleAlarm(schedule);
      }
    } catch (error) {
      console.error('알람 업데이트 실패:', error);
    }
  }

  // 예약된 알람 확인
  async checkScheduledAlarms() {
    try {
      const allAlarms = await this.getAllAlarmInfo();
      console.log('예약된 알람 목록:', allAlarms);
      return allAlarms;
    } catch (error) {
      console.error('예약된 알람 확인 실패:', error);
      return {};
    }
  }


  // 시간 포맷팅 헬퍼 함수
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // 모든 알람 취소 (앱 초기화 시 사용)
  async cancelAllAlarms() {
    try {
      if (!notifee) {
        console.log('AlarmService: Notifee가 로드되지 않아 모든 알람을 취소할 수 없습니다.');
        return;
      }

      await notifee.cancelAllNotifications();
      await AsyncStorage.removeItem('alarmInfo');
      console.log('모든 알람 취소 완료');
    } catch (error) {
      console.error('모든 알람 취소 실패:', error);
    }
  }
}

export default new AlarmService(); 