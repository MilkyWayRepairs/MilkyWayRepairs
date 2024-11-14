import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link, } from "expo-router"
import React from 'react';
import { rgbaColor } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { SlideOutRight, withDelay, withTiming } from "react-native-reanimated";
import { useAnimatedStyle, withSpring, useSharedValue } from "react-native-reanimated";
import Animated from "react-native-reanimated";

const HomeAndAdminOverlay = () => {
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
            <Link href="/homeAndAdminOverlay">
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default HomeAndAdminOverlay;
