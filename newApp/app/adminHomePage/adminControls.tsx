import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_URL } from '@/config/config'; // Ensure this alias is set up in your project configuration
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Import for back arrow icon
import NewPageTemplate from "../newPageTemplate";

const ManagerSettings = () => {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <NewPageTemplate title="Manager Settings">
      <View style={styles.container}>
      
        <TouchableOpacity
        style={styles.container}
        onPress={() => navigateTo('/addEmployee')}
      >
        <Text style={styles.containerText}>Onboard Employee</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.container}
        onPress={() => navigateTo('/fireEmployee')}
      >
        <Text style={styles.containerText}>Fire Employee</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.container}
        onPress={() => navigateTo('/misc')}
      >
        <Text style={styles.containerText}>Misc (Edit Wages, Write up, etc..)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.container}
        onPress={() => navigateTo('/setSchedule')}
      >
        <Text style={styles.navText}>Set Employee Schedule</Text>
      </TouchableOpacity>


        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => navigateTo('/home')} style={styles.navItem}>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo('/account')} style={styles.navItem}>
            <Text style={styles.navText}>Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </NewPageTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  container: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  containerText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 'auto',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    color: '#007bff',
  },
});

export default ManagerSettings;
