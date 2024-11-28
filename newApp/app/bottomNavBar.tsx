import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Animated from "react-native-reanimated";

interface BottomNavProps {
  currentRoute?: string; // Optional prop to highlight current route
}

const BottomNav: React.FC<BottomNavProps> = ({ currentRoute }) => {
  const translateX = useSharedValue(400);
  const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleAccountPress = () => {
    setIsOverlayVisible(true);
    translateX.value = withTiming(10);
  };

  const handleOverlayClose = () => {
    setIsOverlayVisible(false);
    translateX.value = withTiming(400);
  };

  return (
    <View style={styles.container}>
      {/* Home Button */}
      <TouchableOpacity style={styles.homeButtonContainer}>
        <Link href="/userHomePage">
          {"  "}
          <Image
            source={require('../assets/images/homeLogo.png')}
            style={styles.homeAndAccountButton}
          />
          {"\n"}
          <Text style={styles.homeAndAccountText}>
            Home
          </Text>
        </Link>
      </TouchableOpacity>

      {/* Account Button */}
      <TouchableOpacity 
        style={styles.accountButtonContainer}
        onPress={handleAccountPress}
      >
        <Text>
          {"                                 "}
          <Image
            source={require('../assets/images/accountLogo.png')}
            style={styles.homeAndAccountButton}
          />
          {"\n                             "}
          <Text style={styles.homeAndAccountText}>
            Account
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Account Overlay */}
      {isOverlayVisible && (
        <TouchableOpacity 
          style={styles.overlayBackground}
          activeOpacity={0} 
          onPress={handleOverlayClose}
        />
      )}

      <Animated.View 
        style={[styles.accountOverlayContainer, animatedStyles]}
        onStartShouldSetResponder={() => true}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <View style={[styles.accountOverlayContent, styles.logoutContent]}>
          <Link href="/login">
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 97,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  homeButtonContainer: {
    height: 97,
    width: 225,
    backgroundColor: "#EBE4EC",
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  accountButtonContainer: {
    width: 300,
    height: 97,
    backgroundColor: "#E5ECE4",
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  homeAndAccountButton: {
    height: 30,
    width: 30,
  },
  homeAndAccountText: {
    color: 'black',
  },
  accountOverlayContainer: {
    position: 'absolute',
    top: -620,
    right: 15,
    width: 185,
    height: '700%',
    backgroundColor: "#EBE4EC",
    zIndex: 2,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
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
    top: 10,
  },
  performanceContent: {
    top: 100,
  },
  upcomingAppointmentsContent: {
    top: 190,
  },
  accountInformationContent: {
    top: 280,
  },
  accountOverlayText: {
    color: 'black',
  },
  overlayBackground: {
    position: 'absolute',
    top: -800,
    left: -20,
    width: '120%',
    height: '900%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
});

export default BottomNav;