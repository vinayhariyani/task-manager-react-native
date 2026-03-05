import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types/task';

export default function TaskFormScreen({ navigation, route }: any) {
  const { addTask, updateTask } = useTaskStore();

  const existingTask = route?.params?.task;

  const [title, setTitle] = useState(existingTask?.title || '');
  const [priority, setPriority] = useState(existingTask?.priority || 'Medium');

  const handleSave = () => {
    const task: Task = {
      id: existingTask?.id || Date.now().toString(),
      title,
      description: '',
      priority,
      dueDate: new Date().toISOString(),
      completed: existingTask?.completed || false,
      createdAt: existingTask?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingTask) {
      updateTask(task);
    } else {
      addTask(task);
    }

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.priorityButton, priority === 'Low' && styles.priorityLow]}
        onPress={() => setPriority('Low')}
      >
        <Text style={styles.priorityText}>Low</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.priorityButton, priority === 'Medium' && styles.priorityMedium]}
        onPress={() => setPriority('Medium')}
      >
        <Text style={styles.priorityText}>Medium</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.priorityButton, priority === 'High' && styles.priorityHigh]}
        onPress={() => setPriority('High')}
      >
        <Text style={styles.priorityText}>High</Text>
      </TouchableOpacity>

      <Button title="Save Task" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  priorityButton: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 16,
    fontWeight: '600',
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
});
