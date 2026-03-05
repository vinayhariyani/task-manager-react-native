import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TaskListScreen from './src/screens/TaskListScreen';
import TaskFormScreen from './src/screens/TaskFormScreen';
import { startSyncListener } from './src/services/syncService';
import { useTaskStore } from './src/store/taskStore';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  const syncStatus = useTaskStore(state => state.syncStatus);

  useEffect(() => {
    startSyncListener();
  }, []);

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.syncContainer}>
        <Text style={styles.syncLabel}>Sync:</Text>
        <View
          style={[
            styles.syncIndicator,
            syncStatus === 'synced' && styles.syncSuccess,
            syncStatus === 'syncing' && styles.syncPending,
            syncStatus === 'offline' && styles.syncError,
          ]}
        >
          <Text style={styles.syncStatus}>{syncStatus}</Text>
        </View>
      </View>

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2196f3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen
            name="Tasks"
            component={TaskListScreen}
            options={{ title: 'My Tasks' }}
          />
          <Stack.Screen
            name="TaskForm"
            component={TaskFormScreen}
            options={{ title: 'Task Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2196f3',
  },
  syncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#1976d2',
    gap: 8,
  },
  syncLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  syncIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#757575',
  },
  syncSuccess: {
    backgroundColor: '#4caf50',
  },
  syncPending: {
    backgroundColor: '#ff9800',
  },
  syncError: {
    backgroundColor: '#f44336',
  },
  syncStatus: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
