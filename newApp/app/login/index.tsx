import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React from 'react';

const Login = () => {
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
      />

      {/* Register Button */}
      <TouchableOpacity style={styles.button}>
        <Link href="..">
          <Text style={styles.buttonText}>Register</Text>
        </Link>
      </TouchableOpacity>

      {/* Don't Have an Account Link */}
      <TouchableOpacity onPress={() => {/* Navigate to register screen */}}>
        <Link href="/register">
          <Text style={styles.linkText}>Don't have an account?</Text>
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
      marginVertical: 20,
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
  
  export default Login;  