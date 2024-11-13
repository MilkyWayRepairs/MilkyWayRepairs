import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { Link, } from "expo-router";
import React, { useState } from 'react';
//import { IP_ADDRESS } from '@env'

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match");
      return;
    }

  try {
    
    // Registriation will only go through on the device running the app unless 'localhost' is changed to your personal IP 
    // Replace 'localhost' with IP if doing through different device
    const response = await fetch(`http://localhost:5000/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok && data.code === 0){
      Alert.alert("Registration successful");
    } else {
      Alert.alert("Registration failed", data.message);
    }
  } catch (error) {
    Alert.alert("Error", "Unable to register at the moment.");
  }
};

  

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../../assets/images/MilkyWayRepairNoCar.png')} 
        style={styles.logo}
      />

      {/* Back Arrow */}
      <TouchableOpacity style={styles.arrowBackContainer}>
        <Link href="..">
          <Image 
          source={require('../../assets/images/arrowBack.png')} 
          style={styles.arrowBack}/>
        </Link>
      </TouchableOpacity>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
            <TextInput
        style={styles.input}
        placeholder="Re-enter Password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Already Have an Account Link */}
      <TouchableOpacity onPress={() => {/* Navigate to login screen */}}>
        <Link href="/login">
          <Text style={styles.linkText}>Already have an account?</Text>
        </Link>
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
    height: 100,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 150,
    marginTop: 0,
    resizeMode: 'contain',
  } as const,
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    width: 150,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    resizeMode: 'contain',
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
  linkText: {
    color: '#6B4F9B', // Match the button color or choose another
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  arrowBackContainer: {
    position: 'absolute',
    top: 50,
    left: 21,
    // Ensure the container has dimensions
    width: 53,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowBack: {
    height: 50,
    width: 53, 
  }
});

export default Register;
