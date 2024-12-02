import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from "@/config/config";

interface UserInfo {
  name: string;
  email: string;
  phone_number: string;
  notification_preference?: 'email' | 'phone';
}

const UserAccountInformationPage = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone_number: '',
    notification_preference: 'email'
  });

  useEffect(() => {
    console.log("Component mounted");
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log("UserId:", userId);

      if (!userId) {
        console.log("No userId found");
        return;
      }

      console.log("Fetching from:", `${SERVER_URL}/user/${userId}`);
      const response = await fetch(`${SERVER_URL}/user/${userId}`, {
        credentials: 'include'
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Received data:", data);
        setUserInfo({
          name: data.name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          notification_preference: data.notification_preference || 'email'
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Account Information</Text>
      
      {/* Basic Text Display */}
      <Text style={styles.text}>Name: {userInfo.name}</Text>
      <Text style={styles.text}>Email: {userInfo.email}</Text>
      <Text style={styles.text}>Phone: {userInfo.phone_number}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000000',
  },
  debugText: {
    marginTop: 20,
    color: 'red',
    fontSize: 14,
  },
});

export default UserAccountInformationPage;