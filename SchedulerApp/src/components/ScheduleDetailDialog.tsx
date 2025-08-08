import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Dialog, Button, Chip, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, parseISO } from 'date-fns';
import { HomeScreenStyles } from '../styles/HomeScreenStyles';

type Schedule = {
  id: string;
  title: string;
  description?: string | null;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  categoryId: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  isCompleted?: boolean;
};

type Category = { id: string; name: string; color: string };

type PriorityOptions = Record<string, { label: string; color: string }>;

type Props = {
  visible: boolean;
  onDismiss: () => void;
  schedule: Schedule | null;
  categories: Category[];
  priorityOptions: PriorityOptions;
  onEdit: (scheduleId: string) => void;
  onComplete: (scheduleId: string) => void;
};

const ScheduleDetailDialog: React.FC<Props> = ({
  visible,
  onDismiss,
  schedule,
  categories,
  priorityOptions,
  onEdit,
  onComplete,
}) => {
  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      style={{
        backgroundColor: 'transparent',
        elevation: 0,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
      }}
      theme={{ colors: { backdrop: 'transparent' } }}
    >
      {schedule && (
        <View style={HomeScreenStyles.scheduleDetailDialogContainer}>
          <View style={HomeScreenStyles.scheduleDetailHeader}>
            <View style={HomeScreenStyles.scheduleDetailHeaderContent}>
              <View style={HomeScreenStyles.scheduleDetailHeaderLeft}>
                <View
                  style={[
                    HomeScreenStyles.scheduleDetailCategoryDot,
                    { backgroundColor: categories.find(c => c.id === schedule.categoryId)?.color || '#A5D8FF' },
                  ]}
                />
                <Text style={HomeScreenStyles.scheduleDetailTitle}>{schedule.title}</Text>
              </View>
              <IconButton
                icon="check-circle-outline"
                size={24}
                iconColor={schedule.isCompleted ? '#81C784' : '#A5D8FF'}
                disabled={!!schedule.isCompleted}
                style={[
                  HomeScreenStyles.scheduleDetailCompleteButton,
                  schedule.isCompleted && {
                    backgroundColor: '#81C784' + '20',
                    opacity: 0.7,
                  },
                ]}
                onPress={schedule.isCompleted ? undefined : () => onComplete(schedule.id)}
              />
            </View>
          </View>

          <View style={HomeScreenStyles.scheduleDetailBody}>
            <ScrollView style={HomeScreenStyles.scheduleDetailScrollView} showsVerticalScrollIndicator={false}>
              <View style={HomeScreenStyles.scheduleDetailChipsSection}>
                {categories.find(c => c.id === schedule.categoryId) && (
                  <Chip
                    style={[
                      HomeScreenStyles.scheduleDetailChip,
                      { backgroundColor: (categories.find(c => c.id === schedule.categoryId)?.color || '#A5D8FF') + '20' },
                    ]}
                    textStyle={[
                      HomeScreenStyles.scheduleDetailChipText,
                      { color: categories.find(c => c.id === schedule.categoryId)?.color || '#2C5282' },
                    ]}
                  >
                    {categories.find(c => c.id === schedule.categoryId)?.name}
                  </Chip>
                )}
                {schedule.isCompleted && (
                  <Chip
                    style={[
                      HomeScreenStyles.scheduleDetailChip,
                      { backgroundColor: '#81C784' + '20', borderColor: '#81C784', borderWidth: 1 },
                    ]}
                    textStyle={[HomeScreenStyles.scheduleDetailChipText, { color: '#81C784' }]}
                    icon="check-circle"
                  >
                    완료됨
                  </Chip>
                )}
                {schedule.priority && schedule.priority !== 'LOW' && (
                  <Chip
                    style={[
                      HomeScreenStyles.scheduleDetailChip,
                      { backgroundColor: (priorityOptions[schedule.priority]?.color || '#FFA500') + '20' },
                    ]}
                    textStyle={[
                      HomeScreenStyles.scheduleDetailChipText,
                      { color: priorityOptions[schedule.priority]?.color || '#FFA500' },
                    ]}
                  >
                    {priorityOptions[schedule.priority]?.label} 우선순위
                  </Chip>
                )}
              </View>

              <View style={HomeScreenStyles.scheduleDetailTimeSection}>
                <View style={HomeScreenStyles.scheduleDetailTimeHeader}>
                  <Icon name="clock-outline" size={18} color="#2C5282" style={HomeScreenStyles.scheduleDetailTimeIcon} />
                  <Text style={HomeScreenStyles.scheduleDetailTimeLabel}>일정 시간</Text>
                </View>
                <Text style={HomeScreenStyles.scheduleDetailTimeText}>
                  {(() => {
                    try {
                      const startDate = parseISO(schedule.startTime);
                      const endDate = parseISO(schedule.endTime);
                      const isSameDay =
                        startDate.getFullYear() === endDate.getFullYear() &&
                        startDate.getMonth() === endDate.getMonth() &&
                        startDate.getDate() === endDate.getDate();
                      if (isSameDay) {
                        return `${format(startDate, 'yyyy년 MM월 dd일')} ${format(startDate, 'HH:mm')} ~ ${format(endDate, 'HH:mm')}`;
                      } else {
                        return `${format(startDate, 'yyyy년 MM월 dd일 HH:mm')} ~ ${format(endDate, 'yyyy년 MM월 dd일 HH:mm')}`;
                      }
                    } catch (error) {
                      return '날짜 정보를 불러올 수 없습니다';
                    }
                  })()}
                </Text>
              </View>

              {schedule.description && (
                <View style={HomeScreenStyles.scheduleDetailDescriptionSection}>
                  <Text style={HomeScreenStyles.scheduleDetailDescriptionLabel}>설명</Text>
                  <Text style={HomeScreenStyles.scheduleDetailDescriptionText}>{schedule.description}</Text>
                </View>
              )}
            </ScrollView>
          </View>

          <View style={HomeScreenStyles.scheduleDetailFooter}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              style={[HomeScreenStyles.scheduleDetailButton, HomeScreenStyles.scheduleDetailCancelButton]}
              textColor="#718096"
            >
              닫기
            </Button>
            {!schedule.isCompleted && (
              <Button
                mode="contained"
                onPress={() => onEdit(schedule.id)}
                style={[HomeScreenStyles.scheduleDetailButton, HomeScreenStyles.scheduleDetailEditButton]}
                buttonColor="#2C5282"
                textColor="#fff"
                icon="pencil"
              >
                수정
              </Button>
            )}
          </View>
        </View>
      )}
    </Dialog>
  );
};

export default ScheduleDetailDialog;


