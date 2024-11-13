import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React from 'react';
import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { SlideOutRight, withDelay, withTiming } from "react-native-reanimated";
import { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";

const userHomePage = () => {
  const translateX = useSharedValue(400); // Start off-screen
  const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleAccountPress = () => {
    setIsOverlayVisible(true);
    translateX.value = withTiming(10); // Animate to visible position
  };

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
      <TouchableOpacity 
        style={styles.accountButtonContainer}
        onPress={handleAccountPress}
      >
        <Text>
          {"                                 "}
          <Image
          source={require('../../assets/images/accountLogo.png')}
          style={styles.homeAndAccountButton}/>
          {"\n                             "}
          <Text style={styles.homeAndAccountText}>
            Account
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Home Button */}
      <TouchableOpacity style={styles.homeButtonContainer}>
        <Link href="/employeeHomePage">
          {"  "}
          <Image
          source={require('../../assets/images/homeLogo.png')}
          style={styles.homeAndAccountButton}/>
          {"\n"}
          <Text style={styles.homeAndAccountText}>
            Home
          </Text>
        </Link>
      </TouchableOpacity>

      {/* Account Overlay */}
      <Animated.View style={[styles.accountOverlayContainer, animatedStyles]}>
        <View style={[styles.accountOverlayContent, styles.logoutContent]}>
          <Text style={styles.accountOverlayText}>
            Logout
          </Text>
        </View>
        <View style={[styles.accountOverlayContent, styles.performanceContent]}>
          <Text style={styles.accountOverlayText}>
            Performance Evaluation
          </Text>
        </View>
      </Animated.View>
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
      width: 225,
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
      left: 115,
      width: 300,
      height: 97,
      backgroundColor: "#E5ECE4",
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    accountOverlayContainer: {
      position: 'absolute',
      top: 0,
      left: 250,
      width: 185,
      height: '100%',
      backgroundColor: "#EBE4EC", 
      zIndex: 1,
      overflow: 'visible',
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: 0 }],
      borderWidth: 3,
      borderRadius: 20,
      borderColor: 'black',
    },
    accountOverlayContent: {
      position: 'absolute',
      width: '100%',
      height: 80,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      backgroundColor: '#CEBDD1',
    },
    logoutContent: {
      top: 10, // Adjust this value to position the first box
    },
    performanceContent: {
      top: 100, // Adjust this value to position the second box
    },
    accountOverlayText: {
      color: 'black', //Change this to off white
    },
  });
  
  export default userHomePage;  