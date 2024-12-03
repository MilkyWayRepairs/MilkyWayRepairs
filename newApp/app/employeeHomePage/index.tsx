import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput, Animated } from "react-native";
import { Link, } from "expo-router"
import React from 'react';
// import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
//import { SlideOutRight, withDelay, withTiming } from "react-native-reanimated";
//import { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
//import Animat, { useSharedValue }ed from "react-native-reanimated";
import EmployeePageTemplate from "../employeePageTemplate";

const userHomePage = () => {
  return (
    <EmployeePageTemplate title="Employee Home">
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
        <Link href="/Messages" style={styles.messagesButtonContainer}>
          <Image
            source={require('../../assets/images/Messages.png')}
            style={styles.homeScreenButton}
          />
        </Link>

        {/* Logs Button */}
        <TouchableOpacity style={styles.logsButtonContainer}>
          <Link href="/logs">
            <Image
              source={require('../../assets/images/employeeLogs.png')}
              style={styles.homeScreenButton}
            />
          </Link>
        </TouchableOpacity>

        {/* Review Button */}
        <TouchableOpacity style={styles.reviewButtonContainer}>
              <Link href="/reviews">
                  <Image
                      source={require('../../assets/images/Review.png')}
                      style={styles.homeScreenButton}
                  />
              </Link>
          </TouchableOpacity>

        {/* Update Status Button */}
        <TouchableOpacity style={styles.updateStatusButtonContainer}>
          <Link href="/status/employee">
            <Image
              source={require('../../assets/images/Status.png')}
              style={styles.homeScreenButton}
            />
          </Link>
        </TouchableOpacity>

        {/* Schedule Appointment Text */}
        <View style={styles.scheduleAppointmentTextContainer}>
          <Text style={styles.homeScreenButtonText}>
              Schedule {"\n"}
              Appointment
          </Text>
        </View>

        {/* Messages Text */}
        <View style={styles.messagesTextContainer}>
          <Text style={styles.homeScreenButtonText}>
              Messages
          </Text>
        </View>

        {/* Logs Text */}
        <View style={styles.logsTextContainer}>
          <Text style={styles.homeScreenButtonText}>
              Add Log
          </Text>
        </View>

        {/* Review Text */}
        <View style={styles.reviewTextContainer}>
          <Text style={styles.homeScreenButtonText}>
              Reviews
          </Text>
        </View>

        {/* Status Text */}
        <View style={styles.statusTextContainer}>
          <Text style={styles.homeScreenButtonText}>
              Update {"\n"}
              Status
          </Text>
        </View>
      </View>
    </EmployeePageTemplate>
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
      left: 45,
      width: 78,
      height: 78,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messagesButtonContainer: {
      position: 'absolute',
      top: 240,
      left: 180,
      width: 78,
      height: 78,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logsButtonContainer: {
      position: 'absolute',
      top: 240,
      left: 310,
      width: 78,
      height: 78,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reviewButtonContainer: {
      position: 'absolute',
      top: 400,
      left: 100,
      width: 78,
      height: 78,
      justifyContent: 'center',
      alignItems: 'center',
    },
    updateStatusButtonContainer: {
      position: 'absolute',
      top: 400,
      left: 245,
      width: 78,
      height: 78,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scheduleAppointmentTextContainer:{
      position: 'absolute',
      top: 325,
      left: 20,
      width: 130,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    messagesTextContainer:{
        position: 'absolute',
        top: 330,
        left: 180,
        width: 78,
        height: 19,
        justifyContent: 'center',
        alignItems: 'center',        
    },
    logsTextContainer:{
      position: 'absolute',
      top: 330,
      left: 310,
      width: 78,
      height: 19,
      justifyContent: 'center',
      alignItems: 'center',        
    },
    reviewTextContainer:{
        position: 'absolute',
        top: 480,
        left: 98,
        width: 76,
        height: 19,
        justifyContent: 'center',
        alignItems: 'center',        
    },
    statusTextContainer:{
        position: 'absolute',
        top: 480,
        left: 244,
        width: 78,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',        
    },
    homeScreenButtonText: {
      color: 'black',
      fontSize: 14,
      textAlign: 'center',
    },
    homeScreenButton: {
      width: 78,
      height: 78,
    },

  });
  
  export default userHomePage;  