import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React from 'react';
//import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { SlideOutRight, withDelay, withTiming } from "react-native-reanimated";
import { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import NewPageTemplate from "../newPageTemplate";

const userHomePage = () => {

  return (
    <View style={styles.container}>
   
      <NewPageTemplate title="Home">
      </NewPageTemplate>
     
      {/* Logo */}
      <Image 
        source={require('../../assets/images/MilkyWayRepair.png')} 
        style={styles.logo}
      />

      {/* Schedule Appointment Button */}
      <TouchableOpacity style={styles.scheduleAppointmentButtonContainer}>
        <Link href="/scheduleAppointment">
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
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: 100,
    backgroundColor: '#fff',
  },
  logo: {
    top: -450,
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
    homeScreenButton: {
    width: 78,
    height: 78,
  },    
});
  
export default userHomePage;  