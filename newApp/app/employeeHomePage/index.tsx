import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React from 'react';

const userHomePage = () => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../../assets/images/MilkyWayRepair.png')} 
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

      {/* Title Text */}
      <Text style={styles.titleTextContainer}>
        <Text style={styles.titleText}>
            Employee Home
        </Text>
      </Text>

      {/* Account Button */}
      <TouchableOpacity style={styles.accountButtonContainer}>
        <Link href="/employeeHomePage">
          {" "}
          <Image
          source={require('../../assets/images/accountLogo.png')}
          style={styles.homeAndAccountButton}/>
          {"\n"}
          <Text style={styles.homeAndAccountText}>
            Account
          </Text>
        </Link>
      </TouchableOpacity>

      {/* Home Button */}
      <TouchableOpacity style={styles.homeButtonContainer}>
        <Link href="/employeeHomePage">
          {" "}
          <Image
          source={require('../../assets/images/homeLogo.png')}
          style={styles.homeAndAccountButton}/>
          {"\n"}
          <Text style={styles.homeAndAccountText}>
            Home
          </Text>
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
        width: 357,
        height: 248,
        marginTop: 165,
        marginLeft: 39,
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
      top: 60,
      left: 15,
      // Ensure the container has dimensions
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowBack: {
      height: 48,
      width: 48, 
    },
    titleTextContainer: {
      position: 'absolute',
      top: 67,
      left: 135,
      width: 317,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleText: {
        color: 'black',
        fontSize: 20,
    },
    homeButtonContainer: {
      position: 'absolute',
      top: 720,
      left: 15,
      height: 97,
      width: 206,
      backgroundColor: "#EBE4EC",
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    homeAndAccountButton: {
      height: 30,
      width: 30,
    },
    homeAndAccountText: {
      color: 'black',
    },
    accountButtonContainer: {
      position: 'absolute',
      top: 720,
      left: 10,
      width: 412,
      height: 97,
      backgroundColor: "#E5ECE4",
      borderRadius: 50,
      alignItems: 'flex-end',
    },
  });
  
  export default userHomePage;  