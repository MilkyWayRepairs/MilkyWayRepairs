import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@/config/config';
import NewPageTemplate from "../newPageTemplate"
import { Link, } from "expo-router"

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
        try {
            const resp = await axios.get(`${SERVER_URL}/get-employee-list`);
            setEmployees(resp.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };
    fetchEmployees();
}, []);

  return (
    <View style={styles.container}>
      <NewPageTemplate title="Select Employee">
      </NewPageTemplate>
      <FlatList
        data={employees}
        keyExtractor={item => item.ID}
        renderItem={({ item }) => (
          <Link href={`/adminPerformanceEvaluation2?ID=${item.ID}`} asChild>
            <TouchableOpacity>
              <Text style={styles.item}>{item.name} ID# {item.ID}</Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No employees found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  item: { 
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderTopWidth: 1,
    padding: 10 
  },
  details: {
    marginTop: 5,
    padding: 0,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    bottom: 150,
    maxHeight: 300
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
});

export default EmployeeList;