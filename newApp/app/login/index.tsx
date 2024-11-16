import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Link } from "expo-router";
import React, { useState } from "react";
import httpClient from "../httpClient";
import { SERVER_URL } from "@/config/config";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const logInUser = async () => {
    try {
      const resp = await httpClient.post(`${SERVER_URL}/login`, {
        email,
        password,
      });
      console.log('Response:', resp);
      window.location.href = "../userHomePage";
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              style={styles.arrowBack}
            />
          </Link>
        </TouchableOpacity>


        {/* Input Fields */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        
        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={logInUser}>
        <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>


        {/* Don't Have an Account Link */}
        <TouchableOpacity>
          <Link href="/register">
            <Text style={styles.linkText}>Don't have an account?</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 150,
    marginTop: 0,
    resizeMode: 'contain',
  },
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
    backgroundColor: '#6B4F9B',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',      // Center content horizontally
    justifyContent: 'center',  // Center content vertically
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Calibri',
    fontSize: 23,
    textAlign: 'center',
  },
  linkText: {
    color: '#6B4F9B',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  arrowBackContainer: {
    position: 'absolute',
    top: 50,
    left: 21,
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