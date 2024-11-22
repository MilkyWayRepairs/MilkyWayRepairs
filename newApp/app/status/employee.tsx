import { SERVER_URL } from '@/config/config';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList } from 'react-native';

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
    <View>
      <TextInput placeholder="Make" value={make} onChangeText={setMake} />
      <TextInput placeholder="Model" value={model} onChangeText={setModel} />
      <TextInput placeholder="Year" value={year} onChangeText={setYear} />
      <TextInput placeholder="VIN" value={VIN} onChangeText={setVIN} />
      <Button title="Search" onPress={searchVehicles} />

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.VIN.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.make} {item.model} {item.year} {item.VIN}</Text>
            <TextInput
              placeholder="Update Status"
              value={status}
              onChangeText={setStatus}
            />
            <Button title="Update Status" onPress={() => updateVehicleStatus(item.VIN)} />
          </View>
        )}
      />
    </View>
  );
};

export default EmployeeVehicleSearch;