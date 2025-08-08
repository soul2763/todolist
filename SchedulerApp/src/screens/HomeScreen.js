import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FAB, Portal, SegmentedButtons, Button, Dialog, Card, Chip, IconButton } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSchedule } from '../context/ScheduleContext';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddScheduleDialog from '../components/AddScheduleDialog';
import ScheduleDetailDialog from '../components/ScheduleDetailDialog';
import { HomeScreenStyles } from '../styles/HomeScreenStyles';

// AlarmService 가져오기
let AlarmService = null;
try {
  AlarmService = require('../services/AlarmService').default;
} catch (error) {
  console.error('AlarmService 로드 실패:', error);
}

const HomeScreen = ({ navigation }) => {
  const { saveSchedule, getSchedulesByDate, categories, updateSchedule, priorityOptions, repeatOptions } = useSchedule();
  const [selectedDate, setSelectedDate] = useState(() => {
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
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [completedScheduleDialogVisible, setCompletedScheduleDialogVisible] = useState(false);
  const [selectedCompletedSchedule, setSelectedCompletedSchedule] = useState(null);
  const [scheduleDetailDialogVisible, setScheduleDetailDialogVisible] = useState(false);
  const [selectedScheduleForDetail, setSelectedScheduleForDetail] = useState(null);

  const insets = useSafeAreaInsets();



  const showDialog = (selectedDateForDialog = null) => {
    setIsDialogVisible(true);
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

  const handleAddSchedule = async (newSchedule) => {
    try {
      const savedSchedule = await saveSchedule(newSchedule);
      navigation.navigate('ScheduleDetail', { scheduleId: savedSchedule.id });
    } catch (error) {
      console.error('일정 추가 실패:', error);
    }
  };

  const handleToggleComplete = async (scheduleId, isCompleted) => {
    try {
      await updateSchedule(scheduleId, { isCompleted });
    } catch (error) {
      console.error('일정 완료 상태 변경 실패:', error);
    }
  };

  // 선택된 날짜의 일정 목록 (기간 일정 포함)
  const schedulesForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];

    const startDate = new Date(selectedDate);
    let endDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (viewMode === 'weekly') {
      // 주의 시작일(일요일)과 종료일(토요일) 계산
      const day = startDate.getDay();
      startDate.setDate(startDate.getDate() - day);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
    } else if (viewMode === 'monthly') {
      // 월의 시작일과 종료일 계산
      startDate.setDate(1);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    }

    return getSchedulesByDate().filter(schedule => {
      const scheduleStart = parseISO(schedule.startTime);
      const scheduleEnd = parseISO(schedule.endTime);
      
      // 기본 필터링: 선택된 날짜 범위에 포함된 일정
      const isInSelectedRange = (
        (scheduleStart <= endDate && scheduleEnd >= startDate) ||
        (scheduleStart >= startDate && scheduleStart <= endDate) ||
        (scheduleEnd >= startDate && scheduleEnd <= endDate)
      );

      // 일간 뷰에서는 선택된 날짜에 포함된 일정만 보여주기
      if (viewMode === 'daily') {
        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setHours(0, 0, 0, 0);
        
        const scheduleStartDate = new Date(scheduleStart);
        scheduleStartDate.setHours(0, 0, 0, 0);
        const scheduleEndDate = new Date(scheduleEnd);
        scheduleEndDate.setHours(0, 0, 0, 0);
        
        // 선택된 날짜가 일정 기간에 포함되는지 확인
        return scheduleStartDate <= selectedDateObj && scheduleEndDate >= selectedDateObj;
      }

      return isInSelectedRange;
    });
  }, [selectedDate, viewMode, getSchedulesByDate]);

  // 날짜 범위 표시 텍스트
  const getDateRangeText = () => {
    try {
      if (!selectedDate || typeof selectedDate !== 'string') {
        return '날짜 정보 없음';
      }
      
      if (viewMode === 'daily') {
        const date = new Date(selectedDate);
        if (isNaN(date.getTime())) {
          return '날짜 정보 오류';
        }
        return format(date, 'yyyy년 MM월 dd일');
      } else if (viewMode === 'weekly') {
        const start = new Date(selectedDate);
        if (isNaN(start.getTime())) {
          return '날짜 정보 오류';
        }
        const day = start.getDay();
        start.setDate(start.getDate() - day);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `${format(start, 'MM/dd')} - ${format(end, 'MM/dd')}`;
      } else {
        const date = new Date(selectedDate);
        if (isNaN(date.getTime())) {
          return '날짜 정보 오류';
        }
        return format(date, 'yyyy년 MM월');
      }
    } catch (error) {
      console.error('날짜 범위 텍스트 생성 오류:', error);
      return '날짜 정보 오류';
    }
  };

  // 캘린더에 표시할 마커 생성
  const getMarkedDates = () => {
    const marked = {};
    const allSchedules = getSchedulesByDate(); // 모든 일정 가져오기

    // 각 일정의 시작일부터 종료일까지 마커 추가
    allSchedules.forEach(schedule => {
      try {
        if (!schedule.startTime || !schedule.endTime) {
          return;
        }
        
        const start = parseISO(schedule.startTime);
        const end = parseISO(schedule.endTime);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return;
        }
        
        const category = categories.find(c => c.id === schedule.categoryId);

        // 시작일부터 종료일까지 반복
        let currentDate = new Date(start);
        currentDate.setHours(0, 0, 0, 0);
        const endDate = new Date(end);
        endDate.setHours(0, 0, 0, 0);

        while (currentDate <= endDate) {
          try {
            const dateString = format(currentDate, 'yyyy-MM-dd');
            if (marked[dateString]) {
              if (!marked[dateString].dots) {
                marked[dateString].dots = [];
              }
              marked[dateString].dots.push({
                color: category?.color || '#666',
                key: schedule.id
              });
            } else {
              marked[dateString] = {
                dots: [{
                  color: category?.color || '#666',
                  key: schedule.id
                }],
                selected: dateString === selectedDate
              };
            }
          } catch (formatError) {
            console.error('날짜 포맷 오류:', formatError);
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } catch (error) {
        console.error('일정 마커 생성 실패:', error);
      }
    });

    // 선택된 날짜 마커 추가
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#6200ee'
      };
    }

    return marked;
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleDayLongPress = (day) => {
    showDialog(day.dateString);
  };

  return (
    <SafeAreaView style={HomeScreenStyles.container}>
      <View style={HomeScreenStyles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          markingType="multi-dot"
          theme={{
            todayTextColor: '#2C5282',
            selectedDayBackgroundColor: '#A5D8FF',
            selectedDayTextColor: '#2C5282',
            dotColor: '#A5D8FF',
            arrowColor: '#2C5282',
            monthTextColor: '#2C5282',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayHeaderColor: '#666',
            textSectionTitleColor: '#666',
            'stylesheet.calendar.header': {
              dayHeader: {
                fontWeight: 'bold',
                color: '#666',
              },
            },
          }}
          dayComponent={({ date, state, marking, onPress }) => {
            const dayOfWeek = new Date(date.timestamp).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0: 일요일, 6: 토요일
            const isDisabled = state === 'disabled'; // 현재 달이 아닌 날짜
            const hasSchedule = marking?.dots && marking.dots.length > 0; // 일정이 있는 날짜
            
            return (
              <TouchableOpacity
                onPress={() => handleDayPress(date)}
                onLongPress={() => handleDayLongPress(date)}
                style={{
                  width: 32,
                  height: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 16,
                  backgroundColor: marking?.selected ? '#A5D8FF' : 'transparent',
                  position: 'relative',
                }}
              >
                <Text
                  style={{
                    color: isDisabled 
                      ? '#CCCCCC' // 현재 달이 아닌 날짜는 회색
                      : isWeekend 
                        ? '#FF0000' // 주말은 빨간색
                        : '#2C5282', // 평일은 파란색
                    fontWeight: marking?.selected ? 'bold' : 'normal',
                    fontSize: 16,
                    opacity: isDisabled ? 0.5 : 1, // 현재 달이 아닌 날짜는 투명도 적용
                  }}
                >
                  {date.day}
                </Text>
                
                {/* 일정이 있는 날짜 표시 */}
                {hasSchedule && !isDisabled && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: marking.dots[0]?.color || '#666',
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <ScrollView style={HomeScreenStyles.scrollView} contentContainerStyle={HomeScreenStyles.scrollViewContent}>
        <View style={HomeScreenStyles.scheduleContainer}>
          <View style={HomeScreenStyles.viewModeContainer}>
            <SegmentedButtons
              value={viewMode}
              onValueChange={setViewMode}
              buttons={[
                { value: 'daily', label: '일간' },
                { value: 'weekly', label: '주간' },
                { value: 'monthly', label: '월간' },
              ]}
              style={HomeScreenStyles.segmentedButtons}
            />
            <Text style={HomeScreenStyles.dateRangeText}>{getDateRangeText()}</Text>
          </View>

          <View style={HomeScreenStyles.scheduleList}>
            {schedulesForSelectedDate.length > 0 ? (
              // 완료되지 않은 일정과 완료된 일정을 분리하여 정렬
              (() => {
                const incompleteSchedules = schedulesForSelectedDate.filter(schedule => !schedule.isCompleted);
                const completedSchedules = schedulesForSelectedDate.filter(schedule => schedule.isCompleted);
                
                // 완료되지 않은 일정을 시작 시간 순으로 정렬
                incompleteSchedules.sort((a, b) => {
                  try {
                    const aStart = parseISO(a.startTime);
                    const bStart = parseISO(b.startTime);
                    return aStart.getTime() - bStart.getTime();
                  } catch (error) {
                    return 0;
                  }
                });
                
                // 완료된 일정을 시작 시간 순으로 정렬
                completedSchedules.sort((a, b) => {
                  try {
                    const aStart = parseISO(a.startTime);
                    const bStart = parseISO(b.startTime);
                    return aStart.getTime() - bStart.getTime();
                  } catch (error) {
                    return 0;
                  }
                });
                
                // 완료되지 않은 일정 + 완료된 일정 순서로 합치기
                const sortedSchedules = [...incompleteSchedules, ...completedSchedules];
                
                return sortedSchedules.map(schedule => {
                  const category = categories.find(c => c.id === schedule.categoryId);
                  const isCompleted = schedule.isCompleted || false;
                  
                  return (
                    <TouchableOpacity
                      key={schedule.id}
                      style={[
                        HomeScreenStyles.scheduleItem,
                        isCompleted && HomeScreenStyles.completedScheduleItem,
                        { borderLeftColor: category?.color || '#A5D8FF', borderLeftWidth: 4 }
                      ]}
                      onPress={() => {
                        if (isCompleted) {
                          // 완료된 일정은 상세보기만 가능하도록 안내
                          setSelectedCompletedSchedule(schedule);
                          setCompletedScheduleDialogVisible(true);
                        } else {
                          setSelectedScheduleForDetail(schedule);
                          setScheduleDetailDialogVisible(true);
                        }
                      }}
                    >
                      <View style={HomeScreenStyles.scheduleContent}>
                        <View style={HomeScreenStyles.scheduleTitleContainer}>
                          <View style={[
                            HomeScreenStyles.categoryDot, 
                            { backgroundColor: isCompleted ? '#94A3B8' : (category?.color || '#666') }
                          ]} />
                          <View style={HomeScreenStyles.titleAndPriorityContainer}>
                            <Text 
                              style={[
                                HomeScreenStyles.scheduleTitle,
                                isCompleted && { textDecorationLine: 'line-through' }
                              ]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {schedule.title}
                            </Text>
                            {!isCompleted && schedule.priority && schedule.priority !== 'LOW' && (
                              <View style={HomeScreenStyles.inlinePriorityContainer}>
                                <Icon
                                  name={schedule.priority === 'HIGH' ? 'star' : 'star-half-full'}
                                  size={14}
                                  color={priorityOptions[schedule.priority]?.color || '#FFA500'}
                                />
                                <Text style={HomeScreenStyles.inlinePriorityText}>
                                  {priorityOptions[schedule.priority]?.label}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                        <View style={HomeScreenStyles.scheduleRightContent}>
                          <View style={HomeScreenStyles.scheduleMetaContainer}>
                            <Text style={[
                              HomeScreenStyles.scheduleTime,
                              isCompleted && HomeScreenStyles.completedScheduleTime
                            ]}>
                              {(() => {
                                try {
                                  if (!schedule.startTime || !schedule.endTime) {
                                    return '시간 정보 없음';
                                  }
                                  const startDate = parseISO(schedule.startTime);
                                  const endDate = parseISO(schedule.endTime);
                                  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                                    return '시간 정보 오류';
                                  }
                                  return `${format(startDate, 'MM/dd HH:mm')} ~ ${format(endDate, 'MM/dd HH:mm')}`;
                                } catch (error) {
                                  console.error('일정 시간 포맷 오류:', error);
                                  return '시간 정보 오류';
                                }
                              })()}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={HomeScreenStyles.completeButton}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleToggleComplete(schedule.id, !isCompleted);
                            }}
                          >
                            <Icon 
                              name={isCompleted ? "check-circle" : "circle-outline"} 
                              size={22} 
                              color={isCompleted ? "#81C784" : "#CBD5E0"} 
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {isCompleted && <View style={HomeScreenStyles.completedOverlay} />}
                    </TouchableOpacity>
                  );
                });
              })()
            ) : (
              <View style={HomeScreenStyles.emptyContainer}>
                <Text style={HomeScreenStyles.emptyText}>
                  {viewMode === 'daily' && selectedDate === format(new Date(), 'yyyy-MM-dd')
                    ? '오늘의 일정이 없습니다.'
                    : viewMode === 'weekly'
                    ? '이번 주 일정이 없습니다.'
                    : viewMode === 'monthly'
                    ? '이번 달 일정이 없습니다.'
                    : '선택한 기간의 일정이 없습니다.'}
                </Text>
                <Text style={HomeScreenStyles.emptySubText}>
                  + 버튼을 눌러 새로운 일정을 추가해보세요!
                </Text>
              </View>
            )}
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
        
        <ScheduleDetailDialog
          visible={completedScheduleDialogVisible}
          onDismiss={() => setCompletedScheduleDialogVisible(false)}
          schedule={selectedCompletedSchedule}
          categories={categories}
          priorityOptions={priorityOptions}
          onEdit={(id) => {
            setCompletedScheduleDialogVisible(false);
            const s = selectedCompletedSchedule;
            if (s && s.id === id) {
              setSelectedScheduleForDetail(s);
              setScheduleDetailDialogVisible(true);
            }
          }}
          onComplete={() => {}}
        />

        {/* 일정 상세 다이얼로그 */}
        <ScheduleDetailDialog
          visible={scheduleDetailDialogVisible}
          onDismiss={() => setScheduleDetailDialogVisible(false)}
          schedule={selectedScheduleForDetail}
          categories={categories}
          priorityOptions={priorityOptions}
          onEdit={(id) => {
            setScheduleDetailDialogVisible(false);
            navigation.navigate('EditSchedule', { scheduleId: id });
          }}
          onComplete={(id) => {
            handleToggleComplete(id, true);
            if (selectedScheduleForDetail && selectedScheduleForDetail.id === id) {
              const updated = { ...selectedScheduleForDetail, isCompleted: true };
              setSelectedScheduleForDetail(updated);
            }
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