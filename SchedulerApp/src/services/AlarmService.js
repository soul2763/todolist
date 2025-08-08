// import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AlarmService {
  constructor() {
    // this.initializeNotifications();
    console.log('AlarmService: 임시로 비활성화됨');
  }

  // 알림 초기화
  initializeNotifications() {
    console.log('AlarmService: 알림 초기화 비활성화됨');
  }

  // 알람 설정
  async scheduleAlarm(schedule) {
    console.log('AlarmService: 알람 설정 비활성화됨', schedule.title);
    return;
  }

  // 알람 취소
  async cancelAlarm(scheduleId) {
    console.log('AlarmService: 알람 취소 비활성화됨', scheduleId);
    return;
  }

  // 알람 정보 저장
  async saveAlarmInfo(scheduleId, alarmInfo) {
    console.log('AlarmService: 알람 정보 저장 비활성화됨');
    return;
  }

  // 알람 정보 가져오기
  async getAlarmInfo(scheduleId) {
    console.log('AlarmService: 알람 정보 가져오기 비활성화됨');
    return null;
  }

  // 모든 알람 정보 가져오기
  async getAllAlarmInfo() {
    console.log('AlarmService: 모든 알람 정보 가져오기 비활성화됨');
    return {};
  }

  // 알람 정보 제거
  async removeAlarmInfo(scheduleId) {
    console.log('AlarmService: 알람 정보 제거 비활성화됨');
    return;
  }

  // 알람 업데이트
  async updateAlarm(schedule) {
    console.log('AlarmService: 알람 업데이트 비활성화됨');
    return;
  }

  // 예약된 알람 확인
  async checkScheduledAlarms() {
    console.log('AlarmService: 예약된 알람 확인 비활성화됨');
    return;
  }

  // 테스트 알람 설정
  async scheduleTestAlarm() {
    console.log('AlarmService: 테스트 알람 설정 비활성화됨');
    return;
  }
}

export default new AlarmService(); 