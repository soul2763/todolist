import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, IconButton, Portal, Dialog } from 'react-native-paper';
import { useSchedule } from '../context/ScheduleContext';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScheduleDetailScreen = ({ route, navigation }) => {
  const { scheduleId } = route.params;
  const { schedules, deleteSchedule, categories } = useSchedule();
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);

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
      <View style={styles.container}>
        <Text>일정을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteSchedule(scheduleId);
      navigation.goBack();
    } catch (error) {
      console.error('일정 삭제 실패:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text style={styles.title}>{schedule.title}</Text>
              {category && (
                <View style={[styles.categoryTag, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>시작 시간</Text>
              <Text style={styles.value}>
                {format(new Date(schedule.startTime), 'yyyy년 MM월 dd일 HH:mm')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>종료 시간</Text>
              <Text style={styles.value}>
                {format(new Date(schedule.endTime), 'yyyy년 MM월 dd일 HH:mm')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>설명</Text>
              <Text style={styles.description}>{schedule.description}</Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => setDeleteDialogVisible(true)}
          style={styles.deleteButton}
          buttonColor="#FF5252"
        >
          일정 삭제
        </Button>
      </ScrollView>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>일정 삭제</Dialog.Title>
          <Dialog.Content>
            <Text>이 일정을 삭제하시겠습니까?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>취소</Button>
            <Button onPress={handleDelete} textColor="#FF5252">삭제</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  deleteButton: {
    margin: 16,
  },
});

export default ScheduleDetailScreen; 