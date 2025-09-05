import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FAB, Portal, SegmentedButtons, Button, Dialog, Card, Chip, IconButton } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSchedule } from '../context/ScheduleContext';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddScheduleDialog from '../components/ScheduleDialog';
import ScheduleDetailDialog from '../components/ScheduleDetailDialog';
import AlarmPermissionDialog from '../components/AlarmPermissionDialog';
import { HomeScreenStyles } from '../styles/HomeScreenStyles';
import { Schedule, Category, PriorityOptions, RepeatOptions, ViewMode } from '../types';

// AlarmService 가져오기
let AlarmService: any = null;
try {
  AlarmService = require('../services/AlarmService').default;
} catch (error) {
  console.error('AlarmService 로드 실패:', error);
}

type NavigationProps = {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
};

type Props = NavigationProps;

// 인라인 스타일 정의 (HomeScreenStyles에 없는 스타일들)
const inlineStyles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scheduleCount: {
    fontSize: 14,
    color: '#64748B',
  },
  scheduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5282',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
  },
  viewModeContainer: {
    padding: 12,
    paddingBottom: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  // 향상된 일정 리스트 스타일
  enhancedScheduleItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  enhancedCompletedScheduleItem: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E2E8F0',
    opacity: 0.8,
  },
  enhancedScheduleContent: {
    flexDirection: 'row',
    minHeight: 60,
  },
  categoryColorBar: {
    width: 3,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  completedCategoryColorBar: {
    backgroundColor: '#94A3B8',
  },
  enhancedMainContent: {
    flex: 1,
    padding: 12,
    paddingLeft: 10,
  },
  enhancedTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  enhancedScheduleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
    flex: 1,
    lineHeight: 18,
    marginRight: 8,
  },
  enhancedCompletedText: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  enhancedPriorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  enhancedPriorityText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '600',
  },
  enhancedBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  enhancedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeIcon: {
    marginRight: 6,
  },
  enhancedScheduleTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  enhancedCompleteButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  enhancedCompletedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
  },
  enhancedEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  enhancedEmptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  enhancedEmptySubText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { saveSchedule, getSchedulesByDate, categories, updateSchedule, deleteSchedule, deleteRecurringScheduleGroup, priorityOptions, repeatOptions, schedules } = useSchedule();
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    try {
      const now = new Date();
      if (isNaN(now.getTime())) {
        // 유효하지 않은 날짜인 경우 현재 시간으로 재설정
        return format(new Date(Date.now()), 'yyyy-MM-dd');
      }
      return format(now, 'yyyy-MM-dd');
    } catch (error) {
      console.error('날짜 초기화 오류:', error);
      // 에러 발생 시 현재 시간으로 설정
      return format(new Date(Date.now()), 'yyyy-MM-dd');
    }
  });
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [scheduleDetailDialogVisible, setScheduleDetailDialogVisible] = useState(false);
  const [selectedScheduleForDetail, setSelectedScheduleForDetail] = useState<Schedule | null>(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [editScheduleData, setEditScheduleData] = useState<Schedule | null>(null);
  const [showAlarmPermissionDialog, setShowAlarmPermissionDialog] = useState(false);

  const insets = useSafeAreaInsets();

  const showDialog = (selectedDateForDialog: string | null = null) => {
    // 디버깅 모드에서는 권한 요청 없이 바로 다이얼로그 표시
    if (__DEV__) {
      setIsDialogVisible(true);
    } else if (AlarmService) {
      // 릴리즈 모드에서만 권한 요청
      setShowAlarmPermissionDialog(true);
    } else {
      setIsDialogVisible(true);
    }
    
    // 선택된 날짜를 다이얼로그에 전달하기 위해 상태 업데이트
    if (selectedDateForDialog) {
      setSelectedDate(selectedDateForDialog);
    } else {
      // selectedDateForDialog가 null이면 현재 선택된 날짜를 유지
      // 만약 selectedDate가 유효하지 않으면 현재 날짜로 설정
      if (!selectedDate || typeof selectedDate !== 'string') {
        const now = new Date();
        setSelectedDate(format(now, 'yyyy-MM-dd'));
      }
    }
  };

  const hideDialog = () => {
    setIsDialogVisible(false);
  };

  const showAddDialog = (scheduleToEdit?: Schedule | null) => {
    if (scheduleToEdit) {
      setEditScheduleData(scheduleToEdit);
    }
    setIsAddDialogVisible(true);
  };

  const hideAddDialog = () => {
    setIsAddDialogVisible(false);
    setEditScheduleData(null);
  };

  const handleEditSchedule = async (schedule: Schedule) => {
    try {
      const { id, ...updatedData } = schedule;
      await updateSchedule(id, updatedData);
      hideAddDialog();
    } catch (error) {
      console.error('일정 수정 실패:', error);
    }
  };

  const handleAddSchedule = async (newSchedule: Schedule) => {
    try {
      await saveSchedule(newSchedule);
      hideDialog(); // 다이얼로그 닫기
      // 일정이 추가되면 현재 화면에서 일정 목록이 자동으로 업데이트됩니다
    } catch (error) {
      console.error('일정 추가 실패:', error);
    }
  };

  const handleToggleComplete = async (scheduleId: string, isCompleted: boolean) => {
    try {
      await updateSchedule(scheduleId, { isCompleted });
    } catch (error) {
      console.error('일정 완료 상태 변경 실패:', error);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string, deleteAllRecurring: boolean = false) => {
    try {
      await deleteSchedule(scheduleId, deleteAllRecurring);
      setScheduleDetailDialogVisible(false);
    } catch (error) {
      console.error('일정 삭제 실패:', error);
    }
  };


  // 선택된 날짜의 일정 목록 (기간 일정 포함)
  const schedulesForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];

    // 선택된 날짜의 시작과 끝 시간을 로컬 시간으로 설정
    const startDate = new Date(selectedDate + 'T00:00:00.000');
    let endDate = new Date(selectedDate + 'T23:59:59.999');

    if (viewMode === 'weekly') {
      // 주의 시작일(일요일)과 종료일(토요일) 계산
      const day = startDate.getDay();
      startDate.setDate(startDate.getDate() - day);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (viewMode === 'monthly') {
      // 월의 시작일과 종료일 계산
      startDate.setDate(1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    // schedules를 직접 필터링
    const filteredSchedules = schedules.filter((schedule: Schedule) => {
      try {
        const scheduleStart = parseISO(schedule.startTime);
        const scheduleEnd = parseISO(schedule.endTime);
        
        // 일정이 선택된 기간과 겹치는지 확인
        return (
          (scheduleStart <= endDate && scheduleEnd >= startDate) || // 일정이 선택된 기간과 겹치는 경우
          (scheduleStart >= startDate && scheduleStart <= endDate) || // 일정이 선택된 기간에 시작하는 경우
          (scheduleEnd >= startDate && scheduleEnd <= endDate) // 일정이 선택된 기간에 종료하는 경우
        );
      } catch (error) {
        console.error('일정 날짜 파싱 실패:', error, schedule);
        return false;
      }
    });

    return filteredSchedules.sort((a: Schedule, b: Schedule) => {
      // 완료된 일정은 아래로 정렬
      const aCompleted = a.isCompleted || false;
      const bCompleted = b.isCompleted || false;
      
      // 완료 상태가 다른 경우, 완료되지 않은 일정을 위로
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      
      // 완료 상태가 같은 경우, 시작 시간으로 정렬
      const aStart = parseISO(a.startTime);
      const bStart = parseISO(b.startTime);
      return aStart.getTime() - bStart.getTime();
    });
  }, [selectedDate, viewMode, schedules]);

  const getDateRangeText = () => {
    if (!selectedDate) return '';

    const startDate = new Date(selectedDate);
    let endDate = new Date(selectedDate);

    if (viewMode === 'weekly') {
      const day = startDate.getDay();
      startDate.setDate(startDate.getDate() - day);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      return `${format(startDate, 'MM월 dd일')} ~ ${format(endDate, 'MM월 dd일')}`;
    } else if (viewMode === 'monthly') {
      startDate.setDate(1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      return `${format(startDate, 'yyyy년 MM월')}`;
    } else {
      return format(startDate, 'yyyy년 MM월 dd일');
    }
  };

  const getMarkedDates = () => {
    const markedDates: Record<string, any> = {};
    const today = format(new Date(), 'yyyy-MM-dd');

    // 주말 색상 표시 (현재 월의 모든 주말) - 먼저 설정
    const currentDate = new Date(selectedDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const dateString = format(date, 'yyyy-MM-dd');
      
      // 주말인 경우 (일요일: 0, 토요일: 6)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        markedDates[dateString] = {
          textColor: '#E53E3E', // 주말은 빨간색
          color: '#E53E3E', // 추가 색상 속성
          // 주말 스타일 추가
          style: {
            backgroundColor: 'transparent',
          },
        };
      }
    }

    // 오늘 날짜 표시
    if (markedDates[today]) {
      // 이미 주말로 설정된 경우 기존 속성 유지하면서 추가
      markedDates[today] = {
        ...markedDates[today],
        selected: true,
        selectedColor: '#2C5282',
        today: true,
      };
    } else {
      markedDates[today] = {
        selected: true,
        selectedColor: '#2C5282',
        today: true,
      };
    }

    // 선택된 날짜 표시
    if (selectedDate && selectedDate !== today) {
      if (markedDates[selectedDate]) {
        // 이미 주말로 설정된 경우 기존 속성 유지하면서 추가
        markedDates[selectedDate] = {
          ...markedDates[selectedDate],
          selected: true,
          selectedColor: '#A5D8FF',
        };
      } else {
        markedDates[selectedDate] = {
          selected: true,
          selectedColor: '#A5D8FF',
        };
      }
    }

    // 일정이 있는 날짜 표시 (전체 일정에서)
    schedules.forEach((schedule: Schedule) => {
      try {
        const scheduleDate = format(parseISO(schedule.startTime), 'yyyy-MM-dd');
        const category = categories.find((c: Category) => c.id === schedule.categoryId);
        
        if (markedDates[scheduleDate]) {
          // 이미 표시된 날짜인 경우 점 추가
          if (!markedDates[scheduleDate].dots) {
            markedDates[scheduleDate].dots = [];
          }
          markedDates[scheduleDate].dots.push({
            key: schedule.id,
            color: category?.color || '#A5D8FF',
          });
        } else {
          markedDates[scheduleDate] = {
            dots: [{
              key: schedule.id,
              color: category?.color || '#A5D8FF',
            }],
          };
        }
      } catch (error) {
        console.error('일정 날짜 파싱 실패:', error, schedule);
      }
    });

    return markedDates;
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleDayLongPress = (day: any) => {
    showDialog(day.dateString);
  };

  // 주말 색상을 위한 커스텀 테마
  const calendarTheme = {
    selectedDayBackgroundColor: '#2C5282',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#2C5282',
    dayTextColor: '#2d3748',
    textDisabledColor: '#d9d9d9',
    arrowColor: '#2C5282',
    monthTextColor: '#2d3748',
    indicatorColor: '#2C5282',
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontWeight: '300' as const,
    textMonthFontWeight: 'bold' as const,
    textDayHeaderFontWeight: '300' as const,
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 13,
    // 주말 색상 설정
    'stylesheet.calendar.header': {
      dayHeader: {
        fontWeight: '600',
        color: '#2d3748',
      },
    },
    'stylesheet.day.basic': {
      base: {
        width: 32,
        height: 32,
        alignItems: 'center',
      },
      text: {
        marginTop: 4,
        fontSize: 16,
        fontWeight: '300',
        color: '#2d3748',
        backgroundColor: 'transparent',
      },
    },
  };

  return (
    <SafeAreaView style={HomeScreenStyles.container}>
      <ScrollView style={inlineStyles.content} showsVerticalScrollIndicator={false}>
        <View style={HomeScreenStyles.calendarContainer}>
          <Calendar
            current={selectedDate}
            onDayPress={handleDayPress}
            onDayLongPress={handleDayLongPress}
            markedDates={getMarkedDates()}
            theme={calendarTheme}
                         // 주말 색상 설정을 위한 추가 속성
             dayComponent={({ date, state, marking }) => {
               if (!date) return null;
               
               const dayOfWeek = new Date(date.timestamp).getDay();
               const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
               const dateString = format(new Date(date.timestamp), 'yyyy-MM-dd');
               const isSelected = selectedDate === dateString;
               const isToday = format(new Date(), 'yyyy-MM-dd') === dateString;
               
               // 현재 표시된 월의 날짜인지 확인
               const currentMonth = new Date(selectedDate).getMonth();
               const currentYear = new Date(selectedDate).getFullYear();
               const dateMonth = new Date(date.timestamp).getMonth();
               const dateYear = new Date(date.timestamp).getFullYear();
               const isCurrentMonth = currentMonth === dateMonth && currentYear === dateYear;
               
               return (
                 <TouchableOpacity 
                   style={{
                     width: 32,
                     height: 32,
                     alignItems: 'center',
                     justifyContent: 'center',
                     borderRadius: 16,
                     backgroundColor: isSelected ? '#A5D8FF' : 'transparent',
                     borderWidth: isToday ? 2 : 0,
                     borderColor: isToday ? '#2C5282' : 'transparent',
                     opacity: isCurrentMonth ? 1 : 0.3, // 현재 월이 아닌 날짜는 흐릿하게
                   }}
                   onPress={() => handleDayPress({ dateString: dateString })}
                   onLongPress={() => handleDayLongPress({ dateString: dateString })}
                   activeOpacity={0.7}
                 >
                   <Text style={{
                     fontSize: 16,
                     fontWeight: isSelected ? '600' : '300',
                     color: isSelected 
                       ? '#2C5282' 
                       : isWeekend 
                         ? '#E53E3E' 
                         : '#2d3748',
                     textDecorationLine: state === 'disabled' ? 'line-through' : 'none',
                   }}>
                     {date.day}
                   </Text>
                   {marking?.dots && isCurrentMonth && (
                     <View style={{
                       position: 'absolute',
                       bottom: 2,
                       flexDirection: 'row',
                       justifyContent: 'center',
                     }}>
                       {marking.dots.slice(0, 3).map((dot: any, index: number) => (
                         <View
                           key={index}
                           style={{
                             width: 4,
                             height: 4,
                             borderRadius: 2,
                             backgroundColor: dot.color,
                             marginHorizontal: 1,
                           }}
                         />
                       ))}
                     </View>
                   )}
                 </TouchableOpacity>
               );
             }}
          />
        </View>

        <View style={HomeScreenStyles.scheduleContainer}>
          <View style={inlineStyles.viewModeContainer}>
            <SegmentedButtons
              value={viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
              buttons={[
                { value: 'daily', label: '일간' },
                { value: 'weekly', label: '주간' },
                { value: 'monthly', label: '월간' },
              ]}
              style={HomeScreenStyles.segmentedButtons}
            />
          </View>

          <View style={inlineStyles.scheduleHeader}>
            <View style={inlineStyles.scheduleHeaderLeft}>
              <Text style={HomeScreenStyles.scheduleTitle}>
                {getDateRangeText()}
              </Text>
              <Text style={inlineStyles.scheduleCount}>
                {schedulesForSelectedDate.length}개의 일정
              </Text>
            </View>
          </View>

          <View style={[HomeScreenStyles.scheduleList, { maxHeight: 400 }]}>
            <ScrollView 
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 16 }}
              nestedScrollEnabled={true}
            >
              {schedulesForSelectedDate.length > 0 ? (
                (() => {
                  return schedulesForSelectedDate.map((schedule: Schedule) => {
                    const isCompleted = schedule.isCompleted || false;
                    const category = categories.find((c: Category) => c.id === schedule.categoryId);
                    const priority = schedule.priority || 'LOW';
                    const priorityOption = priorityOptions[priority];

                    return (
                      <TouchableOpacity
                        key={schedule.id}
                        style={[
                          inlineStyles.enhancedScheduleItem,
                          isCompleted && inlineStyles.enhancedCompletedScheduleItem,
                        ]}
                        onPress={() => {
                          setSelectedScheduleForDetail(schedule);
                          setScheduleDetailDialogVisible(true);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={inlineStyles.enhancedScheduleContent}>
                          {/* 카테고리 컬러 바 */}
                          <View 
                            style={[
                              inlineStyles.categoryColorBar,
                              { backgroundColor: category?.color || '#A5D8FF' },
                              isCompleted && inlineStyles.completedCategoryColorBar
                            ]} 
                          />
                          
                          {/* 메인 컨텐츠 */}
                          <View style={inlineStyles.enhancedMainContent}>
                            {/* 상단: 제목과 우선순위 */}
                            <View style={inlineStyles.enhancedTitleRow}>
                              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                {schedule.isRecurring && (
                                  <Icon 
                                    name="repeat" 
                                    size={14} 
                                    color="#2C5282" 
                                    style={{ marginRight: 6 }}
                                  />
                                )}
                                <Text
                                  style={[
                                    inlineStyles.enhancedScheduleTitle,
                                    isCompleted && inlineStyles.enhancedCompletedText,
                                    { flex: 1 }
                                  ]}
                                  numberOfLines={2}
                                >
                                  {schedule.title}
                                </Text>
                              </View>
                              {priority !== 'LOW' && (
                                <View style={inlineStyles.enhancedPriorityBadge}>
                                  {priorityOption?.icon && React.createElement(priorityOption.icon, {
                                    size: 14,
                                    color: priorityOption.color,
                                  })}
                                  <Text style={inlineStyles.enhancedPriorityText}>
                                    {priorityOption?.label}
                                  </Text>
                                </View>
                              )}
                            </View>

                            {/* 하단: 시간과 완료 버튼 */}
                            <View style={inlineStyles.enhancedBottomRow}>
                              <View style={inlineStyles.enhancedTimeContainer}>
                                <Icon 
                                  name="clock-outline" 
                                  size={14} 
                                  color={isCompleted ? "#94A3B8" : "#64748B"} 
                                  style={inlineStyles.timeIcon}
                                />
                                <Text
                                  style={[
                                    inlineStyles.enhancedScheduleTime,
                                    isCompleted && inlineStyles.enhancedCompletedText,
                                  ]}
                                >
                                  {(() => {
                                    try {
                                      const startDate = parseISO(schedule.startTime);
                                      const endDate = parseISO(schedule.endTime);
                                      const isSameDay =
                                        startDate.getFullYear() === endDate.getFullYear() &&
                                        startDate.getMonth() === endDate.getMonth() &&
                                        startDate.getDate() === endDate.getDate();
                                      
                                      if (isSameDay) {
                                        // 같은 날짜인 경우: "오늘 14:30 ~ 16:00" 또는 "12월 15일 14:30 ~ 16:00"
                                        const today = new Date();
                                        const isToday = 
                                          startDate.getFullYear() === today.getFullYear() &&
                                          startDate.getMonth() === today.getMonth() &&
                                          startDate.getDate() === today.getDate();
                                        
                                        if (isToday) {
                                          return `오늘 ${format(startDate, 'HH:mm')} ~ ${format(endDate, 'HH:mm')}`;
                                        } else {
                                          return `${format(startDate, 'M월 d일')} ${format(startDate, 'HH:mm')} ~ ${format(endDate, 'HH:mm')}`;
                                        }
                                      } else {
                                        // 다른 날짜인 경우: "12월 15일 14:30 ~ 12월 16일 16:00"
                                        return `${format(startDate, 'M월 d일 HH:mm')} ~ ${format(endDate, 'M월 d일 HH:mm')}`;
                                      }
                                    } catch (error) {
                                      return '시간 정보를 불러올 수 없습니다';
                                    }
                                  })()}
                                </Text>
                              </View>
                              
                              {/* 완료 버튼 */}
                              <TouchableOpacity
                                onPress={() => handleToggleComplete(schedule.id || '', !isCompleted)}
                                style={inlineStyles.enhancedCompleteButton}
                                activeOpacity={0.7}
                              >
                                <Icon 
                                  name={isCompleted ? "check-circle" : "check-circle-outline"} 
                                  size={20} 
                                  color={isCompleted ? "#81C784" : "#2C5282"} 
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  });
                })()
              ) : (
                <View style={inlineStyles.enhancedEmptyContainer}>
                  <Icon name="calendar-blank" size={48} color="#CBD5E0" style={inlineStyles.emptyIcon} />
                  <Text style={inlineStyles.enhancedEmptyText}>
                    {viewMode === 'daily' && selectedDate === format(new Date(), 'yyyy-MM-dd')
                      ? '오늘의 일정이 없습니다.'
                      : viewMode === 'weekly'
                      ? '이번 주 일정이 없습니다.'
                      : viewMode === 'monthly'
                      ? '이번 달 일정이 없습니다.'
                      : '선택한 기간의 일정이 없습니다.'}
                  </Text>
                  <Text style={inlineStyles.enhancedEmptySubText}>
                    + 버튼을 눌러 새로운 일정을 추가해보세요!
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <AddScheduleDialog
          visible={isDialogVisible}
          onDismiss={hideDialog}
          onAddSchedule={handleAddSchedule}
          categories={categories}
          priorityOptions={priorityOptions}
          repeatOptions={repeatOptions}
          selectedDate={selectedDate}
        />
        
        {/* 일정 추가 다이얼로그 (수정 버튼에서 호출) */}
        <AddScheduleDialog
          visible={isAddDialogVisible}
          onDismiss={hideAddDialog}
          onAddSchedule={handleAddSchedule}
          onEditSchedule={handleEditSchedule}
          categories={categories}
          priorityOptions={priorityOptions}
          repeatOptions={repeatOptions}
          selectedDate={selectedDate}
          editSchedule={editScheduleData}
          mode={editScheduleData ? 'edit' : 'add'}
        />
        
        {/* 일정 상세 다이얼로그 */}
        <ScheduleDetailDialog
          visible={scheduleDetailDialogVisible}
          onDismiss={() => setScheduleDetailDialogVisible(false)}
          schedule={selectedScheduleForDetail}
          categories={categories}
          priorityOptions={priorityOptions}
          onEdit={(id: string) => {
            setScheduleDetailDialogVisible(false);
            showAddDialog(selectedScheduleForDetail);
          }}
          onComplete={(id: string) => {
            handleToggleComplete(id, true);
            if (selectedScheduleForDetail && selectedScheduleForDetail.id === id) {
              const updated = { ...selectedScheduleForDetail, isCompleted: true };
              setSelectedScheduleForDetail(updated);
            }
          }}
          onDelete={handleDeleteSchedule}
        />
        
        <AlarmPermissionDialog
          visible={showAlarmPermissionDialog}
          onDismiss={() => setShowAlarmPermissionDialog(false)}
          onPermissionGranted={() => {
            setShowAlarmPermissionDialog(false);
            setIsDialogVisible(true);
          }}
        />
      </Portal>

      <FAB
        style={[HomeScreenStyles.addButton, { bottom: insets.bottom + 12 }]}
        onPress={() => showDialog()}
        icon="plus"
        mode="flat"
        size="small"
        color="#fff"
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
