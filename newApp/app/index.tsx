import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Link, } from "expo-router"
import React from 'react';


const LoginOrRegister = () => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../assets/images/MilkyWayRepair.png')} 
        style={styles.logo}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button}>
        <Link href="/login"><Text style={styles.buttonText}>Login</Text></Link>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity style={styles.button}>
        <Link href="/register"><Text style={styles.buttonText}>Register</Text></Link>
      </TouchableOpacity>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    backgroundColor: '#fff',
  },
  logo: {
    width: 500,
    marginBottom: 40,
    marginLeft: 40,
  } as const,
  button: {
    width: 150,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#6B4F9B', // Purple color
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 20,
    fontFamily: 'Calibri',
    fontSize: 23,
    //fontWeight: 'bold',
    cursor: 'pointer',
    },
    buttonText: {
      color: '#fff',
      fontFamily: 'Calibri',
      fontSize: 23,
      textAlign: 'center',
  },
});

export default LoginOrRegister;
