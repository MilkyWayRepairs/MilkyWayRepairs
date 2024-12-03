import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // For the back arrow

const manageEmployees = () => {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Manager Settings</Text>
      </View>

      {/* Dropdown (Placeholder for Select to Modify) */}
      <TextInput
        style={styles.dropdown}
        placeholder="Select to Modify"
        editable={false}
        placeholderTextColor="#fff"
      />

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateTo('/setSchedule')}
      >
        <Text style={styles.buttonText}>Set Employee Schedule</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateTo('/addEmployee')}
      >
        <Text style={styles.buttonText}>Onboard Employee</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateTo('/fireEmployee')}
      >
        <Text style={styles.buttonText}>Fire Employee</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateTo('/misc')}
      >
        <Text style={styles.buttonText}>Misc (Edit Wages, Write up, etc..)</Text>
      </TouchableOpacity>

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigateTo('/home')} style={styles.navItem}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo('/account')} style={styles.navItem}>
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
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

export default manageEmployees;
