import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, HelperText, Portal, Dialog, Chip } from 'react-native-paper';
import { useSchedule } from '../context/ScheduleContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditScheduleScreen = ({ route, navigation }) => {
  const { scheduleId } = route.params;
  const { schedules, updateSchedule, categories } = useSchedule();
  const schedule = schedules.find(s => s.id === scheduleId);

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

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title);
      setDescription(schedule.description);
      setStartTime(new Date(schedule.startTime));
      setEndTime(new Date(schedule.endTime));
      setCategoryId(schedule.categoryId);
    }
  }, [schedule]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }
    if (endTime <= startTime) {
      newErrors.endTime = '종료 시간은 시작 시간보다 이후여야 합니다';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateSchedule(scheduleId, {
        title,
        description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        categoryId,
      });
      navigation.goBack();
    } catch (error) {
      console.error('일정 수정 실패:', error);
    }
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
      <ScrollView>
        <View style={styles.form}>
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
          </View>

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            저장
          </Button>
        </View>
      </ScrollView>

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
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  timeContainer: {
    marginVertical: 8,
  },
  timeButton: {
    marginBottom: 8,
  },
  categoryContainer: {
    marginVertical: 16,
  },
  categoryButton: {
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  saveButton: {
    marginTop: 16,
  },
});

export default EditScheduleScreen; 