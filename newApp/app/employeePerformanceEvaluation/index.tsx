import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React from 'react';
//import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { SlideOutRight, withDelay, withTiming } from "react-native-reanimated";
import { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";

const employeePerformanceEvaluation = () => {
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

      {/* Title Text */}
      <View style={styles.textBox}>
        <Text style={styles.text}>Your Performance Evaluation Score</Text>
      </View>

    </View>  
  );
}

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
  textBox: {
    top: 150,
    left: 0,
    width: '100%',
    height: 150,
  },
  text: {
    fontFamily: 'Robato',
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  }
});

export default employeePerformanceEvaluation;