import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NavigationParams } from '../types';
import { theme } from '../utils/theme';

type EditTaskScreenRouteProp = RouteProp<NavigationParams, 'EditTask'>;

const EditTaskScreen = () => {
  const route = useRoute<EditTaskScreenRouteProp>();
  const { taskId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Task Screen</Text>
      <Text style={styles.subtext}>Editing task with ID: {taskId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.subtext,
  },
});

export default EditTaskScreen; 