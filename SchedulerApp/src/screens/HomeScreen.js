import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FAB, Portal, Dialog, TextInput, Button, Chip, HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSchedule } from '../context/ScheduleContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';

const HomeScreen = ({ navigation }) => {
  const { saveSchedule, getSchedulesByDate, categories } = useSchedule();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [categoryId, setCategoryId] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setTitle('');
    setDescription('');
    setStartTime(new Date());
    setEndTime(new Date());
    setCategoryId('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }
    if (endTime <= startTime) {
      newErrors.endTime = '종료 시간은 시작 시간보다 이후여야 합니다';
    }
    if (!categoryId) {
      newErrors.category = '카테고리를 선택해주세요';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSchedule = async () => {
    if (!validateForm()) return;

    try {
      const newSchedule = await saveSchedule({
        title,
        description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        categoryId,
      });
      hideDialog();
      // 새로 추가된 일정의 상세 화면으로 이동
      navigation.navigate('ScheduleDetail', { scheduleId: newSchedule.id });
    } catch (error) {
      console.error('일정 추가 실패:', error);
    }
  };

  // 선택된 날짜의 일정 목록 (기간 일정 포함)
  const schedulesForSelectedDate = selectedDate ? getSchedulesByDate(selectedDate).filter(schedule => {
    const scheduleStart = new Date(schedule.startTime);
    const scheduleEnd = new Date(schedule.endTime);
    const selected = new Date(selectedDate);
    
    // 선택된 날짜가 일정의 시작일과 종료일 사이에 있는지 확인
    return selected >= scheduleStart && selected <= scheduleEnd;
  }) : [];

  // 캘린더에 표시할 마커 생성
  const getMarkedDates = () => {
    const marked = {};
    const allSchedules = getSchedulesByDate(); // 모든 일정 가져오기

    // 각 일정의 시작일부터 종료일까지 마커 추가
    allSchedules.forEach(schedule => {
      const start = new Date(schedule.startTime);
      const end = new Date(schedule.endTime);
      const category = categories.find(c => c.id === schedule.categoryId);

      // 시작일부터 종료일까지 반복
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateString = format(date, 'yyyy-MM-dd');
        if (marked[dateString]) {
          // 이미 마커가 있는 경우 dots 배열에 추가
          if (!marked[dateString].dots) {
            marked[dateString].dots = [];
          }
          marked[dateString].dots.push({
            color: category?.color || '#666',
            key: schedule.id
          });
        } else {
          // 새로운 마커 생성
          marked[dateString] = {
            dots: [{
              color: category?.color || '#666',
              key: schedule.id
            }],
            selected: dateString === selectedDate
          };
        }
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

  const handleStartDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    if (event.type !== 'dismissed' && selectedDate) {
      const newDate = new Date(startTime);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setStartTime(newDate);
    }
  };

  const handleStartTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowStartTimePicker(false);
    }
    if (event.type !== 'dismissed' && selectedTime) {
      const newDate = new Date(startTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setStartTime(newDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    if (event.type !== 'dismissed' && selectedDate) {
      const newDate = new Date(endTime);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setEndTime(newDate);
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowEndTimePicker(false);
    }
    if (event.type !== 'dismissed' && selectedTime) {
      const newDate = new Date(endTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setEndTime(newDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
        markingType="multi-dot"
        theme={{
          todayTextColor: '#6200ee',
          selectedDayBackgroundColor: '#6200ee',
        }}
      />

      <ScrollView style={styles.scheduleList}>
        {schedulesForSelectedDate.map(schedule => {
          const category = categories.find(c => c.id === schedule.categoryId);
          return (
            <TouchableOpacity
              key={schedule.id}
              style={styles.scheduleItem}
              onPress={() => navigation.navigate('ScheduleDetail', { scheduleId: schedule.id })}
            >
              <View style={styles.scheduleHeader}>
                <View style={styles.scheduleTitleContainer}>
                  <View style={[styles.categoryDot, { backgroundColor: category?.color || '#666' }]} />
                  <Text style={styles.scheduleTitle}>{schedule.title}</Text>
                </View>
                <Chip
                  style={[styles.categoryChip, { backgroundColor: category?.color + '20' }]}
                  textStyle={{ color: category?.color }}
                >
                  {category?.name}
                </Chip>
              </View>
              <Text style={styles.scheduleTime}>
                {format(parseISO(schedule.startTime), 'HH:mm')} - {format(parseISO(schedule.endTime), 'HH:mm')}
              </Text>
              {schedule.description && (
                <Text style={styles.scheduleDescription} numberOfLines={2}>
                  {schedule.description}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>새 일정 추가</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="제목"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              error={!!errors.title}
            />
            <HelperText type="error" visible={!!errors.title}>
              {errors.title}
            </HelperText>

            <TextInput
              label="설명"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <View style={styles.timeContainer}>
              <Button
                mode="outlined"
                onPress={() => setShowStartDatePicker(true)}
                style={styles.timeButton}
              >
                시작 날짜: {format(startTime, 'yyyy년 MM월 dd일')}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setShowStartTimePicker(true)}
                style={styles.timeButton}
              >
                시작 시간: {format(startTime, 'HH:mm')}
              </Button>
              <HelperText type="error" visible={!!errors.startTime}>
                {errors.startTime}
              </HelperText>

              <Button
                mode="outlined"
                onPress={() => setShowEndDatePicker(true)}
                style={styles.timeButton}
              >
                종료 날짜: {format(endTime, 'yyyy년 MM월 dd일')}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setShowEndTimePicker(true)}
                style={styles.timeButton}
              >
                종료 시간: {format(endTime, 'HH:mm')}
              </Button>
              <HelperText type="error" visible={!!errors.endTime}>
                {errors.endTime}
              </HelperText>
            </View>

            <View style={styles.categoryContainer}>
              <Button
                mode="outlined"
                onPress={() => {}}
                style={styles.categoryButton}
              >
                카테고리
              </Button>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map(category => (
                  <Chip
                    key={category.id}
                    selected={categoryId === category.id}
                    onPress={() => setCategoryId(category.id)}
                    style={[
                      styles.categoryChip,
                      { backgroundColor: category.color + '20' }
                    ]}
                    textStyle={{ color: category.color }}
                  >
                    {category.name}
                  </Chip>
                ))}
              </ScrollView>
              <HelperText type="error" visible={!!errors.category}>
                {errors.category}
              </HelperText>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>취소</Button>
            <Button onPress={handleAddSchedule}>추가</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={showDialog}
      />

      {showStartDatePicker && (
        <DateTimePicker
          value={startTime}
          mode="date"
          onChange={handleStartDateChange}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          onChange={handleStartTimeChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endTime}
          mode="date"
          onChange={handleEndDateChange}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          onChange={handleEndTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scheduleList: {
    flex: 1,
    padding: 16,
  },
  scheduleItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  input: {
    marginBottom: 8,
  },
  categoryContainer: {
    marginVertical: 8,
  },
  categoryButton: {
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  timeContainer: {
    marginVertical: 8,
  },
  timeButton: {
    marginBottom: 8,
  },
});

export default HomeScreen; 