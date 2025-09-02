import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Dialog, TextInput, Button, HelperText, Menu, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Schedule, Category, PriorityOptions, RepeatOptions } from '../types';

type AlarmOption = {
  label: string;
  value: number;
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onAddSchedule: (schedule: Schedule) => Promise<void>;
  onEditSchedule?: (schedule: Schedule) => Promise<void>;
  categories: Category[];
  priorityOptions: PriorityOptions;
  repeatOptions: RepeatOptions;
  selectedDate?: string;
  editSchedule?: Schedule | null; // 수정할 일정 데이터
  mode?: 'add' | 'edit'; // 다이얼로그 모드
};

type Errors = {
  title?: string;
  endTime?: string;
  category?: string;
  startTime?: string;
};

// Header 컴포넌트
const DialogHeader: React.FC<{ mode: 'add' | 'edit' }> = ({ mode }) => (
  <View style={{
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  }}>
    <Text style={{
      color: '#2C5282',
      fontSize: 18,
      fontWeight: 'bold',
    }}>{mode === 'edit' ? '일정 수정' : '새 일정'}</Text>
  </View>
);

const ScheduleDialog: React.FC<Props> = ({ 
  visible, 
  onDismiss, 
  onAddSchedule, 
  onEditSchedule,
  categories, 
  priorityOptions, 
  repeatOptions,
  selectedDate,
  editSchedule,
  mode = 'add'
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
  });
  const [endTime, setEndTime] = useState<Date>(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, now.getMinutes());
    return end;
  });
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [repeat, setRepeat] = useState('NONE');
  const [repeatEndDate, setRepeatEndDate] = useState<Date | null>(null);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [alarmOffset, setAlarmOffset] = useState('5'); // 5분전 기본값

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showRepeatEndDatePicker, setShowRepeatEndDatePicker] = useState(false);
  const [alarmMenuVisible, setAlarmMenuVisible] = useState(false);
  const [alarmTimeMenuVisible, setAlarmTimeMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [repeatMenuVisible, setRepeatMenuVisible] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const alarmOptions: Record<string, AlarmOption> = {
    '5': { label: '5분 전', value: 5 },
    '10': { label: '10분 전', value: 10 },
    '30': { label: '30분 전', value: 30 },
    '60': { label: '1시간 전', value: 60 },
    '1440': { label: '하루 전', value: 1440 },
  };

  // selectedDate가 변경되거나 수정 모드일 때 폼 초기화
  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && editSchedule) {
        // 수정 모드: 기존 일정 데이터로 폼 초기화
        setTitle(editSchedule.title || '');
        setDescription(editSchedule.description || '');
        setStartTime(new Date(editSchedule.startTime));
        setEndTime(new Date(editSchedule.endTime));
        setCategoryId(editSchedule.categoryId || '');
        setPriority(editSchedule.priority || 'LOW');
        setRepeat(editSchedule.repeat || 'NONE');
        setRepeatEndDate(editSchedule.repeatEndDate ? new Date(editSchedule.repeatEndDate) : null);
        setAlarmEnabled(editSchedule.alarmEnabled || false);
        setAlarmOffset(editSchedule.alarmTime ? 
          Math.ceil((new Date(editSchedule.startTime).getTime() - new Date(editSchedule.alarmTime).getTime()) / (1000 * 60)).toString() : '5');
      } else {
        // 추가 모드: selectedDate 또는 현재 시간으로 초기화
        try {
          if (selectedDate && typeof selectedDate === 'string' && selectedDate.includes('-')) {
            const [year, month, day] = selectedDate.split('-').map(Number);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
              const now = new Date();
              const newStartTime = new Date(year, month - 1, day, now.getHours(), now.getMinutes());
              if (!isNaN(newStartTime.getTime())) {
                setStartTime(newStartTime);
                
                // 종료 시간도 같이 업데이트 (1시간 후)
                const newEndTime = new Date(year, month - 1, day, now.getHours() + 1, now.getMinutes());
                if (!isNaN(newEndTime.getTime())) {
                  setEndTime(newEndTime);
                }
              }
            }
          } else {
            // selectedDate가 없거나 유효하지 않으면 현재 시간으로 설정
            const now = new Date();
            if (!isNaN(now.getTime())) {
              const newStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
              const newEndTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, now.getMinutes());
              
              if (!isNaN(newStartTime.getTime()) && !isNaN(newEndTime.getTime())) {
                setStartTime(newStartTime);
                setEndTime(newEndTime);
              }
            }
          }
        } catch (error) {
          console.error('날짜 파싱 오류:', error);
          // 에러 발생 시 현재 시간으로 설정
          const now = new Date();
          if (!isNaN(now.getTime())) {
            const newStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
            const newEndTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, now.getMinutes());
            
            if (!isNaN(newStartTime.getTime()) && !isNaN(newEndTime.getTime())) {
              setStartTime(newStartTime);
              setEndTime(newEndTime);
            }
          }
        }
      }
    }
  }, [selectedDate, visible, mode, editSchedule]);

  const resetForm = () => {
    if (mode === 'edit' && editSchedule) {
      // 수정 모드: 기존 일정 데이터로 폼 초기화
      setTitle(editSchedule.title || '');
      setDescription(editSchedule.description || '');
      setStartTime(new Date(editSchedule.startTime));
      setEndTime(new Date(editSchedule.endTime));
      setCategoryId(editSchedule.categoryId || '');
      setPriority(editSchedule.priority || 'LOW');
      setRepeat(editSchedule.repeat || 'NONE');
      setRepeatEndDate(editSchedule.repeatEndDate ? new Date(editSchedule.repeatEndDate) : null);
      setAlarmEnabled(editSchedule.alarmEnabled || false);
      setAlarmOffset(editSchedule.alarmTime ? 
        Math.ceil((new Date(editSchedule.startTime).getTime() - new Date(editSchedule.alarmTime).getTime()) / (1000 * 60)).toString() : '5');
    } else {
      // 추가 모드: 기본값으로 초기화
      try {
        const now = new Date();
        if (!isNaN(now.getTime())) {
          const newStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
          const newEndTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, now.getMinutes());
          
          if (!isNaN(newStartTime.getTime()) && !isNaN(newEndTime.getTime())) {
            setStartTime(newStartTime);
            setEndTime(newEndTime);
          }
        }
      } catch (error) {
        console.error('폼 리셋 중 날짜 설정 오류:', error);
      }
      
      setTitle('');
      setDescription('');
      setCategoryId('');
      setPriority('LOW');
      setRepeat('NONE');
      setRepeatEndDate(null);
      setAlarmEnabled(false);
      setAlarmOffset('5');
    }
    setErrors({});
  };

  const handleDismiss = () => {
    onDismiss();
    setTimeout(resetForm, 300);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // 알람 시간 계산
      let alarmTime: string | null = null;
      if (alarmEnabled && alarmOffset) {
        const offsetMinutes = parseInt(alarmOffset);
        const alarmDateTime = new Date(startTime);
        alarmDateTime.setMinutes(alarmDateTime.getMinutes() - offsetMinutes);
        alarmTime = alarmDateTime.toISOString();
      }

      const newSchedule: Schedule = {
        ...(mode === 'edit' && editSchedule ? { id: editSchedule.id } : {}),
        title: title.trim(),
        description: description.trim(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        categoryId,
        repeat,
        repeatEndDate: repeat !== 'NONE' ? repeatEndDate?.toISOString() || null : null,
        priority,
        alarmEnabled,
        alarmTime: alarmTime,
        ...(mode === 'edit' && editSchedule ? {
          repeatGroupId: editSchedule.repeatGroupId,
          isRecurring: editSchedule.isRecurring,
          originalRepeat: editSchedule.originalRepeat,
          originalRepeatEndDate: editSchedule.originalRepeatEndDate,
          createdAt: editSchedule.createdAt,
          updatedAt: new Date().toISOString()
        } : {
          createdAt: new Date().toISOString()
        })
      };

      if (mode === 'edit' && onEditSchedule) {
        await onEditSchedule(newSchedule);
      } else {
        await onAddSchedule(newSchedule);
      }
      handleDismiss();
    } catch (error) {
      console.error('일정 처리 실패:', error);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (event.type !== 'dismissed' && selectedDate) {
      const newDate = new Date(startTime);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setStartTime(newDate);
      // 종료 시간이 시작 시간보다 이전이면 종료 시간도 같이 업데이트
      if (endTime <= newDate) {
        const newEndDate = new Date(newDate);
        newEndDate.setHours(newDate.getHours() + 1);
        setEndTime(newEndDate);
      }
    }
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (event.type !== 'dismissed' && selectedTime) {
      const newDate = new Date(startTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setStartTime(newDate);
      // 종료 시간이 시작 시간보다 이전이면 종료 시간도 같이 업데이트
      if (endTime <= newDate) {
        const newEndDate = new Date(newDate);
        newEndDate.setHours(newDate.getHours() + 1);
        setEndTime(newEndDate);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (event.type !== 'dismissed' && selectedDate) {
      const newDate = new Date(endTime);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setEndTime(newDate);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (event.type !== 'dismissed' && selectedTime) {
      const newDate = new Date(endTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setEndTime(newDate);
    }
  };

  const handleRepeatEndDateChange = (event: any, selectedDate?: Date) => {
    setShowRepeatEndDatePicker(false);
    if (event.type !== 'dismissed' && selectedDate) {
      setRepeatEndDate(selectedDate);
    }
  };

  return (
    <>
      <Dialog
        visible={visible}
        onDismiss={handleDismiss}
        style={styles.dialog}
      >
      <DialogHeader mode={mode} />
      <Dialog.Content style={styles.dialogContent}>
        <ScrollView
          style={styles.dialogScrollView}
          contentContainerStyle={styles.dialogScrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <TextInput
              label="제목"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: undefined }));
                }
              }}
              style={styles.input}
              mode="outlined"
              theme={{ 
                colors: { 
                  primary: '#2C5282',
                  outline: '#A5D8FF',
                  onSurfaceVariant: '#64748B'
                } 
              }}
              textColor="#2C5282"
              error={!!errors.title}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              maxLength={100}
            />
            <HelperText type="error" visible={!!errors.title} style={styles.errorText}>
              {errors.title}
            </HelperText>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="설명"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={styles.descriptionInput}
              mode="outlined"
              theme={{ 
                colors: { 
                  primary: '#2C5282',
                  outline: '#A5D8FF',
                  onSurfaceVariant: '#64748B'
                } 
              }}
              textColor="#2C5282"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              maxLength={500}
            />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.widgetContainer}>
            <View style={styles.widgetRow}>
              <View style={styles.widgetItem}>
                <Menu
                  visible={categoryMenuVisible}
                  onDismiss={() => setCategoryMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setCategoryMenuVisible(true)}
                      style={[styles.widgetButton, { borderColor: categoryId ? categories.find(c => c.id === categoryId)?.color || '#A5D8FF' : '#A5D8Ff' }]}
                      contentStyle={styles.widgetButtonContent}
                      labelStyle={styles.widgetButtonLabel}
                      uppercase={false}
                      textColor={categoryId ? categories.find(c => c.id === categoryId)?.color || '#2C5282' : '#2C5282'}
                      icon={({ size, color }) => (
                        <View style={[styles.categoryDot, { backgroundColor: categoryId ? categories.find(c => c.id === categoryId)?.color || '#A5D8FF' : '#A5D8FF' }]} />
                      )}
                      theme={{ 
                        colors: { 
                          primary: categoryId ? categories.find(c => c.id === categoryId)?.color || '#2C5282' : '#2C5282',
                          outline: categoryId ? categories.find(c => c.id === categoryId)?.color || '#A5D8FF' : '#A5D8FF'
                        } 
                      }}
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
              </View>

              <View style={styles.widgetItem}>
                <Menu
                  visible={priorityMenuVisible}
                  onDismiss={() => setPriorityMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setPriorityMenuVisible(true)}
                      style={[styles.widgetButton, { borderColor: priorityOptions[priority].color }]}
                      contentStyle={styles.widgetButtonContent}
                      labelStyle={styles.widgetButtonLabel}
                      uppercase={false}
                      textColor={priorityOptions[priority].color}
                      icon={() => React.createElement(priorityOptions[priority].icon, { size: 20, color: priorityOptions[priority].color })}
                      theme={{ 
                        colors: { 
                          primary: priorityOptions[priority].color,
                          outline: priorityOptions[priority].color
                        } 
                      }}
                    >
                      {priorityOptions[priority].label}
                    </Button>
                  }
                >
                  {Object.entries(priorityOptions).map(([key, option]) => (
                    <Menu.Item
                      key={key}
                      onPress={() => {
                        setPriority(key as 'LOW' | 'MEDIUM' | 'HIGH');
                        setPriorityMenuVisible(false);
                      }}
                      title={option.label}
                      leadingIcon={() => React.createElement(option.icon, { size: 20, color: '#2C5282' })}
                    />
                  ))}
                </Menu>
              </View>
            </View>
            <HelperText type="error" visible={!!errors.category} style={styles.errorText}>
              {errors.category}
            </HelperText>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.timeSectionTitle}>시작 시간</Text>
            <View style={styles.timeRow}>
              <TouchableOpacity
                onPress={() => {
                  setShowStartDatePicker(true);
                  setShowStartTimePicker(false);
                }}
                style={[styles.timeButtonContainer, { flex: 2 }]}
              >
                <Button
                  mode="outlined"
                  style={styles.timeButton}
                  textColor="#2C5282"
                  icon="calendar"
                  theme={{ 
                    colors: { 
                      primary: '#2C5282',
                      outline: '#A5D8FF'
                    } 
                  }}
                >
                  {startTime && !isNaN(startTime.getTime()) 
                    ? format(startTime, 'yyyy년 MM월 dd일')
                    : '날짜 선택'
                  }
                </Button>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowStartTimePicker(true);
                  setShowStartDatePicker(false);
                }}
                style={[styles.timeButtonContainer, { flex: 1 }]}
              >
                <Button
                  mode="outlined"
                  style={styles.timeButton}
                  textColor="#2C5282"
                  icon="clock"
                  theme={{ 
                    colors: { 
                      primary: '#2C5282',
                      outline: '#A5D8FF'
                    } 
                  }}
                >
                  {startTime && !isNaN(startTime.getTime()) 
                    ? format(startTime, 'HH:mm')
                    : '시간 선택'
                  }
                </Button>
              </TouchableOpacity>
            </View>
            <HelperText type="error" visible={!!errors.startTime} style={styles.errorText}>
              {errors.startTime}
            </HelperText>

            <Text style={styles.timeSectionTitle}>종료 시간</Text>
            <View style={styles.timeRow}>
              <TouchableOpacity
                onPress={() => {
                  setShowEndDatePicker(true);
                  setShowEndTimePicker(false);
                }}
                style={[styles.timeButtonContainer, { flex: 2 }]}
              >
                <Button
                  mode="outlined"
                  style={styles.timeButton}
                  textColor="#2C5282"
                  icon="calendar"
                  theme={{ 
                    colors: { 
                      primary: '#2C5282',
                      outline: '#A5D8FF'
                    } 
                  }}
                >
                  {endTime && !isNaN(endTime.getTime()) 
                    ? format(endTime, 'yyyy년 MM월 dd일')
                    : '날짜 선택'
                  }
                </Button>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowEndTimePicker(true);
                  setShowEndDatePicker(false);
                }}
                style={[styles.timeButtonContainer, { flex: 1 }]}
              >
                <Button
                  mode="outlined"
                  style={styles.timeButton}
                  textColor="#2C5282"
                  icon="clock"
                  theme={{ 
                    colors: { 
                      primary: '#2C5282',
                      outline: '#A5D8FF'
                    } 
                  }}
                >
                  {endTime && !isNaN(endTime.getTime()) 
                    ? format(endTime, 'HH:mm')
                    : '시간 선택'
                  }
                </Button>
              </TouchableOpacity>
            </View>
            <HelperText type="error" visible={!!errors.endTime} style={styles.errorText}>
              {errors.endTime}
            </HelperText>
          </View>

          <View style={styles.settingsContainer}>
            <Text style={styles.settingsTitle}>설정</Text>
            <View style={styles.settingsRow}>
              <View style={styles.repeatContainer}>
                <Menu
                  visible={repeatMenuVisible}
                  onDismiss={() => setRepeatMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setRepeatMenuVisible(true)}
                      style={[styles.settingButton, { borderColor: repeat !== 'NONE' ? '#2C5282' : '#E2E8F0' }]}
                      textColor={repeat !== 'NONE' ? '#2C5282' : '#64748B'}
                      icon="repeat"
                      theme={{ 
                        colors: { 
                          primary: '#2C5282',
                          outline: repeat !== 'NONE' ? '#2C5282' : '#E2E8F0'
                        } 
                      }}
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
                        
                        // 반복이 설정된 경우 자동으로 종료일 선택기 표시
                        if (key !== 'NONE') {
                          // 약간의 지연을 두어 Menu가 완전히 닫힌 후 표시
                          setTimeout(() => {
                            setShowRepeatEndDatePicker(true);
                          }, 300);
                        } else {
                          // 반복이 없으면 종료일 초기화
                          setRepeatEndDate(null);
                        }
                      }}
                      title={option.label}
                      leadingIcon={() => React.createElement(option.icon, { size: 20, color: '#2C5282' })}
                    />
                  ))}
                </Menu>
              </View>

              <View style={styles.alarmContainer}>
                <Menu
                  visible={alarmMenuVisible}
                  onDismiss={() => setAlarmMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setAlarmMenuVisible(!alarmMenuVisible)}
                      style={[styles.settingButton, { borderColor: alarmEnabled ? '#2C5282' : '#E2E8F0' }]}
                      textColor={alarmEnabled ? '#2C5282' : '#64748B'}
                      icon="bell"
                      theme={{ 
                        colors: { 
                          primary: '#2C5282',
                          outline: alarmEnabled ? '#2C5282' : '#E2E8F0'
                        } 
                      }}
                    >
                      {alarmEnabled ? '알람 켜짐' : '알람 끔'}
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      setAlarmEnabled(true);
                      setAlarmMenuVisible(false);
                    }}
                    title="알람 켜기"
                    leadingIcon={() => (
                      <Icon name="bell" size={20} color="#2C5282" />
                    )}
                  />
                  <Menu.Item
                    onPress={() => {
                      setAlarmEnabled(false);
                      setAlarmMenuVisible(false);
                    }}
                    title="알람 끄기"
                    leadingIcon={() => (
                      <Icon name="bell-off" size={20} color="#64748B" />
                    )}
                  />
                </Menu>
              </View>
            </View>
          </View>

          {alarmEnabled && (
            <View style={styles.alarmTimeContainer}>
              <Menu
                visible={alarmTimeMenuVisible}
                onDismiss={() => setAlarmTimeMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setAlarmTimeMenuVisible(true)}
                    style={styles.alarmTimeButton}
                    textColor="#2C5282"
                    icon="clock"
                    theme={{ 
                      colors: { 
                        primary: '#2C5282',
                        outline: '#2C5282'
                      } 
                    }}
                  >
                    {alarmOptions[alarmOffset]?.label || '알람 시간 선택'}
                  </Button>
                }
              >
                {Object.entries(alarmOptions).map(([key, option]) => (
                  <Menu.Item
                    key={key}
                    onPress={() => {
                      setAlarmOffset(key);
                      setAlarmTimeMenuVisible(false);
                    }}
                    title={option.label}
                    leadingIcon={() => (
                      <Icon name="clock-outline" size={20} color="#2C5282" />
                    )}
                  />
                ))}
              </Menu>
            </View>
          )}

          {repeat !== 'NONE' && (
            <View style={styles.repeatEndContainer}>
              <Text style={styles.repeatEndLabel}>반복 종료일</Text>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowRepeatEndDatePicker(true);
                }}
                style={styles.repeatEndButton}
                textColor="#2C5282"
                icon="calendar-end"
                theme={{ 
                  colors: { 
                    primary: '#2C5282',
                    outline: '#2C5282'
                  } 
                }}
              >
                {repeatEndDate && !isNaN(repeatEndDate.getTime())
                  ? format(repeatEndDate, 'yyyy년 MM월 dd일')
                  : '종료일 설정'
                }
              </Button>
              {!repeatEndDate && (
                <Text style={styles.repeatWarningText}>
                  ⚠️ 종료일을 설정하지 않으면 1년간 반복됩니다
                </Text>
              )}
            </View>
          )}

        </ScrollView>
      </Dialog.Content>
      <Dialog.Actions style={styles.dialogActions}>
        <Button
          mode="outlined"
          onPress={handleDismiss}
          style={[styles.dialogButton, styles.cancelButton]}
          textColor="#718096"
          theme={{ 
            colors: { 
              primary: '#718096',
              outline: '#E2E8F0'
            } 
          }}
        >
          취소
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={[styles.dialogButton, styles.confirmButton]}
          buttonColor="#2C5282"
          textColor="#fff"
          theme={{ 
            colors: { 
              primary: '#2C5282'
            } 
          }}
        >
          {mode === 'edit' ? '수정' : '추가'}
        </Button>
      </Dialog.Actions>

      {showStartDatePicker && (
        <DateTimePicker
          value={startTime}
          mode="date"
          onChange={handleStartDateChange}
          minimumDate={new Date()}
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
          minimumDate={startTime}
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

    </Dialog>
    
    {showRepeatEndDatePicker && (
      <DateTimePicker
        value={repeatEndDate || new Date()}
        mode="date"
        display="default"
        onChange={handleRepeatEndDateChange}
        minimumDate={startTime}
      />
    )}
    </>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  dialogContent: {
    padding: 0,
  },
  dialogScrollView: {
    maxHeight: 500,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dialogScrollViewContent: {
    paddingBottom: 20,
  },
  dialogActions: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  dialogButton: {
    minWidth: 120,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelButton: {
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  confirmButton: {
    backgroundColor: '#2C5282',
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    height: 48,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  timeContainer: {
    marginVertical: 12,
  },
  timeSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C5282',
    marginBottom: 6,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  timeButtonContainer: {
    // flex는 인라인 스타일로 개별 설정
  },
  timeButton: {
    borderColor: '#A5D8FF',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingsContainer: {
    marginVertical: 12,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C5282',
    marginBottom: 6,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  repeatContainer: {
    flex: 1,
  },
  settingButton: {
    borderWidth: 1,
    height: 40,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#E2E8F0',
    height: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  alarmContainer: {
    flex: 1,
  },
  alarmTimeContainer: {
    marginTop: 8,
  },
  alarmTimeButton: {
    borderColor: '#2C5282',
    height: 40,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  repeatEndContainer: {
    marginTop: 8,
  },
  repeatEndButton: {
    borderColor: '#2C5282',
    height: 40,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  widgetContainer: {
    marginBottom: 12,
  },
  widgetRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  widgetItem: {
    flex: 1,
  },
  widgetButton: {
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  widgetButtonContent: {
    height: 40,
    paddingHorizontal: 12,
  },
  widgetButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  repeatWarningText: {
    fontSize: 12,
    color: '#F59E0B',
    marginTop: 6,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  repeatEndLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C5282',
    marginBottom: 6,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default ScheduleDialog;
