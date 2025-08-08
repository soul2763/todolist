import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Dialog, TextInput, Button, HelperText, Menu, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddScheduleDialog = ({ 
  visible, 
  onDismiss, 
  onAddSchedule, 
  categories, 
  priorityOptions, 
  repeatOptions,
  selectedDate
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
  });
  const [endTime, setEndTime] = useState(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, now.getMinutes());
    return end;
  });
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [repeat, setRepeat] = useState('NONE');
  const [repeatEndDate, setRepeatEndDate] = useState(null);
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
  const [errors, setErrors] = useState({});

  const alarmOptions = {
    '5': { label: '5분 전', value: 5 },
    '10': { label: '10분 전', value: 10 },
    '30': { label: '30분 전', value: 30 },
    '60': { label: '1시간 전', value: 60 },
    '1440': { label: '하루 전', value: 1440 },
  };

  // selectedDate가 변경될 때 시작 시간 업데이트
  useEffect(() => {
    if (visible) {
      try {
        // selectedDate가 유효한지 확인
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
            } else {
              throw new Error('Invalid start time');
            }
          } else {
            throw new Error('Invalid date components');
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
            } else {
              throw new Error('Invalid current time');
            }
          } else {
            throw new Error('Invalid current date');
          }
        }
      } catch (error) {
        console.error('날짜 파싱 오류:', error);
        // 에러 발생 시 현재 시간으로 설정
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
        } catch (fallbackError) {
          console.error('폴백 날짜 설정도 실패:', fallbackError);
        }
      }
    }
  }, [selectedDate, visible]);

  const resetForm = () => {
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
    setErrors({});
  };

  const handleDismiss = () => {
    onDismiss();
    setTimeout(resetForm, 300);
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
      // 알람 시간 계산
      let alarmTime = null;
      if (alarmEnabled && alarmOffset) {
        const offsetMinutes = parseInt(alarmOffset);
        const alarmDateTime = new Date(startTime);
        alarmDateTime.setMinutes(alarmDateTime.getMinutes() - offsetMinutes);
        alarmTime = alarmDateTime.toISOString();
        
        console.log('🔔 알람 시간 계산:', {
          startTime: startTime.toLocaleString(),
          offsetMinutes: offsetMinutes,
          alarmTime: alarmDateTime.toLocaleString(),
          alarmTimeISO: alarmTime
        });
      }

      const newSchedule = {
        title: title.trim(),
        description: description.trim(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        categoryId,
        repeat,
        repeatEndDate: repeat !== 'NONE' ? repeatEndDate?.toISOString() : null,
        priority,
        alarmEnabled,
        alarmTime: alarmTime,
      };

      console.log('📅 새 일정 정보:', {
        title: newSchedule.title,
        startTime: newSchedule.startTime,
        alarmEnabled: newSchedule.alarmEnabled,
        alarmTime: newSchedule.alarmTime
      });

      await onAddSchedule(newSchedule);
      handleDismiss();
    } catch (error) {
      console.error('일정 추가 실패:', error);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
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

  const handleStartTimeChange = (event, selectedTime) => {
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

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (event.type !== 'dismissed' && selectedDate) {
      const newDate = new Date(endTime);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setEndTime(newDate);
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (event.type !== 'dismissed' && selectedTime) {
      const newDate = new Date(endTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setEndTime(newDate);
    }
  };

  const handleRepeatEndDateChange = (event, selectedDate) => {
    setShowRepeatEndDatePicker(false);
    if (event.type !== 'dismissed' && selectedDate) {
      setRepeatEndDate(selectedDate);
    }
  };



  return (
    <Dialog
      visible={visible}
      onDismiss={handleDismiss}
      style={styles.dialog}
    >
      <Dialog.Title style={styles.dialogTitle}>새 일정</Dialog.Title>
      <Dialog.Content>
        <ScrollView style={styles.dialogScrollView}>
          <View style={styles.inputContainer}>
            <TextInput
              label="제목"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: null }));
                }
              }}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#2C5282' } }}
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
              theme={{ colors: { primary: '#2C5282' } }}
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
             <Text style={styles.timeSectionTitle}>시작 시간</Text>
             <View style={styles.timeRow}>
               <TouchableOpacity
                 onPress={() => {
                   setShowStartDatePicker(true);
                   setShowStartTimePicker(false);
                 }}
                 style={styles.timeButtonContainer}
               >
                 <Button
                   mode="outlined"
                   style={styles.timeButton}
                   textColor="#2C5282"
                   iconColor="#2C5282"
                   icon="calendar"
                 >
                   {(() => {
                     try {
                       if (!startTime || isNaN(startTime.getTime())) {
                         return '날짜 선택';
                       }
                       const testDate = new Date(startTime);
                       if (isNaN(testDate.getTime())) {
                         return '날짜 선택';
                       }
                       return format(startTime, 'yyyy년 MM월 dd일');
                     } catch (error) {
                       console.error('시작 날짜 포맷 오류:', error);
                       return '날짜 선택';
                     }
                   })()}
                 </Button>
               </TouchableOpacity>

               <TouchableOpacity
                 onPress={() => {
                   setShowStartTimePicker(true);
                   setShowStartDatePicker(false);
                 }}
                 style={styles.timeButtonContainer}
               >
                 <Button
                   mode="outlined"
                   style={styles.timeButton}
                   textColor="#2C5282"
                   iconColor="#2C5282"
                   icon="clock"
                 >
                   {(() => {
                     try {
                       if (!startTime || isNaN(startTime.getTime())) {
                         return '시간 선택';
                       }
                       const testDate = new Date(startTime);
                       if (isNaN(testDate.getTime())) {
                         return '시간 선택';
                       }
                       return format(startTime, 'HH:mm');
                     } catch (error) {
                       console.error('시작 시간 포맷 오류:', error);
                       return '시간 선택';
                     }
                   })()}
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
                 style={styles.timeButtonContainer}
               >
                 <Button
                   mode="outlined"
                   style={styles.timeButton}
                   textColor="#2C5282"
                   iconColor="#2C5282"
                   icon="calendar"
                 >
                   {(() => {
                     try {
                       if (!endTime || isNaN(endTime.getTime())) {
                         return '날짜 선택';
                       }
                       const testDate = new Date(endTime);
                       if (isNaN(testDate.getTime())) {
                         return '날짜 선택';
                       }
                       return format(endTime, 'yyyy년 MM월 dd일');
                     } catch (error) {
                       console.error('종료 날짜 포맷 오류:', error);
                       return '날짜 선택';
                     }
                   })()}
                 </Button>
               </TouchableOpacity>

               <TouchableOpacity
                 onPress={() => {
                   setShowEndTimePicker(true);
                   setShowEndDatePicker(false);
                 }}
                 style={styles.timeButtonContainer}
               >
                 <Button
                   mode="outlined"
                   style={styles.timeButton}
                   textColor="#2C5282"
                   iconColor="#2C5282"
                   icon="clock"
                 >
                   {(() => {
                     try {
                       if (!endTime || isNaN(endTime.getTime())) {
                         return '시간 선택';
                       }
                       const testDate = new Date(endTime);
                       if (isNaN(testDate.getTime())) {
                         return '시간 선택';
                       }
                       return format(endTime, 'HH:mm');
                     } catch (error) {
                       console.error('종료 시간 포맷 오류:', error);
                       return '시간 선택';
                     }
                   })()}
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
              <Button
                mode="outlined"
                onPress={() => setShowRepeatEndDatePicker(true)}
                style={styles.repeatEndButton}
                textColor="#2C5282"
                icon="calendar-end"
              >
                                 {repeatEndDate ? (() => {
                   try {
                     if (!repeatEndDate || isNaN(repeatEndDate.getTime())) {
                       return '반복 종료일 설정';
                     }
                     // 날짜가 유효한지 추가 검사
                     const testDate = new Date(repeatEndDate);
                     if (isNaN(testDate.getTime())) {
                       return '반복 종료일 설정';
                     }
                     return format(repeatEndDate, 'yyyy년 MM월 dd일');
                   } catch (error) {
                     console.error('반복 종료일 포맷 오류:', error);
                     return '반복 종료일 설정';
                   }
                 })() : '반복 종료일 설정'}
              </Button>
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
        >
          취소
        </Button>
        <Button
          mode="contained"
          onPress={handleAddSchedule}
          style={[styles.dialogButton, styles.confirmButton]}
          buttonColor="#2C5282"
          textColor="#fff"
        >
          추가
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

      {showRepeatEndDatePicker && (
        <DateTimePicker
          value={repeatEndDate || new Date()}
          mode="date"
          onChange={handleRepeatEndDateChange}
          minimumDate={startTime}
        />
      )}


    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  dialogTitle: {
    color: '#2C5282',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  dialogScrollView: {
    maxHeight: 500,
  },
  dialogActions: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dialogButton: {
    minWidth: 100,
  },
  cancelButton: {
    borderColor: '#E2E8F0',
  },
  confirmButton: {
    backgroundColor: '#2C5282',
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    height: 56,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
     timeContainer: {
     marginVertical: 8,
   },
   timeSectionTitle: {
     fontSize: 14,
     fontWeight: '600',
     color: '#2C5282',
     marginBottom: 8,
     marginLeft: 4,
   },
   timeRow: {
     flexDirection: 'row',
     gap: 8,
     marginBottom: 4,
   },
   timeButtonContainer: {
     flex: 1,
   },
   timeButton: {
     borderColor: '#A5D8FF',
   },
  settingsContainer: {
    marginVertical: 12,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C5282',
    marginBottom: 8,
    marginLeft: 4,
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
  },
  divider: {
    marginVertical: 2,
    backgroundColor: '#E2E8F0',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
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
   },
   repeatEndContainer: {
     marginTop: 8,
   },
   repeatEndButton: {
     borderColor: '#2C5282',
     height: 40,
   },
  
});

export default AddScheduleDialog; 