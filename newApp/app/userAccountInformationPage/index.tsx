import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from "@/config/config";
import { Link } from 'expo-router';
import NewPageTemplate from '../newPageTemplate'

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

  const handleNotificationPreferenceChange = async (value: string) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await fetch(`${SERVER_URL}/user/${userId}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          notification_preference: value
        })
      });

      if (response.ok) {
        setUserInfo(prev => ({
          ...prev,
          notification_preference: value
        }));
      }
    } catch (error) {
      console.error('Error updating notification preference:', error);
    }
  };

  const handleAccountPress = () => {
    console.log('Account button pressed');
  };

  const edit = () => {
    
  }

  return (
    <NewPageTemplate title = 'User Account Information'>
      <View style={styles.container}>
        {/* Basic Text Display */}
        <Text style={styles.text}>Name: {userInfo.name}</Text>
        <Text style={styles.text}>Email: {userInfo.email}</Text>
        <Text style={styles.text}>Phone: {userInfo.phone_number}</Text>
        
        {/* Notification Preference Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.text}>Notification Preference:</Text>
          <Picker
            selectedValue={userInfo.notification_preference}
            style={styles.picker}
            onValueChange={(itemValue) => handleNotificationPreferenceChange(itemValue)}
          >
            <Picker.Item label="Email" value="email" />
            <Picker.Item label="SMS Message" value="sms" />
          </Picker>
        </View>

        <View>
          <TouchableOpacity style={styles.button} onPress={edit}>
            <Text style={styles.buttonText}>Edit Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </NewPageTemplate>
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
  pickerContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#E0BBE4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },  
});

export default UserAccountInformationPage;