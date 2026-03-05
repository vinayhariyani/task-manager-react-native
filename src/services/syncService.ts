import NetInfo from '@react-native-community/netinfo';
import { useTaskStore } from '../store/taskStore';

export const startSyncListener = () => {
  NetInfo.addEventListener(async state => {
    // gives either device is offline or has network
    const { syncQueue, clearSyncQueue, setSyncStatus } =
      useTaskStore.getState();

    if (!state.isConnected) {
      setSyncStatus('offline');
      return;
    }

    if (syncQueue.length === 0) {
      setSyncStatus('synced');
      return;
    }

    setSyncStatus('syncing');

    for (const operation of syncQueue) {
      await mockApiCall(operation);
    }

    clearSyncQueue(); // clear sync Queue after synching the data to server/mockapi
    setSyncStatus('synced');
  });
};

const mockApiCall = async (operation: any, retries = 3) => {
  try {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Synced operation:', operation.type);
        resolve(true);
      }, 500);
    });
  } catch (error) {
    if (retries > 0) {
      console.log('Retrying sync...');
      return mockApiCall(operation, retries - 1);
    }
    throw error;
  }
};
