import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getProjects, 
  createProject, 
  addTaskToProject, 
  removeTaskFromProject 
} from '../services/firestore';
import { Project } from '../types';
import { useFirebase } from './FirebaseContext';

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  refreshProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'tasks'>) => Promise<string>;
  assignTaskToProject: (projectId: string, taskId: string) => Promise<void>;
  removeTaskFromProject: (projectId: string, taskId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  loading: true,
  error: null,
  refreshProjects: async () => {},
  addProject: async () => '',
  assignTaskToProject: async () => {},
  removeTaskFromProject: async () => {},
});

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useFirebase();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getProjects();
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const refreshProjects = async () => {
    await fetchProjects();
  };

  const addProject = async (project: Omit<Project, 'id' | 'tasks'>): Promise<string> => {
    try {
      const projectId = await createProject(project);
      await refreshProjects();
      return projectId;
    } catch (err) {
      setError(err as Error);
      console.error('Error adding project:', err);
      throw err;
    }
  };

  const assignTaskToProject = async (projectId: string, taskId: string): Promise<void> => {
    try {
      await addTaskToProject(projectId, taskId);
      await refreshProjects();
    } catch (err) {
      setError(err as Error);
      console.error('Error assigning task to project:', err);
      throw err;
    }
  };

  const removeTaskFromProjectHandler = async (projectId: string, taskId: string): Promise<void> => {
    try {
      await removeTaskFromProject(projectId, taskId);
      await refreshProjects();
    } catch (err) {
      setError(err as Error);
      console.error('Error removing task from project:', err);
      throw err;
    }
  };

  const value = {
    projects,
    loading,
    error,
    refreshProjects,
    addProject,
    assignTaskToProject,
    removeTaskFromProject: removeTaskFromProjectHandler,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext; 