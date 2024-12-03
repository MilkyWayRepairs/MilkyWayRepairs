import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@/config/config';
import NewPageTemplate from "../newPageTemplate"
import { Link, useNavigation } from 'expo-router';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigation = useNavigation();

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

  return (
    <NewPageTemplate title="Select a Vehicle">
        <View style={styles.container}>
        <FlatList
            data={vehicles}
            keyExtractor={item => item.VIN}
            renderItem={({ item }) => (
              <Link href={`/status/customer?VIN=${item.VIN}`} asChild>
                <TouchableOpacity>
                    <Text style={styles.item}>{item.year} {item.make} {item.model}</Text>
                </TouchableOpacity>
              </Link>
            )}
        />
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