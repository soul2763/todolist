import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Searchbar, Card, Text, Chip } from 'react-native-paper';
import { useSchedule } from '../context/ScheduleContext';
import { format, parseISO } from 'date-fns';
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
    if (!item) return null;
    
    const category = item.categoryId ? categories.find(c => c.id === item.categoryId) : null;
    
    try {
      const startDate = item.startTime ? parseISO(item.startTime) : null;
      const endDate = item.endTime ? parseISO(item.endTime) : null;
      
      if (!startDate || !endDate) return null;
      
      return (
        <TouchableOpacity
          style={styles.scheduleItem}
          onPress={() => navigation.navigate('ScheduleDetail', { scheduleId: item.id })}
        >
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleTitleContainer}>
              <View style={[styles.categoryDot, { backgroundColor: category?.color || '#A5D8FF' }]} />
              <Text style={styles.scheduleTitle}>{item.title || '제목 없음'}</Text>
            </View>
            {category && (
              <Chip
                style={[styles.categoryChip, { backgroundColor: category.color + '20' }]}
                textStyle={[styles.categoryChipText, { color: category.color || '#2C5282' }]}
              >
                {category.name}
              </Chip>
            )}
          </View>
          <Text style={styles.scheduleTime}>
            {format(startDate, 'yyyy년 MM월 dd일 HH:mm')} - {format(endDate, 'HH:mm')}
          </Text>
          {item.description && (
            <Text style={styles.scheduleDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('Error rendering schedule item:', error);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="일정 검색"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#2C5282"
          placeholderTextColor="#A5D8FF"
        />
      </View>

      <ScrollView style={styles.resultList}>
        {searchResults && searchResults.length > 0 ? (
          searchResults
            .filter(item => item !== null && item !== undefined)
            .map((item, index) => (
              <View key={item.id || index}>
                {renderScheduleItem({ item })}
              </View>
            ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? '검색 결과가 없습니다.' : '검색어를 입력해주세요.'}
            </Text>
            <Text style={styles.emptySubText}>
              {searchQuery
                ? '다른 검색어로 다시 시도해보세요.'
                : '일정 제목이나 설명으로 검색할 수 있습니다.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A5D8FF',
  },
  searchInput: {
    fontSize: 16,
    color: '#2C5282',
    backgroundColor: '#fff',
  },
  resultList: {
    flex: 1,
  },
  scheduleItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#A5D8FF',
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
    marginRight: 8,
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
    color: '#2C5282',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#A5D8FF',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    color: '#2C5282',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  categoryChip: {
    backgroundColor: '#A5D8FF20',
    borderColor: '#A5D8FF',
    borderWidth: 1,
  },
  categoryChipText: {
    color: '#2C5282',
  },
});

export default SearchScreen; 