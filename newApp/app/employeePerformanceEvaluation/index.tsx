import React, { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@/config/config';
import NewPageTemplate from "../newPageTemplate";
const employeePerformanceEvaluation = () => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchScore = async () => {
      try{
        const resp = await axios.get(`${SERVER_URL}/get-evaluation-score`);
        setScore(resp.data);
      } catch (error){
        console.error('Error fetching performance evaluation score:', error)
      }
    }
    fetchScore();
  });
  
  return (
    <View style={styles.container}>
      <NewPageTemplate title="Your Performance Evaluation Score">
        <Text style={styles.scoreText}> {score} </Text>
      </NewPageTemplate>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  scoreText: {
    fontSize: 200,
    left: 80,
    top: 120,
  }
});

export default employeePerformanceEvaluation;