import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, TextInput as RNTextInput } from 'react-native';
import { TextInput, Button, HelperText, Portal, Dialog, Chip, IconButton, Menu, Divider } from 'react-native-paper';
import { useSchedule } from '../context/ScheduleContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddScheduleScreen = ({ navigation }) => {
  const { addSchedule, categories, priorityOptions, repeatOptions } = useSchedule();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [repeat, setRepeat] = useState('NONE');
  const [repeatEndDate, setRepeatEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showRepeatEndDatePicker, setShowRepeatEndDatePicker] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [repeatMenuVisible, setRepeatMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }
    if (!categoryId) {
      newErrors.category = '카테고리를 선택해주세요';
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
      const newSchedule = {
        title: title.trim(),
        description: description.trim(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        categoryId,
        priority,
        repeat,
        repeatEndDate: repeat !== 'NONE' ? repeatEndDate?.toISOString() : null,
        isCompleted: false,
      };

      const savedSchedule = await addSchedule(newSchedule);
      navigation.navigate('ScheduleDetail', { scheduleId: savedSchedule.id });
    } catch (error) {
      console.error('일정 추가 실패:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <TextInput
            label="제목"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#2C5282' } }}
            textColor="#2C5282"
          />
          <HelperText type="error" visible={!!errors.title} style={styles.errorText}>
            {errors.title}
          </HelperText>

          <TextInput
            label="설명"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.descriptionInput}
            mode="outlined"
            theme={{ colors: { primary: '#2C5282' } }}
            textColor="#2C5282"
          />

          <Divider style={styles.divider} />

          <View style={styles.widgetContainer}>
            <View style={styles.widgetRow}>
              <Menu
                visible={categoryMenuVisible}
                onDismiss={() => setCategoryMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setCategoryMenuVisible(true)}
                    style={[styles.widgetButton, { borderColor: categoryId ? categories.find(c => c.id === categoryId)?.color || '#A5D8FF' : '#A5D8FF' }]}
                    textColor={categoryId ? categories.find(c => c.id === categoryId)?.color || '#2C5282' : '#2C5282'}
                    icon={({ size, color }) => (
                      <View style={[styles.categoryDot, { backgroundColor: categoryId ? categories.find(c => c.id === categoryId)?.color || '#A5D8FF' : '#A5D8FF' }]} />
                    )}
                  >
                    {categoryId ? categories.find(c => c.id === categoryId)?.name || '카테고리' : '카테고리'}
                  </Button>
                }
              >
                {categories.map((category) => (
                  <Menu.Item
                    key={category.id}
                    onPress={() => {
                      setCategoryId(category.id);
                      setCategoryMenuVisible(false);
                    }}
                    title={category.name}
                    leadingIcon={() => (
                      <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    )}
                  />
                ))}
              </Menu>

              <Menu
                visible={priorityMenuVisible}
                onDismiss={() => setPriorityMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setPriorityMenuVisible(true)}
                    style={[styles.widgetButton, { borderColor: priorityOptions[priority].color }]}
                    textColor={priorityOptions[priority].color}
                    icon={priorityOptions[priority].icon}
                  >
                    {priorityOptions[priority].label}
                  </Button>
                }
              >
                {Object.entries(priorityOptions).map(([key, option]) => (
                  <Menu.Item
                    key={key}
                    onPress={() => {
                      setPriority(key);
                      setPriorityMenuVisible(false);
                    }}
                    title={option.label}
                    leadingIcon={option.icon}
                  />
                ))}
              </Menu>
            </View>
            <HelperText type="error" visible={!!errors.category} style={styles.errorText}>
              {errors.category}
            </HelperText>
          </View>

          <View style={styles.timeContainer}>
            <Button
              mode="outlined"
              onPress={() => setShowStartDatePicker(true)}
              style={styles.timeButton}
              textColor="#2C5282"
              iconColor="#2C5282"
              icon="calendar"
            >
              {format(startTime, 'yyyy년 MM월 dd일 HH:mm')}
            </Button>
            <HelperText type="error" visible={!!errors.startTime} style={styles.errorText}>
              {errors.startTime}
            </HelperText>

            <Button
              mode="outlined"
              onPress={() => setShowEndDatePicker(true)}
              style={styles.timeButton}
              textColor="#2C5282"
              iconColor="#2C5282"
              icon="calendar"
            >
              {format(endTime, 'yyyy년 MM월 dd일 HH:mm')}
            </Button>
            <HelperText type="error" visible={!!errors.endTime} style={styles.errorText}>
              {errors.endTime}
            </HelperText>
          </View>

          <View style={styles.widgetContainer}>
            <View style={styles.widgetRow}>
              <Menu
                visible={repeatMenuVisible}
                onDismiss={() => setRepeatMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setRepeatMenuVisible(true)}
                    style={[styles.widgetButton, { borderColor: repeat !== 'NONE' ? '#2C5282' : '#A5D8FF' }]}
                    textColor={repeat !== 'NONE' ? '#2C5282' : '#2C5282'}
                    icon="repeat"
                  >
                    {repeatOptions[repeat].label === '반복 없음' ? '반복 안함' : repeatOptions[repeat].label}
                  </Button>
                }
              >
                {Object.entries(repeatOptions).map(([key, option]) => (
                  <Menu.Item
                    key={key}
                    onPress={() => {
                      setRepeat(key);
                      setRepeatMenuVisible(false);
                      if (key !== 'NONE') {
                        setTimeout(() => setShowRepeatEndDatePicker(true), 100);
                      }
                    }}
                    title={option.label}
                    leadingIcon={option.icon}
                  />
                ))}
              </Menu>
            </View>
          </View>

          {repeat !== 'NONE' && (
            <View style={styles.datePickerContainer}>
              <Button
                mode="outlined"
                onPress={() => setShowRepeatEndDatePicker(true)}
                style={styles.datePickerButton}
                textColor="#2C5282"
                iconColor="#2C5282"
                icon="calendar"
              >
                {repeatEndDate ? format(repeatEndDate, 'yyyy년 MM월 dd일') : '반복 종료일 선택'}
              </Button>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              textColor="#2C5282"
            >
              취소
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              buttonColor="#2C5282"
              textColor="#fff"
            >
              추가
            </Button>
          </View>

          {showStartDatePicker && (
            <DateTimePicker
              value={startTime}
              mode="date"
              onChange={(event, date) => {
                setShowStartDatePicker(false);
                if (date) {
                  const newDate = new Date(startTime);
                  newDate.setFullYear(date.getFullYear());
                  newDate.setMonth(date.getMonth());
                  newDate.setDate(date.getDate());
                  setStartTime(newDate);
                  setTimeout(() => setShowStartTimePicker(true), 100);
                }
              }}
            />
          )}

          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={true}
              onChange={(event, time) => {
                setShowStartTimePicker(false);
                if (time) {
                  const newDate = new Date(startTime);
                  newDate.setHours(time.getHours());
                  newDate.setMinutes(time.getMinutes());
                  setStartTime(newDate);
                }
              }}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endTime}
              mode="date"
              onChange={(event, date) => {
                setShowEndDatePicker(false);
                if (date) {
                  const newDate = new Date(endTime);
                  newDate.setFullYear(date.getFullYear());
                  newDate.setMonth(date.getMonth());
                  newDate.setDate(date.getDate());
                  setEndTime(newDate);
                  setTimeout(() => setShowEndTimePicker(true), 100);
                }
              }}
            />
          )}

          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={true}
              onChange={(event, time) => {
                setShowEndTimePicker(false);
                if (time) {
                  const newDate = new Date(endTime);
                  newDate.setHours(time.getHours());
                  newDate.setMinutes(time.getMinutes());
                  setEndTime(newDate);
                }
              }}
            />
          )}

          {showRepeatEndDatePicker && (
            <DateTimePicker
              value={repeatEndDate || new Date()}
              mode="date"
              onChange={(event, date) => {
                setShowRepeatEndDatePicker(false);
                if (date) {
                  setRepeatEndDate(date);
                }
              }}
              minimumDate={new Date()}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#A5D8FF',
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    marginBottom: 8,
    backgroundColor: '#fff',
    height: 100,
  },
  timeContainer: {
    marginVertical: 8,
  },
  timeButton: {
    marginBottom: 8,
    borderColor: '#A5D8FF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#A5D8FF',
  },
  saveButton: {
    flex: 1,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  widgetContainer: {
    marginBottom: 16,
  },
  widgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  widgetButton: {
    flex: 1,
    borderWidth: 1,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#E2E8F0',
  },
  datePickerContainer: {
    alignItems: 'center',
    padding: 16,
  },
  datePickerButton: {
    width: '100%',
    borderColor: '#A5D8FF',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});

export default AddScheduleScreen; 