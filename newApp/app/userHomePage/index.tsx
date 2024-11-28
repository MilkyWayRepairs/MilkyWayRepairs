import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React from 'react';
//import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
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

  const handleOverlayClose = () => {
    setIsOverlayVisible(false);
    translateX.value = withTiming(400); // Animate to off-screen position
  }
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../../assets/images/MilkyWayRepair.png')} 
        style={styles.logo}
      />

      {/* Title Text and Back Arrow*/}
      <View style={[styles.titleTextContainer, {backgroundColor: "lavenderblush"}]}>
        <Text style={styles.titleText}>
            Milky Way Repairs
        </Text>
        <TouchableOpacity style={styles.arrowBack}>
          <Link href="..">
            <Image 
            source={require('../../assets/images/arrowBack.png')}
            style={styles.arrowBack}/>
          </Link>
        </TouchableOpacity>        
      </View>

      {/* Schedule Appointment Button */}
      <TouchableOpacity style={styles.scheduleAppointmentButtonContainer}>
        <Link href="/userHomePage/customerScheduling">
          <Image
            source={require('../../assets/images/ScheduleAppointment.png')}
            style={styles.homeScreenButton}
          />
        </Link>
      </TouchableOpacity>

      {/* Messages Button */}  
      <Link href="/Messages" style={styles.messagesButtonContainer}>
        <Image
          source={require('../../assets/images/Messages.png')}
          style={styles.homeScreenButton}
        />
      </Link>

      {/* Review Button */}
      <TouchableOpacity style={styles.reviewButtonContainer}>
          <Link href="/reviews">
              <Image
                  source={require('../../assets/images/Review.png')}
                  style={styles.homeScreenButton}
              />
          </Link>
      </TouchableOpacity>

      {/* Status Button */}
      <TouchableOpacity style={styles.statusButtonContainer}>
        <Link href="/status/customer">
          <Image
            source={require('../../assets/images/Status.png')}
            style={styles.homeScreenButton}
          />
          </Link>
      </TouchableOpacity>

      {/* Schedule Appointment Text */}
      <View style={styles.scheduleAppointmentTextContainer}>
        <Text style={styles.homeScreenButtonText}>
            Schedule Appointment
        </Text>
      </View>

      {/* Messages Text */}
      <View style={styles.messagesTextContainer}>
        <Text style={styles.homeScreenButtonText}>
            Messages
        </Text>
      </View>

      {/* Review Text */}
      <View style={styles.reviewTextContainer}>
        <Text style={styles.homeScreenButtonText}>
            Review
        </Text>
      </View>

      {/* Status Text */}
      <View style={styles.statusTextContainer}>
        <Text style={styles.homeScreenButtonText}>
            Status
        </Text>
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
          <Text style={styles.accountOverlayText}>
            Car Information
          </Text>
        </View>
        <View style={[styles.accountOverlayContent, styles.upcomingAppointmentsContent]}>
          <Text style={styles.accountOverlayText}>
            Upcoming Appointments
          </Text>
        </View>
        <View style={[styles.accountOverlayContent, styles.accountInformationContent]}>
          <Text style={styles.accountOverlayText}>
            Account Information
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
    top: -50,
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
  arrowBack: {
    position: 'absolute',
    top: 8,
    left: 0,
    // Ensure the container has dimensions
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
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
  scheduleAppointmentButtonContainer: {
    position: 'absolute',
    top: 420,
    left: 76,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesButtonContainer: {
    position: 'absolute',
    top: 420,
    left: 240,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewButtonContainer: {
    position: 'absolute',
    top: 580,
    left: 85,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButtonContainer: {
    position: 'absolute',
    top: 580,
    left: 240,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeScreenButton: {
    width: 78,
    height: 78,
  },    
  scheduleAppointmentTextContainer:{
    position: 'absolute',
    top: 510,
    left: 78,
    width: 92,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  messagesTextContainer:{
    position: 'absolute',
    top: 510,
    left: 240,
    width: 78,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  reviewTextContainer:{
    position: 'absolute',
    top: 660,
    left: 83,
    width: 76,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  statusTextContainer:{
    position: 'absolute',
    top: 660,
    left: 240,
    width: 78,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  homeScreenButtonText: {
    color: 'black',
    fontSize: 14,
  },
});
  
export default userHomePage;  