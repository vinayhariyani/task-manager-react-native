import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types/task';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Tasks: undefined;
  TaskForm: { task?: Task } | undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TaskListScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  const [sortBy, setSortBy] = useState<'CREATED' | 'DUEDATE'>('CREATED');

  const { tasks, toggleComplete, deleteTask, loadTasksFromStorage } =
    useTaskStore();

  useEffect(() => {
    loadTasksFromStorage();
  }, [loadTasksFromStorage]);

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'COMPLETED') return task.completed;
      if (filter === 'PENDING') return !task.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'CREATED') {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === 'DUEDATE') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('TaskForm')}
      >
        <Text style={styles.createButtonText}>+ Create Task</Text>
      </TouchableOpacity>

      {/* filter Button */}
      <View style={styles.filterBtn}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'ALL' && styles.filterActive]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'COMPLETED' && styles.filterActive,
          ]}
          onPress={() => setFilter('COMPLETED')}
        >
          <Text style={styles.filterText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'PENDING' && styles.filterActive,
          ]}
          onPress={() => setFilter('PENDING')}
        >
          <Text style={styles.filterText}>Pending</Text>
        </TouchableOpacity>
      </View>

      {/* Sorting btn */}
      <View style={styles.filterBtn}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'CREATED' && styles.sortActive]}
          onPress={() => setSortBy('CREATED')}
        >
          <Text style={styles.sortText}>Created</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'DUEDATE' && styles.sortActive]}
          onPress={() => setSortBy('DUEDATE')}
        >
          <Text style={styles.sortText}>Due Date</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        // Performance props
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet</Text>}
        renderItem={({ item }) => (
          <View style={[styles.task, item.completed && styles.taskCompleted]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TaskForm', { task: item })}
              style={styles.taskContent}
            >
              <Text
                style={[styles.title, item.completed && styles.titleCompleted]}
              >
                {item.title}
              </Text>
              <View style={styles.taskInfo}>
                <View
                  style={[
                    styles.priorityBadge,
                    item.priority === 'Low' && styles.priorityLow,
                    item.priority === 'Medium' && styles.priorityMedium,
                    item.priority === 'High' && styles.priorityHigh,
                  ]}
                >
                  <Text style={styles.priorityText}>{item.priority}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    item.completed
                      ? styles.statusCompleted
                      : styles.statusPending,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.completed ? 'Done' : 'Pending'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.taskActions}>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => toggleComplete(item.id)}
              >
                <Text style={styles.toggleButtonText}>✓</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  createButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterBtn: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: '#2196f3',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  sortActive: {
    backgroundColor: '#9c27b0',
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
  },
  task: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskCompleted: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
  taskContent: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskInfo: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityLow: {
    backgroundColor: '#4caf50',
  },
  priorityMedium: {
    backgroundColor: '#ff9800',
  },
  priorityHigh: {
    backgroundColor: '#f44336',
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#4caf50',
  },
  statusPending: {
    backgroundColor: '#ff9800',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
});
