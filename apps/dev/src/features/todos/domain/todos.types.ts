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
  tasks: Task[];
}

export type Status = 'to-do' | 'in-progress' | 'completed';

export type PostTask = Omit<TextTrackList, 'createdAt' | 'id' | 'updatedAt'>;

export type PutTask = Omit<TextTrackList, 'createdAt' | 'updatedAt'>;
