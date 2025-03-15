import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

const AddTaskScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Task Screen</Text>
      <Text style={styles.subtext}>Form to add a new task will be here</Text>
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

export default AddTaskScreen; 