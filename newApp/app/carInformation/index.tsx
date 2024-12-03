import React, { useState, useEffect } from 'react';
import { useRouter } from "expo-router";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@/config/config';
import NewPageTemplate from "../newPageTemplate";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const router = useRouter();

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
      <View style={styles.contentContainer}>
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.VIN}
          renderItem={({ item }) => (
          <TouchableOpacity onPress={() => fetchVehicleDetails(item.VIN)}>
            <Text style={styles.item}>{item.year} {item.make} {item.model}</Text>
          </TouchableOpacity>
          )}
          ListEmptyComponent={
         <Text style={styles.emptyMessage}>No vehicle found</Text>
         }
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
        {/* Add Vehicle Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('./carInformation/add-vehicle')}>
            <Text style={styles.addButtonText}>Add Vehicle</Text>
        </TouchableOpacity>
        </View>
    </NewPageTemplate>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  VehicleList: {
    flexGrow: 0
  },
  item: { 
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderTopWidth: 1,
    padding: 10,
  },
  details: {
    marginTop: 5,
    padding: 0,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    bottom: 150,
    maxHeight: 350,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    bottom: 90,
    width: 390,
    position: 'absolute'
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
});

export default VehicleList;
