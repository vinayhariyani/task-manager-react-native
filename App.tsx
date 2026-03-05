import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TaskListScreen from './src/screens/TaskListScreen';
import TaskFormScreen from './src/services/TaskFormScreen';
import { startSyncListener } from './src/services/syncService';
import { useTaskStore } from './src/store/taskStore';
import { StyleSheet, Text } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const syncStatus = useTaskStore(state => state.syncStatus);

  useEffect(() => {
    startSyncListener();
  }, []);

  return (
    <>
      <Text style={styles.syncStatus}>Sync Status: {syncStatus}</Text>

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Tasks" component={TaskListScreen} />
          <Stack.Screen name="TaskForm" component={TaskFormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  syncStatus: {
    textAlign: 'center',
    padding: 10,
  },
});
