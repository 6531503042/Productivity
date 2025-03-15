import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Task, TaskCategory, Subtask, Project, TaskStatus, TaskPriority } from '../types';
import { FirebaseError } from 'firebase/app';

// Collection references
const categoriesRef = collection(db, 'categories');
const tasksRef = collection(db, 'tasks');
const subtasksRef = collection(db, 'subtasks');
const projectsRef = collection(db, 'projects');
const projectTasksRef = collection(db, 'project_tasks');

// Helper functions to convert between Firestore and app data types
const convertTimestampToDate = (timestamp: Timestamp | null | undefined): Date | undefined => {
  return timestamp ? timestamp.toDate() : undefined;
};

const convertTaskFromFirestore = (id: string, data: any): Task => {
  return {
    id,
    title: data.title,
    description: data.description || undefined,
    status: data.status as TaskStatus,
    priority: data.priority as TaskPriority,
    dueDate: convertTimestampToDate(data.dueDate),
    createdAt: convertTimestampToDate(data.createdAt) || new Date(),
    updatedAt: convertTimestampToDate(data.updatedAt) || new Date(),
    categoryId: data.categoryId || undefined,
    progress: data.progress,
  };
};

const convertTaskToFirestore = (task: Omit<Task, 'id'>): any => {
  return {
    title: task.title,
    description: task.description || null,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    categoryId: task.categoryId || null,
    progress: task.progress,
  };
};

// Helper function to handle Firestore errors
const handleFirestoreError = (error: unknown, operation: string): never => {
  if (error instanceof FirebaseError) {
    // Handle permission-denied errors
    if (error.code === 'permission-denied') {
      console.error(`Permission denied while ${operation}. Please check your Firestore rules.`);
      console.error('Make sure anonymous authentication is enabled in your Firebase project.');
      console.error('Also verify that your Firestore rules allow the operations you are trying to perform.');
      throw new Error(`Permission denied: ${error.message}`);
    } else if (error.code === 'unauthenticated') {
      console.error(`Authentication required for ${operation}. User is not authenticated.`);
      console.error('Please sign in before performing this operation.');
      throw new Error(`Authentication required: ${error.message}`);
    } else if (error.code === 'unavailable') {
      console.error(`Service unavailable while ${operation}. Please check your internet connection.`);
      throw new Error(`Service unavailable: ${error.message}`);
    }
    
    // Handle other Firebase errors
    console.error(`Firebase error while ${operation}:`, error.code, error.message);
    throw error;
  }
  
  // Handle other errors
  console.error(`Error while ${operation}:`, error);
  throw error;
};

// Initialize default categories
export const initializeDefaultCategories = async (): Promise<void> => {
  try {
    // Check if categories already exist
    const snapshot = await getDocs(categoriesRef);
    if (snapshot.empty) {
      const defaultCategories = [
        { name: 'Work', color: '#4A6FFF', icon: 'briefcase' },
        { name: 'Personal', color: '#FF6B6B', icon: 'user' },
        { name: 'Health', color: '#4CAF50', icon: 'heart' },
        { name: 'Education', color: '#FFC107', icon: 'book' },
        { name: 'Finance', color: '#2196F3', icon: 'dollar-sign' },
      ];

      // Add default categories
      for (const category of defaultCategories) {
        await addDoc(categoriesRef, category);
      }
      console.log('Default categories added to Firestore');
    }
  } catch (error) {
    handleFirestoreError(error, 'initializing default categories');
  }
};

// Task CRUD operations
export const getTasks = async (): Promise<Task[]> => {
  try {
    const q = query(tasksRef, orderBy('dueDate', 'asc'));
    const snapshot = await getDocs(q);
    
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      tasks.push(convertTaskFromFirestore(doc.id, doc.data()));
    });
    
    return tasks;
  } catch (error) {
    return handleFirestoreError(error, 'getting tasks');
  }
};

