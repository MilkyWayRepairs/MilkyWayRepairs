import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@/config/config';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Import for back arrow icon
import NewPageTemplate from "../newPageTemplate";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    VIN: '',
    make: '',
    model: '',
    year: '',
  });
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddVehicle = async () => {
    try {
      await axios.post(`${SERVER_URL}/add-vehicle`, {
        ...formData,
        status: 0, // Default status
      });
      alert('Vehicle added successfully!');
      router.push('..'); // Navigate back to the vehicle information page
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle.');
    }
  };

  return (
    <NewPageTemplate title='Add Vehicle'>
      <View style={styles.container}>
        
        {/* Form */}
        <TextInput
          style={styles.input}
          placeholder="VIN"
          placeholderTextColor="#dfdfdf"
          value={formData.VIN}
          onChangeText={(value) => handleInputChange('VIN', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Make"
          placeholderTextColor="#dfdfdf"
          value={formData.make}
          onChangeText={(value) => handleInputChange('make', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Model"
          placeholderTextColor="#dfdfdf"
          value={formData.model}
          onChangeText={(value) => handleInputChange('model', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Year"
          placeholderTextColor="#dfdfdf"
          keyboardType="numeric"
          value={formData.year}
          onChangeText={(value) => handleInputChange('year', value)}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
          <Text style={styles.addButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </NewPageTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#6B4F9B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddVehicle;
