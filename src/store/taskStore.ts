import { create } from 'zustand';
import { Task } from '../types/task';
import { saveTasks, loadTasks } from '../services/storageService';
import { SyncOperation } from '../types/sync';

interface TaskState {
  tasks: Task[];
  syncQueue: SyncOperation[];

  syncStatus: 'idle' | 'syncing' | 'synced' | 'offline';

  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;

  loadTasksFromStorage: () => Promise<void>;

  addToSyncQueue: (operation: SyncOperation) => void;
  clearSyncQueue: () => void;

  setSyncStatus: (status: 'idle' | 'syncing' | 'synced' | 'offline') => void;
}

export const useTaskStore = create<TaskState>(set => ({
  tasks: [],
  syncQueue: [],
  syncStatus: 'idle',

  addTask: task =>
    set(state => {
      // we gets task from user Interaction
      const updatedTasks = [...state.tasks, task]; // we update state in Zustand
      saveTasks(updatedTasks); // we save it to storage
      return {
        tasks: updatedTasks,
        syncQueue: [
          // we add operation to sync queue
          ...state.syncQueue,
          { type: 'CREATE', taskId: task.id, task }, // we create operation and add to queue
        ],
      };
    }),

  updateTask: updatedTask =>
    set(state => {
      const updatedTasks = state.tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task,
      );
      saveTasks(updatedTasks);
      return {
        tasks: updatedTasks,
        syncQueue: [
          ...state.syncQueue,
          { type: 'UPDATE', taskId: updatedTask.id, task: updatedTask },
        ],
      };
    }),

  deleteTask: id =>
    set(state => {
      const updatedTasks = state.tasks.filter(task => task.id !== id);
      saveTasks(updatedTasks);
      return {
        tasks: updatedTasks,
        syncQueue: [...state.syncQueue, { type: 'DELETE', taskId: id }],
      };
    }),

  toggleComplete: id =>
    set(state => {
      const updatedTasks = state.tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      );
      const updatedTask = updatedTasks.find(task => task.id === id);
      saveTasks(updatedTasks);
      return {
        tasks: updatedTasks,
        syncQueue: [
          ...state.syncQueue,
          { type: 'UPDATE', taskId: id, task: updatedTask },
        ],
      };
    }),

  loadTasksFromStorage: async () => {
    const tasks = await loadTasks();
    set({ tasks });
  },

  addToSyncQueue: operation =>
    set(state => ({
      syncQueue: [...state.syncQueue, operation],
    })),

  clearSyncQueue: () => set({ syncQueue: [] }),
  setSyncStatus: status => set({ syncStatus: status }),
}));
