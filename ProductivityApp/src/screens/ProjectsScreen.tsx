import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationParams, Project } from '../types';
import { useProjectContext } from '../context/ProjectContext';
import { theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

type ProjectsScreenNavigationProp = NativeStackNavigationProp<NavigationParams, 'Projects'>;

const ProjectsScreen = () => {
  const navigation = useNavigation<ProjectsScreenNavigationProp>();
  const { projects, loading } = useProjectContext();

  const renderProjectItem = ({ item }: { item: Project }) => {
    return (
      <TouchableOpacity
        style={styles.projectItem}
        onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
      >
        <Text style={styles.projectTitle}>{item.name}</Text>
        
        {item.description && (
          <Text style={styles.projectDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View style={styles.projectDetails}>
          <Text style={styles.projectDate}>
            Started: {item.startDate.toLocaleDateString()}
          </Text>
          <Text style={styles.projectProgress}>{item.progress}%</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
        </View>
        
        <Text style={styles.tasksCount}>
          {item.tasks.length} {item.tasks.length === 1 ? 'task' : 'tasks'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading projects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {projects.length > 0 ? (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No projects found</Text>
          <Text style={styles.emptySubtext}>
            Create a new project to organize your tasks
          </Text>
        </View>
      )}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProject')}
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
  listContent: {
    padding: theme.spacing.md,
  },
  projectItem: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  projectTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  projectDescription: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray700,
    marginBottom: theme.spacing.md,
  },
  projectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  progressContainer: {
    height: 6,
    backgroundColor: theme.colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  tasksCount: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
    textAlign: 'right',
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

export default ProjectsScreen; 