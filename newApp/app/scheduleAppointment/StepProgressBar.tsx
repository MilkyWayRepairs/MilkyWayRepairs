import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index + 1 <= currentStep;
        return (
          <View key={index} style={styles.stepContainer}>
            <View style={[styles.circle, isActive && styles.activeCircle]}>
              <Text style={styles.stepText}>{index + 1}</Text>
            </View>
            {index < totalSteps - 1 && (
              <View style={[styles.line, isActive && styles.activeLine]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#6B4F9B',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#4caf50',
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  line: {
    width: 50,
    height: 4,
    backgroundColor: '#d3d3d3',
  },
  activeLine: {
    backgroundColor: '#4caf50',
  },
});

export default StepProgressBar;
