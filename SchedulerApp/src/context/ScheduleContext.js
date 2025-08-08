import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
let AlarmService = null;
try {
  AlarmService = require('../services/AlarmService').default;
} catch (error) {
  console.error('AlarmService 로드 실패:', error);
}

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [categories, setCategories] = useState([
    { id: '1', name: '업무', color: '#FF5722' },
    { id: '2', name: '개인', color: '#2196F3' },
    { id: '3', name: '가족', color: '#4CAF50' },
    { id: '4', name: '기타', color: '#9C27B0' },
  ]);

  // 완료 상태 정의
  const completedStatus = {
    label: '완료',
    color: '#81C784',
    icon: 'check-circle-outline',
  };

  // 상태 옵션 정의
  const statusOptions = {
    PENDING: { label: '예정', color: '#A5D8FF', icon: 'clock-outline' },
    IN_PROGRESS: { label: '진행중', color: '#FFB74D', icon: 'progress-clock' },
    COMPLETED: { label: '완료', color: '#81C784', icon: 'check-circle-outline' },
  };

  // 중요도 옵션 정의
  const priorityOptions = {
    LOW: { label: '낮음', color: '#4CAF50', icon: () => <Icon name="star-outline" size={20} color="#4CAF50" /> },
    MEDIUM: { label: '중간', color: '#FFA500', icon: () => <Icon name="star-half-full" size={20} color="#FFA500" /> },
    HIGH: { label: '높음', color: '#FF0000', icon: () => <Icon name="star" size={20} color="#FF0000" /> },
  };

  // 반복 옵션 정의
  const repeatOptions = {
    NONE: { label: '반복 없음', icon: () => <Icon name="repeat" size={20} color="#2C5282" /> },
    DAILY: { label: '매일', icon: () => <Icon name="calendar-range" size={20} color="#2C5282" /> },
    WEEKLY: { label: '매주', icon: () => <Icon name="calendar-week" size={20} color="#2C5282" /> },
    MONTHLY: { label: '매월', icon: () => <Icon name="calendar-month" size={20} color="#2C5282" /> },
    YEARLY: { label: '매년', icon: () => <Icon name="calendar-year" size={20} color="#2C5282" /> },
  };

  // AsyncStorage에서 데이터 로드
  useEffect(() => {
    loadSchedules();
    loadCategories();
  }, []);



  const loadSchedules = async () => {
    try {
      const storedSchedules = await AsyncStorage.getItem('schedules');
      if (storedSchedules) {
        setSchedules(JSON.parse(storedSchedules));
      }
    } catch (error) {
      console.error('일정 로드 실패:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error('카테고리 로드 실패:', error);
    }
  };

  // 일정 저장
  const saveSchedule = async (schedule) => {
    try {
      const newSchedule = {
        ...schedule,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        isCompleted: schedule.isCompleted || false,
        priority: schedule.priority || 'MEDIUM',
        repeat: schedule.repeat || 'NONE',
        repeatEndDate: schedule.repeatEndDate || null,
        alarmEnabled: schedule.alarmEnabled || false,
        alarmTime: schedule.alarmTime || null,
      };
      const updatedSchedules = [...schedules, newSchedule];
      await AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedules));
      setSchedules(updatedSchedules);
      
      // 알람이 설정된 경우 알람 등록 (임시 비활성화)
      console.log('🔔 일정 저장 시 알람 확인 (비활성화됨):', {
        alarmEnabled: newSchedule.alarmEnabled,
        alarmTime: newSchedule.alarmTime,
        AlarmService: !!AlarmService
      });
      
      // if (newSchedule.alarmEnabled && newSchedule.alarmTime && AlarmService) {
      //   console.log('✅ 알람 등록 시작');
      //   await AlarmService.scheduleAlarm(newSchedule);
      // } else {
      //   console.log('❌ 알람 등록 조건 불충족');
      // }
      
      return newSchedule;
    } catch (error) {
      console.error('일정 저장 실패:', error);
      throw error;
    }
  };

  // 일정 수정
  const updateSchedule = async (id, updatedData) => {
    try {
      const updatedSchedules = schedules.map(schedule =>
        schedule.id === id ? { ...schedule, ...updatedData, updatedAt: new Date().toISOString() } : schedule
      );
      await AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedules));
      setSchedules(updatedSchedules);
      
      // 수정된 일정 찾기
      const updatedSchedule = updatedSchedules.find(schedule => schedule.id === id);
      
      // 알람 관련 업데이트 처리 (임시 비활성화)
      // if (updatedSchedule && AlarmService) {
      //   if (updatedSchedule.alarmEnabled && updatedSchedule.alarmTime) {
      //     // 알람이 켜져있고 시간이 설정된 경우 알람 등록/업데이트
      //     await AlarmService.updateAlarm(updatedSchedule);
      //   } else {
      //     // 알람이 꺼져있거나 시간이 없는 경우 알람 취소
      //     await AlarmService.cancelAlarm(id);
      //   }
      // }
    } catch (error) {
      console.error('일정 수정 실패:', error);
      throw error;
    }
  };

  // 일정 삭제
  const deleteSchedule = async (id) => {
    try {
      const updatedSchedules = schedules.filter(schedule => schedule.id !== id);
      await AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedules));
      setSchedules(updatedSchedules);
      
      // 일정 삭제 시 알람도 함께 취소 (임시 비활성화)
      // if (AlarmService) {
      //   await AlarmService.cancelAlarm(id);
      // }
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      throw error;
    }
  };

  // 일정 검색
  const searchSchedules = (query) => {
    const searchTerm = query.toLowerCase();
    return schedules.filter(schedule =>
      schedule.title.toLowerCase().includes(searchTerm) ||
      schedule.description.toLowerCase().includes(searchTerm)
    );
  };

  // 날짜별 일정 조회
  const getSchedulesByDate = (date) => {
    if (!date) return schedules; // date가 없으면 모든 일정 반환
    
    try {
      // 선택된 날짜의 시작과 끝 시간 설정
      const selectedDateStart = new Date(date + 'T00:00:00.000Z');
      const selectedDateEnd = new Date(date + 'T23:59:59.999Z');

      return schedules.filter(schedule => {
        try {
          const scheduleStart = parseISO(schedule.startTime);
          const scheduleEnd = parseISO(schedule.endTime);

          // 일정이 선택된 날짜와 겹치는지 확인
          return (
            (scheduleStart <= selectedDateEnd && scheduleEnd >= selectedDateStart) || // 일정이 선택된 날짜와 겹치는 경우
            (scheduleStart >= selectedDateStart && scheduleStart <= selectedDateEnd) || // 일정이 선택된 날짜에 시작하는 경우
            (scheduleEnd >= selectedDateStart && scheduleEnd <= selectedDateEnd) // 일정이 선택된 날짜에 종료하는 경우
          );
        } catch (error) {
          console.error('일정 날짜 파싱 실패:', error);
          return false;
        }
      });
    } catch (error) {
      console.error('날짜 파싱 실패:', error);
      return [];
    }
  };

  // 카테고리별 일정 조회
  const getSchedulesByCategory = (categoryId) => {
    return schedules.filter(schedule => schedule.categoryId === categoryId);
  };

  return (
    <ScheduleContext.Provider value={{
      schedules,
      categories,
      completedStatus,
      statusOptions,
      priorityOptions,
      repeatOptions,
      saveSchedule,
      updateSchedule,
      deleteSchedule,
      searchSchedules,
      getSchedulesByDate,
      getSchedulesByCategory,
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}; 