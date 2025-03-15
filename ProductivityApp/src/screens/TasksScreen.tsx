import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationParams, Task, TaskStatus } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

type TasksScreenNavigationProp = NativeStackNavigationProp<NavigationParams, 'Tasks'>;

const TasksScreen = () => {
  const navigation = useNavigation<TasksScreenNavigationProp>();
  const { tasks, loading } = useTaskContext();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    if (tasks.length > 0) {
      filterTasks(activeFilter);
    } else {
      setFilteredTasks([]);
    }
  }, [tasks, activeFilter]);

  const filterTasks = (filter: TaskStatus | 'all') => {
    if (filter === 'all') {
      setFilteredTasks([...tasks].sort((a, b) => {
        // Sort by status (todo, inProgress, completed)
        const statusOrder = { todo: 0, inProgress: 1, completed: 2 };
        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        
        if (statusDiff !== 0) return statusDiff;
        
        // Then by due date (if available)
        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        } else if (a.dueDate) {
          return -1;
        } else if (b.dueDate) {
          return 1;
        }
        
        // Finally by creation date
        return b.createdAt.getTime() - a.createdAt.getTime();
      }));
    } else {
      setFilteredTasks(
        tasks
          .filter(task => task.status === filter)
          .sort((a, b) => {
            if (a.dueDate && b.dueDate) {
              return a.dueDate.getTime() - b.dueDate.getTime();
            } else if (a.dueDate) {
              return -1;
            } else if (b.dueDate) {
              return 1;
            }
            return b.createdAt.getTime() - a.createdAt.getTime();
          })
      );
    }
  };

  const getStatusColor = (status: TaskStatus) => {
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

  const renderTaskItem = ({ item }: { item: Task }) => {
    return (
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      >
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        {item.description && (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.taskFooter}>
          {item.dueDate && (
            <Text style={styles.dueDate}>
              Due: {item.dueDate.toLocaleDateString()}
            </Text>
          )}
          
          <Text style={styles.taskProgress}>{item.progress}%</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filter: TaskStatus | 'all', label: string) => {
    const isActive = activeFilter === filter;
    
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          isActive && { backgroundColor: theme.colors.primary }
        ]}
        onPress={() => setActiveFilter(filter)}
      >
        <Text
          style={[
            styles.filterButtonText,
            isActive && { color: theme.colors.white }
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('todo', 'To Do')}
        {renderFilterButton('inProgress', 'In Progress')}
        {renderFilterButton('completed', 'Completed')}
      </View>
      
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks found</Text>
          <Text style={styles.emptySubtext}>
            {activeFilter === 'all'
              ? 'Add a new task to get started'
              : `No ${activeFilter} tasks found`}
          </Text>
        </View>
      )}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Ionicons name="add" size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
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
  filtersContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    ...theme.shadows.small,
  },
  filterButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
  },
  filterButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  listContent: {
    padding: theme.spacing.md,
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
  taskDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.sm,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dueDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
  },
  taskProgress: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.primary,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.gray600,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray500,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
});

export default TasksScreen; 