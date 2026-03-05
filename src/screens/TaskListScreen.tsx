import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
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
      <Button
        title="Create Task"
        onPress={() => navigation.navigate('TaskForm')}
      />

      {/* filter Button */}
      <View style={styles.filterBtn}>
        <Button title="All" onPress={() => setFilter('ALL')} />
        <Button title="Completed" onPress={() => setFilter('COMPLETED')} />
        <Button title="Pending" onPress={() => setFilter('PENDING')} />
      </View>

      {/* Sorting btn */}
      <View style={styles.filterBtn}>
        <Button title="Sort by Created" onPress={() => setSortBy('CREATED')} />
        <Button title="Sort by Due Date" onPress={() => setSortBy('DUEDATE')} />
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
          <TouchableOpacity
            onPress={() => navigation.navigate('TaskForm', { task: item })}
          >
            <View style={styles.task}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>Priority: {item.priority}</Text>
              <Text>Status: {item.completed ? 'Done' : 'Pending'}</Text>

              <Button
                title="Toggle Complete"
                onPress={() => toggleComplete(item.id)}
              />

              <Button title="Delete Task" onPress={() => deleteTask(item.id)} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  task: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  filterBtn: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 10,
  },
});
