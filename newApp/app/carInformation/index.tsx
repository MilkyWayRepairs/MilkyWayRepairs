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

  const fetchVehicleDetails = async (vehicle_VIN) => {
    try {
        const resp = await axios.get(`${SERVER_URL}/display_vehicle_logs/${vehicle_VIN}`);
        setSelectedVehicle(resp.data);
    } catch (error) {
        console.error('Error fetching vehicle information:', error);
    }
  };

  return (

    <NewPageTemplate title="Vehicle Information">
      <View style={styles.container}>
        <FlatList
            data={vehicles}
            keyExtractor={item => item.VIN}
            renderItem={({ item }) => (
            <TouchableOpacity onPress={() => fetchVehicleDetails(item.VIN)}>
                <Text style={styles.item}>{item.year} {item.make} {item.model}</Text>
            </TouchableOpacity>
            )}
        />
        {selectedVehicle && (
            <FlatList
            data={Object.entries(selectedVehicle).sort(([keyA], [keyB]) => {
                const order = ['VIN', 'year', 'make', 'model', 'logs'];
                return order.indexOf(keyA) - order.indexOf(keyB);
            })}
            keyExtractor={([key]) => key.toString()}
            renderItem={({ item: [key, value] }) => (
                <Text style={styles.detailText}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</Text>
            )}
            style={styles.details}
            />
        )}
        </View>
    </NewPageTemplate>
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