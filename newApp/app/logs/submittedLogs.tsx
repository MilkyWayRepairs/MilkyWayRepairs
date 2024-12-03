import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { SERVER_URL } from "@/config/config";

interface Log {
  id: number;
  date: string;
  mileage: string;
  vin: string;
  job_title: string;
  job_notes: string;
}

const SubmittedLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching logs..."); // Debug log
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/logs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      console.log("Response status:", response.status); // Debug log

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received logs data:", data); // Debug log
      setLogs(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submitted Logs</Text>

      {logs.length === 0 ? (
        <Text style={styles.noLogsText}>No logs found</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text style={styles.label}>Date: <Text style={styles.value}>{item.date}</Text></Text>
              <Text style={styles.label}>Mileage: <Text style={styles.value}>{item.mileage}</Text></Text>
              <Text style={styles.label}>VIN: <Text style={styles.value}>{item.vin}</Text></Text>
              <Text style={styles.label}>Job Title: <Text style={styles.value}>{item.job_title}</Text></Text>
              <Text style={styles.label}>Job Notes: <Text style={styles.value}>{item.job_notes}</Text></Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
    textAlign: 'center',
  },
  logItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontWeight: 'normal',
    color: '#666',
  },
  noLogsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default SubmittedLogs;
