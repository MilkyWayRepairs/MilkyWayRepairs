import { Text, View } from "react-native";
import { ColorProperties } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

import React from 'react';
import { processFontFamily } from "expo-font";


const HomeScreen = () => {
  return (
    <div style = {styles.container}>
      {/* Logo */}
      <img 
        src="..\assets\images\MilkyWayRepair.png" 
        alt="Milky Way Logo" 
        style={styles.logo}
      />

      {/* Login Button */}
      <button style={styles.button}>Login</button>

      {/* Register Button */}
      <button style={styles.button}>Register</button>
    </div>
  );
};

// Styling
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#fff',
  },
  logo: {
    width: '500px',
    marginBottom: '40px',
  },
  button: {
    width: '150px',
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#6B4F9B', // Purple color
    color: '#fff',
    border: '1px solid #333',
    borderRadius: '20px',
    fontFamily: 'Calibri',
    fontSize: '23px',
    //fontWeight: 'bold',
    cursor: 'pointer',
    
  },
};

export default HomeScreen;
