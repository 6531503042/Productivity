import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getTasks, 
  getCategories, 
  createTask, 
  updateTask, 
  deleteTask,
  getSubtasksByTaskId,
  createSubtask,
  updateSubtask,
  deleteSubtask
} from '../services/firestore';
import { Task, TaskCategory, Subtask } from '../types';
import { useFirebase } from './FirebaseContext';

interface TaskContextType {
  tasks: Task[];
  categories: TaskCategory[];
  loading: boolean;
  error: Error | null;
  refreshTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<string>;
  editTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  getTaskSubtasks: (taskId: string) => Promise<Subtask[]>;
  addSubtask: (subtask: Omit<Subtask, 'id'>) => Promise<string>;
  toggleSubtask: (subtask: Subtask) => Promise<void>;
  removeSubtask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  categories: [],
  loading: true,
  error: null,
  refreshTasks: async () => {},
  addTask: async () => '',
  editTask: async () => {},
  removeTask: async () => {},
  getTaskSubtasks: async () => [],
  addSubtask: async () => '',
  toggleSubtask: async () => {},
  removeSubtask: async () => {},
});

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useFirebase();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksData, categoriesData] = await Promise.all([
        getTasks(),
        getCategories(),
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const refreshTasks = async () => {
    await fetchData();
  };

  const addTask = async (task: Omit<Task, 'id'>): Promise<string> => {
    try {
      const taskId = await createTask(task);
      await refreshTasks();
      return taskId;
    } catch (err) {
      setError(err as Error);
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const editTask = async (task: Task): Promise<void> => {
    try {
      await updateTask(task);
      await refreshTasks();
    } catch (err) {
      setError(err as Error);
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const removeTask = async (id: string): Promise<void> => {
    try {
      await deleteTask(id);
      await refreshTasks();
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  const getTaskSubtasks = async (taskId: string): Promise<Subtask[]> => {
    try {
      return await getSubtasksByTaskId(taskId);
    } catch (err) {
      setError(err as Error);
      console.error('Error getting subtasks:', err);
      throw err;
    }
  };

  const addSubtask = async (subtask: Omit<Subtask, 'id'>): Promise<string> => {
    try {
      const subtaskId = await createSubtask(subtask);
      return subtaskId;
    } catch (err) {
      setError(err as Error);
      console.error('Error adding subtask:', err);
      throw err;
    }
  };

  const toggleSubtask = async (subtask: Subtask): Promise<void> => {
    try {
      await updateSubtask({
        ...subtask,
        completed: !subtask.completed,
      });
      
      // Update task progress
      const taskSubtasks = await getSubtasksByTaskId(subtask.taskId);
      const completedCount = taskSubtasks.filter(st => st.completed).length;
      const progress = taskSubtasks.length > 0 
        ? Math.round((completedCount / taskSubtasks.length) * 100) 
        : 0;
      
      const task = tasks.find(t => t.id === subtask.taskId);
      if (task) {
        await updateTask({
          ...task,
          progress,
        });
        await refreshTasks();
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error toggling subtask:', err);
      throw err;
    }
  };

  const removeSubtask = async (id: string): Promise<void> => {
    try {
      await deleteSubtask(id);
    } catch (err) {
      setError(err as Error);
      console.error('Error removing subtask:', err);
      throw err;
    }
  };

  const value = {
    tasks,
    categories,
    loading,
    error,
    refreshTasks,
    addTask,
    editTask,
    removeTask,
    getTaskSubtasks,
    addSubtask,
    toggleSubtask,
    removeSubtask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext; 