export const getTaskById = async (id: string): Promise<Task> => {
  const docRef = doc(tasksRef, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return convertTaskFromFirestore(docSnap.id, docSnap.data());
  } else {
    throw new Error('Task not found');
  }
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<string> => {
  const taskData = convertTaskToFirestore(task);
  const docRef = await addDoc(tasksRef, taskData);
  return docRef.id;
};

export const updateTask = async (task: Task): Promise<void> => {
  const docRef = doc(tasksRef, task.id);
  
  await updateDoc(docRef, {
    title: task.title,
    description: task.description || null,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
    updatedAt: serverTimestamp(),
    categoryId: task.categoryId || null,
    progress: task.progress,
  });
};

export const deleteTask = async (id: string): Promise<void> => {
  // First delete all subtasks
  const subtasksQuery = query(subtasksRef, where('taskId', '==', id));
  const subtasksSnapshot = await getDocs(subtasksQuery);
  
  const deleteSubtasksPromises = subtasksSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deleteSubtasksPromises);
  
  // Then delete the task
  const docRef = doc(tasksRef, id);
  await deleteDoc(docRef);
};

// Category operations
export const getCategories = async (): Promise<TaskCategory[]> => {
  const snapshot = await getDocs(categoriesRef);
  
  const categories: TaskCategory[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    categories.push({
      id: doc.id,
      name: data.name,
      color: data.color,
      icon: data.icon,
    });
  });
  
  return categories;
};

// Subtask operations
export const getSubtasksByTaskId = async (taskId: string): Promise<Subtask[]> => {
  const q = query(subtasksRef, where('taskId', '==', taskId));
  const snapshot = await getDocs(q);
  
  const subtasks: Subtask[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    subtasks.push({
      id: doc.id,
      title: data.title,
      completed: data.completed,
      taskId: data.taskId,
    });
  });
  
  return subtasks;
};

export const createSubtask = async (subtask: Omit<Subtask, 'id'>): Promise<string> => {
  const docRef = await addDoc(subtasksRef, subtask);
  return docRef.id;
};

export const updateSubtask = async (subtask: Subtask): Promise<void> => {
  const docRef = doc(subtasksRef, subtask.id);
  await updateDoc(docRef, {
    title: subtask.title,
    completed: subtask.completed,
  });
};

export const deleteSubtask = async (id: string): Promise<void> => {
  const docRef = doc(subtasksRef, id);
  await deleteDoc(docRef);
};

// Project operations
export const getProjects = async (): Promise<Project[]> => {
  const snapshot = await getDocs(projectsRef);
  
  const projects: Project[] = [];
  for (const projectDoc of snapshot.docs) {
    const projectData = projectDoc.data();
    
    // Get tasks for this project
    const tasks = await getTasksByProjectId(projectDoc.id);
    
    projects.push({
      id: projectDoc.id,
      name: projectData.name,
      description: projectData.description || undefined,
      startDate: convertTimestampToDate(projectData.startDate) || new Date(),
      endDate: convertTimestampToDate(projectData.endDate),
      progress: projectData.progress,
      tasks,
    });
  }
  
  return projects;
};

export const getTasksByProjectId = async (projectId: string): Promise<Task[]> => {
  const q = query(projectTasksRef, where('projectId', '==', projectId));
  const snapshot = await getDocs(q);
  
  const tasks: Task[] = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    try {
      const task = await getTaskById(data.taskId);
      tasks.push(task);
    } catch (error) {
      console.error(`Error getting task ${data.taskId}:`, error);
    }
  }
  
  return tasks;
};

export const createProject = async (project: Omit<Project, 'id' | 'tasks'>): Promise<string> => {
  const projectData = {
    name: project.name,
    description: project.description || null,
    startDate: Timestamp.fromDate(project.startDate),
    endDate: project.endDate ? Timestamp.fromDate(project.endDate) : null,
    progress: project.progress,
  };
  
  const docRef = await addDoc(projectsRef, projectData);
  return docRef.id;
};

export const addTaskToProject = async (projectId: string, taskId: string): Promise<void> => {
  await addDoc(projectTasksRef, {
    projectId,
    taskId,
  });
};

export const removeTaskFromProject = async (projectId: string, taskId: string): Promise<void> => {
  const q = query(
    projectTasksRef, 
    where('projectId', '==', projectId),
    where('taskId', '==', taskId)
  );
  
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    await deleteDoc(snapshot.docs[0].ref);
  }
}; 