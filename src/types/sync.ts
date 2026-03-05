export type SyncOperationType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface SyncOperation {
  type: SyncOperationType;
  taskId: string;
  task?: any;
}
