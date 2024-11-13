import { Text, View, Image, TouchableOpacity, StyleSheet, } from "react-native";
import { Link, useRouter, useRootNavigationState } from "expo-router";
import React from 'react';
import { useEffect } from 'react';

/* Uncomment this code if you would like to test a page that we haven't created a navigation to and change "folderName" with the name of the folder you would like to navigate to, then run npx expo start */
// export default function HomePage() {
//   const router = useRouter();
//   const navigationState = useRootNavigationState();

//   useEffect(() => {
//     if (navigationState?.key) { // Ensures the layout is ready
//       router.push('/folderName'); // Replace with your test route
//     }
//   }, [navigationState?.key]);

//   return null; // Keep this as null if you just want to redirect on load
// }

const LoginOrRegister = () => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../assets/images/MilkyWayRepair.png')} 
        style={styles.logo}
      />

      {/* Login Button */}
      <Link href="/login" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Link>

      {/* Register Button */}
      <Link href="/register" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    backgroundColor: '#fff',
  },
  logo: {
    width: 500,
    marginBottom: 40,
    marginLeft: 40,
  } as const,
  button: {
    width: 150,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#6B4F9B',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Calibri',
    fontSize: 23,
    textAlign: 'center',
  },
});

export default LoginOrRegister;
