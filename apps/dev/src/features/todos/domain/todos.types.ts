export interface Task {
  createdAt: number;
  id: string;
  removing?: boolean;
  status: Status;
  text: string;
  updatedAt: number | null;
}

export interface TodosState {
  draggingTaskId?: string;
  hoveringState: { ndx: number; status: Status } | null;
}

export type Status = 'to-do' | 'in-progress' | 'completed';

export type PostTask = Omit<Task, 'createdAt' | 'id' | 'updatedAt'>;

export type PutTask = Omit<Task, 'createdAt' | 'updatedAt'>;
