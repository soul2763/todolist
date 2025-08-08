import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ScheduleDetailScreen from '../screens/ScheduleDetailScreen';
import EditScheduleScreen from '../screens/EditScheduleScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: '일정 관리',
            headerStyle: {
              backgroundColor: '#A5D8FF',
            },
            headerTintColor: '#2C5282',
          }}
        />
        <Stack.Screen
          name="ScheduleDetail"
          component={ScheduleDetailScreen}
          options={{
            title: '일정 상세',
            headerStyle: {
              backgroundColor: '#A5D8FF',
            },
            headerTintColor: '#2C5282',
          }}
        />
        <Stack.Screen
          name="EditSchedule"
          component={EditScheduleScreen}
          options={{
            title: '일정 수정',
            headerStyle: {
              backgroundColor: '#A5D8FF',
            },
            headerTintColor: '#2C5282',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 