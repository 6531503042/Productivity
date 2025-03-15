import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NavigationParams } from '../types';
import { theme } from '../utils/theme';

type EditProjectScreenRouteProp = RouteProp<NavigationParams, 'EditProject'>;

const EditProjectScreen = () => {
  const route = useRoute<EditProjectScreenRouteProp>();
  const { projectId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Project Screen</Text>
      <Text style={styles.subtext}>Editing project with ID: {projectId}</Text>
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

export default EditProjectScreen; 