import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@/config/config';
import NewPageTemplate from "../newPageTemplate"

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
        try {
            const resp = await axios.get(`${SERVER_URL}/get-vehicle-list`);
            setVehicles(resp.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };
    fetchVehicles();
}, []);

  const goToVehicleStatus = async (vehicle_VIN) => {
    try {
        const resp = await axios.get(`${SERVER_URL}/display_vehicle_satus/${vehicle_VIN}`);
        setSelectedVehicle(resp.data);
    } catch (error) {
        console.error('Error fetching vehicle information:', error);
    }
  };

  return (
    <View style={styles.container}>
      <NewPageTemplate title="Status">
      </NewPageTemplate>
      <FlatList
        data={vehicles}
        keyExtractor={item => item.VIN}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => goToVehicleStatus(item.VIN)}>
            <Text style={styles.item}>{item.year} {item.make} {item.model}</Text>
          </TouchableOpacity>
        )}
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
  }
});

export default VehicleList;