import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React from 'react';
//import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
// import { SlideOutRight, withDelay, withTiming } from "react-native-reanimated";
// import { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
// import Animated from "react-native-reanimated";
import NewPageTemplate from "../newPageTemplate";

const UserHomePage = () => {
  return (
    <NewPageTemplate title="Home">
      <View style={styles.contentContainer}>
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
        <TouchableOpacity style={styles.messagesButtonContainer}>
          <Link href="/Messages">
            <Image
              source={require('../../assets/images/Messages.png')}
              style={styles.homeScreenButton}
            />
          </Link>
        </TouchableOpacity>

        {/* Status Button */}
        <TouchableOpacity style={styles.statusButtonContainer}>
          <Link href="/status/customerChoseVehicle">
            <Image
              source={require('../../assets/images/Status.png')}
              style={styles.homeScreenButton}
            />
          </Link>
        </TouchableOpacity>

      {/* Review Button */}
      <TouchableOpacity style={styles.reviewButtonContainer}>
          <Link href="/reviews/submittedReviews">
              <Image
                  source={require('../../assets/images/Review.png')}
                  style={styles.homeScreenButton}
              />
          </Link>
        </TouchableOpacity>

        {/* All the text containers for buttons */}
        <View style={styles.scheduleAppointmentTextContainer}>
          <Text style={styles.homeScreenButtonText}>
            {"  "} Schedule {"\n"}
            Appointment
          </Text>
        </View>

        <View style={styles.messagesTextContainer}>
          <Text style={styles.homeScreenButtonText}>
            Messages
          </Text>
        </View>

        <View style={styles.statusTextContainer}>
          <Text style={styles.homeScreenButtonText}>
            Status
          </Text>
        </View>

        <View style={styles.reviewTextContainer}>
          <Text style={styles.homeScreenButtonText}>
            Reviews
          </Text>
        </View>
      </View>
    </NewPageTemplate>
  );
};

// Styling
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginLeft: 10,
    marginTop: 100,
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    backgroundColor: 'white',
  },
  logo: {
    width: 357,
    height: 248,
    marginTop: -40,
  },
  scheduleAppointmentButtonContainer: {
    position: 'absolute',
    top: 240,
    left: 76,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesButtonContainer: {
    position: 'absolute',
    top: 240,
    left: 240,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewButtonContainer: {
    position: 'absolute',
    top: 400,
    left: 75,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButtonContainer: {
    position: 'absolute',
    top: 400,
    left: 240,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleAppointmentTextContainer:{
    position: 'absolute',
    top: 325,
    left: 63,
    width: 112,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  messagesTextContainer:{
    position: 'absolute',
    top: 330,
    left: 240,
    width: 78,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  reviewTextContainer:{
    position: 'absolute',
    top: 480,
    left: 76,
    width: 76,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  statusTextContainer:{
    position: 'absolute',
    top: 480,
    left: 240,
    width: 78,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  homeScreenButton: {
    width: 78,
    height: 78,
  },    
  homeScreenButtonText: {
    color: 'black',
    fontSize: 14,
  },
});
  
export default UserHomePage;  