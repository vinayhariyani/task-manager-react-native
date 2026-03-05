import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
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

      <Button title="Set Priority Low" onPress={() => setPriority('Low')} />
      <Button
        title="Set Priority Medium"
        onPress={() => setPriority('Medium')}
      />
      <Button title="Set Priority High" onPress={() => setPriority('High')} />

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
});
