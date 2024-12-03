import { SERVER_URL } from '@/config/config';
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';
import EmployeePageTemplate from '../employeePageTemplate';

const EmployeeVehicleSearch = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [VIN, setVIN] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [status, setStatus] = useState('');

  const searchVehicles = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/search-vehicle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ make, model, year, VIN, }),
      });
      const data = await response.json();
      console.log(data)
      setVehicles(data);
    } catch (error) {
      console.error('Error searching vehicles:', error);
    }
  };

  const updateVehicleStatus = async (VIN) => {
    try {
      const response = await fetch(`${SERVER_URL}/update-vehicle-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ VIN, status }),
      });
      const data = await response.json();
      console.log(data)
      alert(data.message);
    } catch (error) {
      console.error('Error updating vehicle status:', error);
    }
  };

  return (
    <EmployeePageTemplate title="Vehicle Search">
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="Make" value={make} onChangeText={setMake} />
        <TextInput style={styles.input} placeholder="Model" value={model} onChangeText={setModel} />
        <TextInput style={styles.input} placeholder="Year" value={year} onChangeText={setYear} />
        <TextInput style={styles.input} placeholder="VIN" value={VIN} onChangeText={setVIN} />
        
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={searchVehicles}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.VIN.toString()}
          renderItem={({ item }) => (
            <View style={styles.vehicleItem}>
              <Text>{"Make: " + item.make}{'\n'}{"Model: " + item.model}{'\n'}{"Year: " + item.year}{'\n'}{"VIN: " + item.VIN}</Text>
              <TextInput
                style={styles.input}
                placeholder="Update Status"
                value={status}
                onChangeText={setStatus}
              />
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => updateVehicleStatus(item.VIN)}
              >
                <Text style={styles.buttonText}>Update Status</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </EmployeePageTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  vehicleItem: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: '#6B4F9B',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmployeeVehicleSearch;