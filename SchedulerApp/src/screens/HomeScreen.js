import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FAB, Portal, SegmentedButtons, Button } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSchedule } from '../context/ScheduleContext';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddScheduleDialog from '../components/AddScheduleDialog';

// AlarmService 가져오기
let AlarmService = null;
try {
  AlarmService = require('../services/AlarmService').default;
} catch (error) {
  console.error('AlarmService 로드 실패:', error);
}

const HomeScreen = ({ navigation }) => {
  const { saveSchedule, getSchedulesByDate, categories, updateSchedule } = useSchedule();
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

  const insets = useSafeAreaInsets();

  const priorityOptions = {
    LOW: { label: '낮음', color: '#4CAF50', icon: () => <Icon name="emoticon-happy" size={20} color="#4CAF50" /> },
    MEDIUM: { label: '중간', color: '#FFA500', icon: () => <Icon name="emoticon-neutral" size={20} color="#FFA500" /> },
    HIGH: { label: '높음', color: '#FF0000', icon: () => <Icon name="emoticon-sad" size={20} color="#FF0000" /> },
  };

  const repeatOptions = {
    NONE: { label: '반복 없음', icon: () => <Icon name="repeat" size={20} color="#2C5282" /> },
    DAILY: { label: '매일', icon: () => <Icon name="calendar-range" size={20} color="#2C5282" /> },
    WEEKLY: { label: '매주', icon: () => <Icon name="calendar-week" size={20} color="#2C5282" /> },
    MONTHLY: { label: '매월', icon: () => <Icon name="calendar-month" size={20} color="#2C5282" /> },
    YEARLY: { label: '매년', icon: () => <Icon name="calendar-year" size={20} color="#2C5282" /> },
  };

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

  // 알람 디버깅 함수들 (임시 비활성화)
  // const checkAlarms = async () => {
  //   if (AlarmService) {
  //     await AlarmService.checkScheduledAlarms();
  //   } else {
  //     Alert.alert('오류', 'AlarmService를 사용할 수 없습니다.');
  //   }
  // };

  // const testAlarm = async () => {
  //   if (AlarmService) {
  //     const testId = await AlarmService.scheduleTestAlarm();
  //     if (testId) {
  //       Alert.alert('테스트 알람', '1분 후에 테스트 알람이 울립니다.');
  //     } else {
  //       Alert.alert('오류', '테스트 알람 설정에 실패했습니다.');
  //     }
  //   } else {
  //     Alert.alert('오류', 'AlarmService를 사용할 수 없습니다.');
  //   }
  // };

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
    <SafeAreaView style={styles.container}>
      <View style={styles.calendarContainer}>
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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.scheduleContainer}>
          <View style={styles.viewModeContainer}>
            <SegmentedButtons
              value={viewMode}
              onValueChange={setViewMode}
              buttons={[
                { value: 'daily', label: '일간' },
                { value: 'weekly', label: '주간' },
                { value: 'monthly', label: '월간' },
              ]}
              style={styles.segmentedButtons}
            />
            <Text style={styles.dateRangeText}>{getDateRangeText()}</Text>
          </View>

          {/* 알람 디버깅 버튼들 */}
          {/* 알람 디버깅 버튼들 (임시 비활성화)
          <View style={styles.debugContainer}>
            <Button
              mode="outlined"
              onPress={checkAlarms}
              style={styles.debugButton}
              textColor="#2C5282"
              icon="bell-ring"
            >
              알람 확인
            </Button>
            <Button
              mode="outlined"
              onPress={testAlarm}
              style={styles.debugButton}
              textColor="#FF5722"
              icon="test-tube"
            >
              테스트 알람
            </Button>
          </View>
          */}

          <View style={styles.scheduleList}>
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
                        styles.scheduleItem,
                        isCompleted && styles.completedScheduleItem
                      ]}
                      onPress={() => navigation.navigate('ScheduleDetail', { scheduleId: schedule.id })}
                    >
                      <View style={styles.scheduleContent}>
                        <View style={styles.scheduleTitleContainer}>
                          <View style={[
                            styles.categoryDot, 
                            { backgroundColor: category?.color || '#666' },
                            isCompleted && styles.completedCategoryDot
                          ]} />
                          <Text 
                            style={[
                              styles.scheduleTitle,
                              isCompleted && styles.completedScheduleTitle
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {schedule.title}
                          </Text>
                          {isCompleted && (
                            <Icon 
                              name="check-circle" 
                              size={16} 
                              color="#81C784" 
                              style={styles.completedIcon}
                            />
                          )}
                        </View>
                        <View style={styles.scheduleRightContent}>
                          <Text style={[
                            styles.scheduleTime,
                            isCompleted && styles.completedScheduleTime
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
                          <TouchableOpacity
                            style={styles.completeButton}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleToggleComplete(schedule.id, !isCompleted);
                            }}
                          >
                            <Icon 
                              name={isCompleted ? "check-circle" : "circle-outline"} 
                              size={20} 
                              color={isCompleted ? "#81C784" : "#CCC"} 
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                });
              })()
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {viewMode === 'daily' && selectedDate === format(new Date(), 'yyyy-MM-dd')
                    ? '오늘의 일정이 없습니다.'
                    : viewMode === 'weekly'
                    ? '이번 주 일정이 없습니다.'
                    : viewMode === 'monthly'
                    ? '이번 달 일정이 없습니다.'
                    : '선택한 기간의 일정이 없습니다.'}
                </Text>
                <Text style={styles.emptySubText}>
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
      </Portal>

      <FAB
        style={[styles.addButton, { bottom: insets.bottom + 16 }]}
        onPress={() => showDialog()}
        icon="plus"
        mode="flat"
        size="small"
        color="#fff"
      />


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80, // 네비게이션 바 높이 + 여유 공간
  },
  scheduleContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    marginBottom: 16, // FAB를 위한 여백 조정
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  viewModeContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  dateRangeText: {
    fontSize: 14,
    color: '#2C5282',
    textAlign: 'center',
    marginBottom: 8,
  },
  scheduleList: {
    padding: 16,
  },
  scheduleItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#A5D8FF',
  },
  scheduleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  scheduleTitle: {
    fontSize: 14,
    color: '#2D3748',
    flex: 1,
  },
  scheduleTime: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'right',
  },
  completedScheduleItem: {
    backgroundColor: '#F8F9FA',
    opacity: 0.7,
  },
  completedScheduleTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  completedScheduleTime: {
    color: '#999',
  },
  completedCategoryDot: {
    opacity: 0.5,
  },
  completedIcon: {
    marginLeft: 4,
  },
  completeButton: {
    padding: 4,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 88,
    backgroundColor: '#2C5282',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  debugContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  debugButton: {
    flex: 1,
    height: 36,
  },
});

export default HomeScreen; 