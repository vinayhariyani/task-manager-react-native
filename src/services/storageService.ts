import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const TASK_KEY = 'TASKS';

export const saveTasks = async (tasks: Task[]) => {
  try {
    await AsyncStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.log('Error saving tasks', error);
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(TASK_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('Error loading tasks', error);
    return [];
  }
};
