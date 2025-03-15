import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationParams, Task, Project } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { useProjectContext } from '../context/ProjectContext';
import { theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<NavigationParams, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { tasks, loading: tasksLoading } = useTaskContext();
  const { projects, loading: projectsLoading } = useProjectContext();
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (tasks.length > 0) {
      // Get recent tasks (created in the last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recent = tasks
        .filter(task => task.createdAt >= sevenDaysAgo)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);
      
      setRecentTasks(recent);
      
      // Get upcoming tasks (due in the next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const today = new Date();
      
      const upcoming = tasks
        .filter(task => 
          task.dueDate && 
          task.dueDate >= today && 
          task.dueDate <= nextWeek &&
          task.status !== 'completed'
        )
        .sort((a, b) => {
          if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime();
          }
          return 0;
        })
        .slice(0, 5);
      
      setUpcomingTasks(upcoming);
    }
  }, [tasks]);

  useEffect(() => {
    if (projects.length > 0) {
      // Get active projects (progress < 100%)
      const active = projects
        .filter(project => project.progress < 100)
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3);
      
      setActiveProjects(active);
    }
  }, [projects]);

  const renderTaskItem = (task: Task) => {
    return (
      <TouchableOpacity 
        key={task.id}
        style={styles.taskItem}
        onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
      >
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
            <Text style={styles.statusText}>{task.status}</Text>
          </View>
        </View>
        
        {task.dueDate && (
          <Text style={styles.dueDate}>
            Due: {task.dueDate.toLocaleDateString()}
          </Text>
        )}
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${task.progress}%` }]} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderProjectItem = (project: Project) => {
    return (
      <TouchableOpacity 
        key={project.id}
        style={styles.projectItem}
        onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
      >
        <Text style={styles.projectTitle}>{project.name}</Text>
        <View style={styles.projectDetails}>
          <Text style={styles.projectDate}>
            Started: {project.startDate.toLocaleDateString()}
          </Text>
          <Text style={styles.projectProgress}>{project.progress}%</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${project.progress}%` }]} />
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return theme.colors.todo;
      case 'inProgress':
        return theme.colors.inProgress;
      case 'completed':
        return theme.colors.completed;
      default:
        return theme.colors.gray500;
    }
  };

  const renderSummary = () => {
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'inProgress').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;
    
    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{completedTasks}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{inProgressTasks}</Text>
          <Text style={styles.summaryLabel}>In Progress</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{todoTasks}</Text>
          <Text style={styles.summaryLabel}>To Do</Text>
        </View>
      </View>
    );
  };

  if (tasksLoading || projectsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
      </View>
      
      {renderSummary()}
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TasksTab')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map(task => renderTaskItem(task))
        ) : (
          <Text style={styles.emptyText}>No upcoming tasks</Text>
        )}
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
          <Text style={styles.addButtonText}>Add New Task</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Projects</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProjectsTab')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {activeProjects.length > 0 ? (
          activeProjects.map(project => renderProjectItem(project))
        ) : (
          <Text style={styles.emptyText}>No active projects</Text>
        )}
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProject')}
        >
          <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
          <Text style={styles.addButtonText}>Add New Project</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TasksTab')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentTasks.length > 0 ? (
          recentTasks.map(task => renderTaskItem(task))
        ) : (
          <Text style={styles.emptyText}>No recent tasks</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.white,
    opacity: 0.8,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    marginHorizontal: theme.spacing.md,
    marginTop: -theme.spacing.xl,
    ...theme.shadows.medium,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
  },
  section: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  seeAll: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  taskItem: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  taskTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 20,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  dueDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
    marginBottom: theme.spacing.sm,
  },
  progressContainer: {
    height: 6,
    backgroundColor: theme.colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  projectItem: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  projectTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  projectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  projectDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
  },
  projectProgress: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.gray100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    borderStyle: 'dashed',
  },
  addButtonText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    padding: theme.spacing.md,
    color: theme.colors.gray600,
    fontStyle: 'italic',
  },
});

export default HomeScreen; 