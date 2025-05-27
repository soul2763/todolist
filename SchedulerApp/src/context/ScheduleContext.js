import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [categories, setCategories] = useState([
    { id: '1', name: '업무', color: '#FF5722' },
    { id: '2', name: '개인', color: '#2196F3' },
    { id: '3', name: '가족', color: '#4CAF50' },
    { id: '4', name: '기타', color: '#9C27B0' },
  ]);

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
      };
      const updatedSchedules = [...schedules, newSchedule];
      await AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedules));
      setSchedules(updatedSchedules);
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
    const dateStr = format(new Date(date), 'yyyy-MM-dd');
    return schedules.filter(schedule => 
      format(new Date(schedule.startTime), 'yyyy-MM-dd') === dateStr
    );
  };

  // 카테고리별 일정 조회
  const getSchedulesByCategory = (categoryId) => {
    return schedules.filter(schedule => schedule.categoryId === categoryId);
  };

  return (
    <ScheduleContext.Provider value={{
      schedules,
      categories,
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