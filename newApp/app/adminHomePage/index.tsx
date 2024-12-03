
import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput, Animated } from "react-native";
import { Link, } from "expo-router"
import React from 'react';
//import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
//import { SlideOutRight, withDelay, withTiming } from "react-native-reanimated";
//import { useAnimatedStyle, withSpring, useSharedVal, withTimingue } from "react-native-reanimated";
//import Animat, { useAnimatedStyle }, { useSharedValue }ed from "react-native-reanimated";
import { ScrollView } from 'react-native'; // Import ScrollView
import AdminPageTemplate from "../adminPageTemplate";


const AdminHomePage = () => {
  return (
    <AdminPageTemplate title='Admin Home'>
      <View style={styles.contentContainer}>
        {/* Logo */}
        <Image 
          source={require('../../assets/images/MilkyWayRepair.png')} 
          style={styles.logo}
        />
      </View>
      <ScrollView
      horizontal={true} // Enable horizontal scrolling
      showsHorizontalScrollIndicator={false} // Hide the scrollbar if not needed
      contentContainerStyle={styles2.scrollContainer} // Add a container style for alignment
      >
        {/* Set Employee Schedule button*/}
        <TouchableOpacity style={styles2.scrollButtonContainer}>
        <Link href="/adminHomePage/setSchedule">  <Image
            source={require('../../assets/images/ScheduleAppointment.png')}
            style={styles2.homeScreenButton}
          />
          </Link>

          <Text style={styles2.homeScreenButtonText}>Manager Controls </Text>
        </TouchableOpacity>

        {/* Messages Button */}
        <TouchableOpacity style={styles2.scrollButtonContainer}>
          <Link href="/Messages">
          <Image
            source={require('../../assets/images/Messages.png')}
            style={styles2.homeScreenButton}
          />
          </Link>
          <Text style={styles2.homeScreenButtonText}>Messages</Text>
        </TouchableOpacity>

        {/* Review Button */}
        <TouchableOpacity style={styles2.scrollButtonContainer}>
        <Link href="/reviews">  <Image
            source={require('../../assets/images/Review.png')}
            style={styles2.homeScreenButton}
          />
          </Link>

          <Text style={styles2.homeScreenButtonText}>Reviews </Text>
        </TouchableOpacity>

        {/* Status Button */}
        <TouchableOpacity style={styles2.scrollButtonContainer}>
          <Link href="/status/employee">
          <Image
            source={require('../../assets/images/Status.png')}
            style={styles2.homeScreenButton}
          />
          </Link>
          <Text style={styles2.homeScreenButtonText}>Update Status</Text>
        </TouchableOpacity>

        {/* Logs Button */}
        <TouchableOpacity style={styles2.scrollButtonContainer}>
          <Link href="/logs">
          <Image
            source={require('../../assets/images/employeeLogs.png')}
            style={styles2.homeScreenButton}
          />
          </Link>
          <Text style={styles2.homeScreenButtonText}>Add Log</Text>
        </TouchableOpacity>

        {/* Manager Button */}
        <TouchableOpacity style={styles2.scrollButtonContainer}>
          <Link href="/adminControls">
          <Image
            source={require('../../assets/images/Manager.png')}
            style={styles2.homeScreenButton}
          />
          </Link>
          <Text style={styles2.homeScreenButtonText}>Manager</Text>
        </TouchableOpacity>
      </ScrollView>
    </AdminPageTemplate>
  );
};


const styles2 = StyleSheet.create({
  // Add a container style for the ScrollView
  scrollContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'flex-start', // Align items to the start
    paddingHorizontal: 10, // Optional: add padding on the left and right
    top: -50,
  },
  scrollButtonContainer: {
    marginHorizontal: 10, // Add space between buttons
    alignItems: 'center', // Center items in each button container
  },
  homeScreenButton: {
    width: 78,
    height: 78,
    marginBottom: 5, // Add space between the image and text
  },
  homeScreenButtonText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
  },
});

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
    top: 420,
    left: 45,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesButtonContainer: {
    position: 'absolute',
    top: 420,
    left: 180,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewButtonContainer: {
    position: 'absolute',
    top: 580,
    left: 45,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButtonContainer: {
    position: 'absolute',
    top: 580,
    left: 180,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logsButtonContainer: {
    position: 'absolute',
    top: 417,
    left: 310,
    width: 78,
    height: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },
  managerButtonContainer: {
    position: 'absolute',
    top: 580,
    left: 310,
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
    left: 45,
    width: 92,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  messagesTextContainer:{
    position: 'absolute',
    top: 510,
    left: 180,
    width: 78,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  reviewTextContainer:{
    position: 'absolute',
    top: 660,
    left: 45,
    width: 76,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  statusTextContainer:{
    position: 'absolute',
    top: 660,
    left: 180,
    width: 78,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  logsTextContainer:{
    position: 'absolute',
    top: 510,
    left: 310,
    width: 78,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',        
  },
  managerTextContainer:{
    position: 'absolute',
    top: 660,
    left: 310,
    width: 78,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeScreenButtonText: {
    color: 'black',
    fontSize: 14,
  },
});
  
export default AdminHomePage;  
