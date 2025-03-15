export type TaskStatus = 'todo' | 'inProgress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  categoryId?: string;
  progress: number; // 0-100
  subtasks?: Subtask[];
};

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  progress: number; // 0-100
  tasks: Task[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type NavigationParams = {
  // Tab Navigation
  Home: undefined;
  TasksTab: undefined;
  ProjectsTab: undefined;
  Analytics: undefined;
  Settings: undefined;
  
  // Stack Navigation
  Tasks: undefined;
  TaskDetail: { taskId: string };
  AddTask: undefined;
  EditTask: { taskId: string };
  Projects: undefined;
  ProjectDetail: { projectId: string };
  AddProject: undefined;
  EditProject: { projectId: string };
}; 