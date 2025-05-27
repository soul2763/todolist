import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Card, Text, Chip } from 'react-native-paper';
import { useSchedule } from '../context/ScheduleContext';
import { format } from 'date-fns';
import { SafeAreaView } from 'react-native-safe-area-context';
import { debounce } from 'lodash';

const SearchScreen = ({ navigation }) => {
  const { searchSchedules, categories } = useSchedule();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      const results = searchSchedules(query);
      setSearchResults(results);
    }, 300),
    []
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const renderScheduleItem = ({ item }) => {
    const category = categories.find(c => c.id === item.categoryId);
    
    return (
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('ScheduleDetail', { scheduleId: item.id })}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            {category && (
              <Chip
                style={[styles.categoryChip, { backgroundColor: category.color + '20' }]}
                textStyle={{ color: category.color }}
              >
                {category.name}
              </Chip>
            )}
          </View>
          
          <Text style={styles.date}>
            {format(new Date(item.startTime), 'yyyy년 MM월 dd일 HH:mm')} ~
            {format(new Date(item.endTime), ' HH:mm')}
          </Text>
          
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="일정 검색"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <FlatList
        data={searchResults}
        renderItem={renderScheduleItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? '검색 결과가 없습니다.' : '검색어를 입력해주세요.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    elevation: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  categoryChip: {
    marginLeft: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default SearchScreen; 