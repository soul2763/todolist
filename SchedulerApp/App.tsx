/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { ScheduleProvider } from './src/context/ScheduleContext';
import AppNavigator from './src/navigation/AppNavigator';

// AlarmService 가져오기
let AlarmService: any = null;
try {
  AlarmService = require('./src/services/AlarmService').default;
} catch (error) {
  console.error('AlarmService 로드 실패:', error);
}

const App = () => {
  useEffect(() => {
    // 앱 시작 시 알람 서비스 초기화
    if (AlarmService) {
      console.log('🔔 앱 시작: 알람 서비스 초기화');
      // 기존 알람 정보 확인
      AlarmService.checkScheduledAlarms();
    }
  }, []);

  return (
    <PaperProvider>
      <ScheduleProvider>
        <AppNavigator />
      </ScheduleProvider>
    </PaperProvider>
  );
};

export default App;
