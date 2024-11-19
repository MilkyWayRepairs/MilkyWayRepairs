import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React from 'react';

const adminPerformanceEvaluation = () => {
  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.arrowBackContainer}>
        <Link href="/homeAndAdminOverlay">
          <Image 
          source={require('../../assets/images/arrowBack.png')} 
          style={styles.arrowBack}/>
        </Link>
      </TouchableOpacity>

      {/* Employee Name Header*/}
      <Text style={[styles.performanceEvaluationScreenText, styles.employeeNameText]}>
        Employee Name:
      </Text>

      {/* Employee ID Header */}
      <Text style={[styles.performanceEvaluationScreenText, styles.employeeIDText]}>
        Employee ID:
      </Text>

      {/* Excpected Time Header */}
      <Text style={[styles.performanceEvaluationScreenText, styles.expectedTimeText]}>
        Expected Time Spent on Task:
      </Text>

      {/* Actual Time Header */}
      <Text style={[styles.performanceEvaluationScreenText, styles.actualTimeText]}>
        Actual Time Spent on Task:
      </Text>

      {/* Input Fields */}
      <TextInput
        style={[styles.input, styles.employeeNameInput]}
        placeholder="Name"
        keyboardType="default"
      />
      <TextInput
        style={[styles.input, styles.employeeIDInput]}
        placeholder="ID#"
        keyboardType="number-pad"
      />
      <TextInput
        style={[styles.input, styles.expectedTimeInput]}
        placeholder="Hours"
        keyboardType="decimal-pad"
      />
      <TextInput
        style={[styles.input, styles.actualTimeInput]}
        placeholder="Hours"
        keyboardType="decimal-pad"
      />
        
      {/* Calculate Button */}
      <Link href="/homeAndAdminOverlay" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>
      </Link>
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    height: 100,
    backgroundColor: '#fff',
  },
  arrowBackContainer: {
    position: 'absolute',
    top: 20,
    left: 15,
    // Ensure the container has dimensions
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowBack: {
    height: 48,
    width: 48, 
  },
  performanceEvaluationScreenText: {
    fontFamily: 'Robato',
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  employeeNameText: {
    top: 50,
    left: 115,
  },
  employeeIDText: {
    top: 170,
    left: 135, 
  },
  expectedTimeText: {
    top: 290,
    left: 60,
  },
  actualTimeText: {
    top: 410,
    left: 70,
  },
  input: {
    width: '80%',
    height: 60,
    borderColor: 'indigo',
    borderWidth: 3,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  employeeNameInput: {
    top: 80,
    left: 0,
  },
  employeeIDInput: {
    top: 100,
    left: 0,
  },
  expectedTimeInput: {
    top: 120,
    left: 0,
  },
  actualTimeInput: {
    top: 140,
    left: 0,
  },
  button: {
    top: 170,
    width: 150,
    padding: 10,
    backgroundColor: '#6B4F9B',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',      // Center content horizontally
    justifyContent: 'center',  // Center content vertically
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Calibri',
    fontSize: 23,
    textAlign: 'center',
  },
});

export default adminPerformanceEvaluation