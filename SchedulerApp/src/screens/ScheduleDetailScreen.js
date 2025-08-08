import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, IconButton, Portal, Dialog, Chip, Icon } from 'react-native-paper';
import { useSchedule } from '../context/ScheduleContext';
import { format, parseISO } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ScheduleDetailScreen = ({ route, navigation }) => {
  const { scheduleId } = route.params;
  const { schedules, deleteSchedule, categories, updateSchedule, completedStatus } = useSchedule();
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
  const [completeDialogVisible, setCompleteDialogVisible] = React.useState(false);

  const schedule = schedules.find(s => s.id === scheduleId);
  const category = categories.find(c => c.id === schedule?.categoryId);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="pencil"
          onPress={() => navigation.navigate('EditSchedule', { scheduleId })}
        />
      ),
    });
  }, [navigation, scheduleId]);

  if (!schedule) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#2C5282', fontSize: 16 }}>일정을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const startDate = parseISO(schedule.startTime);
  const endDate = parseISO(schedule.endTime);

  // 날짜 표시 형식 결정
  const getTimeDisplay = () => {
    try {
      // 같은 날인지 확인 (년, 월, 일이 동일한지)
      const isSameDay = (
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate()
      );

      if (isSameDay) {
        // 하루 일정: 날짜 + 시작시간 ~ 종료시간
        return `${format(startDate, 'yyyy년 MM월 dd일')} ${format(startDate, 'HH:mm')} ~ ${format(endDate, 'HH:mm')}`;
      } else {
        // 여러 날 일정: 시작날짜시간 ~ 종료날짜시간
        return `${format(startDate, 'yyyy년 MM월 dd일 HH:mm')} ~ ${format(endDate, 'yyyy년 MM월 dd일 HH:mm')}`;
      }
    } catch (error) {
      console.error('날짜 포맷 오류:', error);
      return '날짜 정보를 불러올 수 없습니다';
    }
  };

  const handleDelete = () => {
    setDeleteDialogVisible(true);
  };

  const handleConfirmDelete = () => {
    deleteSchedule(scheduleId);
    navigation.goBack();
  };

  const handleCancelDelete = () => {
    setDeleteDialogVisible(false);
  };

  const handleToggleComplete = async () => {
    if (schedule.isCompleted) {
      // 이미 완료된 상태면 바로 토글
      try {
        await updateSchedule(scheduleId, {
          isCompleted: false
        });
      } catch (error) {
        console.error('완료 상태 변경 실패:', error);
      }
    } else {
      // 미완료 상태면 확인 다이얼로그 표시
      setCompleteDialogVisible(true);
    }
  };

  const handleConfirmComplete = async () => {
    try {
      await updateSchedule(scheduleId, {
        isCompleted: true
      });
      setCompleteDialogVisible(false);
    } catch (error) {
      console.error('완료 상태 변경 실패:', error);
    }
  };

  const handleCancelComplete = () => {
    setCompleteDialogVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Card style={styles.card}>
            <Card.Content style={styles.header}>
              <View style={styles.titleContainer}>
                <View style={styles.titleLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: category?.color || '#A5D8FF' }]} />
                  <Text style={styles.title}>{schedule.title}</Text>
                </View>
                <IconButton
                  icon={completedStatus.icon}
                  size={24}
                  iconColor={schedule.isCompleted ? completedStatus.color : '#A5D8FF'}
                  style={[
                    styles.completeButton,
                    schedule.isCompleted && { backgroundColor: completedStatus.color + '20' }
                  ]}
                  onPress={handleToggleComplete}
                />
              </View>
              {category && (
                <Chip
                  style={[styles.categoryChip, { backgroundColor: category.color + '20' }]}
                  textStyle={[styles.categoryChipText, { color: category.color }]}
                >
                  {category.name}
                </Chip>
              )}
            </Card.Content>

            <Card.Content style={styles.content}>
              <View style={styles.timeContainer}>
                <Icon source="clock-outline" size={20} color="#2C5282" style={styles.timeIcon} />
                <Text style={styles.timeText}>
                  {getTimeDisplay()}
                </Text>
              </View>

              {schedule.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionLabel}>설명</Text>
                  <Text style={styles.description}>{schedule.description}</Text>
                </View>
              )}
            </Card.Content>
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={[styles.button, styles.editButton]}
              onPress={() => navigation.navigate('EditSchedule', { scheduleId: schedule.id })}
              contentStyle={styles.buttonContent}
              labelStyle={[styles.buttonLabel, styles.editButtonLabel]}
              icon={({ size, color }) => (
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={16}
                  color="#2C5282"
                  style={styles.buttonIcon}
                />
              )}
            >
              수정하기
            </Button>
            <Button
              mode="outlined"
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              contentStyle={styles.buttonContent}
              labelStyle={[styles.buttonLabel, styles.deleteButtonLabel]}
              icon={({ size, color }) => (
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={16}
                  color="#E53E3E"
                  style={styles.buttonIcon}
                />
              )}
            >
              삭제하기
            </Button>
          </View>
        </View>
      </ScrollView>

      <Portal>
        <Dialog
          visible={completeDialogVisible}
          dismissable={false}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>일정 완료</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              이 일정을 완료 처리하시겠습니까?
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="outlined"
              onPress={handleCancelComplete}
              style={[styles.dialogButton, styles.cancelButton]}
              textColor="#718096"
            >
              취소
            </Button>
            <Button
              mode="contained"
              onPress={handleConfirmComplete}
              style={[styles.dialogButton, styles.confirmButton]}
              buttonColor="#2C5282"
              textColor="#fff"
            >
              완료
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={deleteDialogVisible}
          dismissable={false}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>일정 삭제</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              이 일정을 삭제하시겠습니까?
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="outlined"
              onPress={handleCancelDelete}
              style={[styles.dialogButton, styles.cancelButton]}
              textColor="#718096"
            >
              취소
            </Button>
            <Button
              mode="contained"
              onPress={handleConfirmDelete}
              style={[styles.dialogButton, styles.deleteConfirmButton]}
              buttonColor="#E53E3E"
              textColor="#fff"
            >
              삭제
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#A5D8FF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C5282',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryChip: {
    backgroundColor: '#A5D8FF20',
    borderColor: '#A5D8FF',
    borderWidth: 1,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  categoryChipText: {
    color: '#2C5282',
  },
  content: {
    padding: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeIcon: {
    marginRight: 8,
    color: '#2C5282',
  },
  timeText: {
    fontSize: 16,
    color: '#2C5282',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionLabel: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#2C5282',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 12,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  completeButton: {
    margin: 0,
    backgroundColor: 'transparent',
  },
  editButton: {
    backgroundColor: '#A5D8FF',
    borderWidth: 1,
    borderColor: '#2C5282',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E53E3E',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  editButtonLabel: {
    color: '#2C5282',
  },
  deleteButtonLabel: {
    color: '#E53E3E',
  },
  buttonIcon: {
    marginRight: 4,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  dialogTitle: {
    color: '#2C5282',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dialogText: {
    color: '#2C5282',
    fontSize: 16,
    lineHeight: 24,
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
    marginLeft: 8,
    backgroundColor: '#2C5282',
  },
  deleteConfirmButton: {
    marginLeft: 8,
    backgroundColor: '#E53E3E',
  },
});

export default ScheduleDetailScreen; 