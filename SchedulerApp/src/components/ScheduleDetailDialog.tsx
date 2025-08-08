import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Dialog, Button, Chip, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, parseISO } from 'date-fns';
import { Schedule, Category, PriorityOptions } from '../types';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  schedule: Schedule | null;
  categories: Category[];
  priorityOptions: PriorityOptions;
  onEdit: (scheduleId: string) => void;
  onComplete: (scheduleId: string) => void;
};

// Header 컴포넌트
const DialogHeader: React.FC<{ schedule: Schedule; categories: Category[]; onComplete: (scheduleId: string) => void }> = ({
  schedule,
  categories,
  onComplete,
}) => (
  <View style={{
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  }}>
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
      }}>
        <View
          style={{
            backgroundColor: categories.find(c => c.id === schedule.categoryId)?.color || '#A5D8FF',
            width: 12,
            height: 12,
            borderRadius: 6,
            marginRight: 12,
          }}
        />
        <Text style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#1A202C',
          lineHeight: 24,
          flex: 1,
        }}>{schedule.title}</Text>
      </View>
      <IconButton
        icon={schedule.isCompleted ? "check-circle" : "check-circle-outline"}
        size={24}
        iconColor={schedule.isCompleted ? '#81C784' : '#2C5282'}
        disabled={!!schedule.isCompleted}
        style={{
          backgroundColor: schedule.isCompleted ? '#81C784' + '20' : '#2C5282' + '10',
          borderRadius: 16,
          margin: 0,
          padding: 6,
        }}
        onPress={schedule.isCompleted ? undefined : () => onComplete(schedule.id || '')}
      />
    </View>
  </View>
);

// Body 컴포넌트
const DialogBody: React.FC<{ schedule: Schedule; categories: Category[]; priorityOptions: PriorityOptions }> = ({
  schedule,
  categories,
  priorityOptions,
}) => (
  <Dialog.Content style={{ padding: 0 }}>
    <ScrollView 
      style={{
        maxHeight: 500,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Chips Section */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
      }}>
        {categories.find(c => c.id === schedule.categoryId) && (
          <Chip
            style={{
              backgroundColor: (categories.find(c => c.id === schedule.categoryId)?.color || '#A5D8FF') + '20',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
            textStyle={{
              color: categories.find(c => c.id === schedule.categoryId)?.color || '#2C5282',
              fontSize: 13,
              fontWeight: '600',
            }}
          >
            {categories.find(c => c.id === schedule.categoryId)?.name}
          </Chip>
        )}
        {schedule.isCompleted && (
          <Chip
            style={{
              backgroundColor: '#81C784' + '20',
              borderColor: '#81C784',
              borderWidth: 1,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
            textStyle={{
              color: '#81C784',
              fontSize: 13,
              fontWeight: '600',
            }}
            icon="check-circle"
          >
            완료됨
          </Chip>
        )}
        {schedule.priority && schedule.priority !== 'LOW' && (
          <Chip
            style={{
              backgroundColor: (priorityOptions[schedule.priority]?.color || '#FFA500') + '20',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
            textStyle={{
              color: priorityOptions[schedule.priority]?.color || '#FFA500',
              fontSize: 13,
              fontWeight: '600',
            }}
          >
            {priorityOptions[schedule.priority]?.label} 우선순위
          </Chip>
        )}
      </View>

      {/* Time Section */}
      <View style={{
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <Icon name="clock-outline" size={20} color="#2C5282" style={{ marginRight: 8 }} />
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#2C5282',
          }}>일정 시간</Text>
        </View>
        <Text style={{
          fontSize: 15,
          color: '#4A5568',
          lineHeight: 22,
          fontWeight: '500',
        }}>
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

      {/* Description Section */}
      {schedule.description && (
        <View style={{
          backgroundColor: '#F8FAFC',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          minHeight: 120,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#2C5282',
            marginBottom: 16,
          }}>설명</Text>
          <Text style={{
            fontSize: 15,
            color: '#4A5568',
            lineHeight: 24,
            fontWeight: '400',
          }}>{schedule.description}</Text>
        </View>
      )}
    </ScrollView>
  </Dialog.Content>
);

// Footer 컴포넌트
const DialogFooter: React.FC<{ schedule: Schedule; onDismiss: () => void; onEdit: (scheduleId: string) => void }> = ({
  schedule,
  onDismiss,
  onEdit,
}) => (
  <Dialog.Actions style={{
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  }}>
    <Button
      mode="outlined"
      onPress={onDismiss}
      style={{
        minWidth: 120,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderColor: '#E2E8F0',
        backgroundColor: '#fff',
      }}
      textColor="#64748B"
      labelStyle={{
        fontSize: 14,
        fontWeight: '600',
      }}
    >
      닫기
    </Button>
    {!schedule.isCompleted && (
      <Button
        mode="contained"
        onPress={() => onEdit(schedule.id || '')}
        style={{
          minWidth: 120,
          borderRadius: 8,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          backgroundColor: '#2C5282',
        }}
        textColor="#fff"
        icon="pencil"
        labelStyle={{
          fontSize: 14,
          fontWeight: '600',
        }}
      >
        수정
      </Button>
    )}
  </Dialog.Actions>
);

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
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      }}
      theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.5)' } }}
    >
      {schedule && (
        <DialogHeader 
          schedule={schedule} 
          categories={categories} 
          onComplete={onComplete} 
        />
      )}
      {schedule && (
        <DialogBody 
          schedule={schedule} 
          categories={categories} 
          priorityOptions={priorityOptions} 
        />
      )}
      {schedule && (
        <DialogFooter 
          schedule={schedule} 
          onDismiss={onDismiss} 
          onEdit={onEdit} 
        />
      )}
    </Dialog>
  );
};

export default ScheduleDetailDialog;
