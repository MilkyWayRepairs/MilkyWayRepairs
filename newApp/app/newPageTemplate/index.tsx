import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React from 'react';
//import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { SlideOutRight, withDelay, withTiming } from "react-native-reanimated";
import { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";

interface NewPageTemplateProps {
  title?: string;
  children?: React.ReactNode;
}

const newPageTemplate: React.FC<NewPageTemplateProps> = ({ title = "Template", children }) => {
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

  const handleOverlayClose = () => {
    setIsOverlayVisible(false);
    translateX.value = withTiming(400); // Animate to off-screen position
  }
  return (
    <View style={styles.container}>
      {/* Title Text and Back Arrow*/}
      <View style={[styles.titleTextContainer, {backgroundColor: "lavenderblush"}]}>
        <Text style={styles.titleText}>
          {title}
        </Text>
        <TouchableOpacity 
          style={styles.arrowBackButton}
          activeOpacity={0.7}>
          <Link href="..">
            <Image 
              source={require('../../assets/images/arrowBack.png')}
              style={styles.arrowBackImage}
            />
          </Link>
        </TouchableOpacity>        
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {children}
      </View>

      {/* Account Button */}
      <TouchableOpacity 
        style={styles.accountButtonContainer}
        onPress={handleAccountPress}>
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
        <Link href="/userHomePage">
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
      {isOverlayVisible && (
        <TouchableOpacity 
          style={styles.overlayBackground}
          activeOpacity={0} 
          onPress={handleOverlayClose}
        ></TouchableOpacity>
      )}
      <Animated.View style={[styles.accountOverlayContainer, animatedStyles]}
      onStartShouldSetResponder={() => true}
        onTouchEnd={(e) => e.stopPropagation()}>
        <View style={[styles.accountOverlayContent, styles.logoutContent]}>
          <Link href="/login" >
            <Text style={styles.accountOverlayText}>
              Logout
            </Text>
          </Link>
        </View>
        <View style={[styles.accountOverlayContent, styles.performanceContent]}>
          <Link href="/carInformation">
            <Text style={styles.accountOverlayText}>
              Car Information
            </Text>
          </Link>
        </View>
        <View style={[styles.accountOverlayContent, styles.upcomingAppointmentsContent]}>
          <Link href="/upcomingAppointments">
          <Text style={styles.accountOverlayText}>
            Upcoming Appointments
          </Text>
          </Link>
        </View>
        <View style={[styles.accountOverlayContent, styles.accountInformationContent]}>
          <Link href="/userAccountInformationPage">
            <Text style={styles.accountOverlayText}>
              Account Information
            </Text>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
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
  arrowBackButton: {
    position: 'absolute',
    top: 8,
    left: 0,
    // Ensure the container has dimensions
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  arrowBackImage: {
    width: 48,
    height: 48,
  },
  titleTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 64,
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
  accountOverlayContainer: {  // Everything below is the overlay
    position: 'absolute',
    top: 0,
    left: 250,
    width: 185,
    height: '100%',
    backgroundColor: "#EBE4EC", 
    zIndex: 2,
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
  upcomingAppointmentsContent: {
    top: 190, //Adjust this value to position the third box
  },
  accountInformationContent: {
    top: 280, //Adjust this value to position the fourth box
  },
  accountOverlayText: {
    color: 'black',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    zIndex: 1,
  },
  homeScreenButton: {
    width: 78,
    height: 78,
  },
  homeScreenButtonText: {
    color: 'black',
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    width: '100%',
    paddingTop: 64, // Height of the title bar
    zIndex: 0, // Ensure content is below the overlay
  },

});

export default newPageTemplate;