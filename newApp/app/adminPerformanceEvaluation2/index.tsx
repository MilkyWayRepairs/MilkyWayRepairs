import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React, { act, useState } from 'react';
import { SERVER_URL } from "../../config/config";
import AccountSidebar from '../accountSidebar'; // Ensure the path is correct
import { useSearchParams } from "expo-router/build/hooks";

const adminPerformanceEvaluation2 = () => {
  const searchParams = useSearchParams();
  const employeeID = searchParams.get('ID');
  const[expectedTime, setExpectedTime] = useState("");
  const[actualTime, setActualTime] = useState("");
  
  const handleCalculate = async () => {
    if (!expectedTime.trim() || !actualTime.trim()) {
        alert("All fields are required!");
        return;
    }

    // Validate numeric inputs
    if (isNaN(parseFloat(expectedTime)) || isNaN(parseFloat(actualTime))) {
        alert("Expected time and actual time must be valid numbers!");
        return;
    }

    try {
        const response = await fetch(`${SERVER_URL}/performanceEvaluation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                employeeID,
                expectedTime: parseFloat(expectedTime),
                actualTime: parseFloat(actualTime),
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Evaluation submitted successfully!\nPerformance Ratio: ${data.performance_ratio.toFixed(2)}%`);
            // Clear form
            setExpectedTime("");
            setActualTime("");
        } else {
            alert(`Error: ${data.error || 'Failed to submit evaluation'}`);
        }
    } catch (error) {
        console.error("Error submitting evaluation:", error);
        alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.arrowBackContainer}>
        <Link href="..">
          <Image 
          source={require('../../assets/images/arrowBack.png')} 
          style={styles.arrowBack}/>
        </Link>
      </TouchableOpacity>

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
        style={[styles.input, styles.expectedTimeInput]}
        placeholder="Hours"
        keyboardType="decimal-pad"
        value={expectedTime}
        onChangeText={setExpectedTime}
      />
      <TextInput
        style={[styles.input, styles.actualTimeInput]}
        placeholder="Hours"
        keyboardType="decimal-pad"
        value={actualTime}
        onChangeText={setActualTime}
      />
        
      {/* Calculate Button */}
      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
        
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
  expectedTimeText: {
    top: 100,
    left: 60,
  },
  actualTimeText: {
    top: 220,
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
  expectedTimeInput: {
    top: 120,
    left: 0,
  },
  actualTimeInput: {
    top: 140,
    left: 0,
  },
  button: {
    top: 150,
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

export default adminPerformanceEvaluation2