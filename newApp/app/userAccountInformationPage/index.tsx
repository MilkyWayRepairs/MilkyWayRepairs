import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from "@/config/config";
import { Link } from 'expo-router';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Account Information</Text>
      
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.homeButtonContainer}>
          <Link href="/userHomePage">
            {"  "}
            <Image
              source={require('../../assets/images/homeLogo.png')}
              style={styles.navIcon}/>
            {"\n"}
            <Text style={styles.navText}>Home</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountButtonContainer} onPress={handleAccountPress}>
          <Image source={require('../../assets/images/accountLogo.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  homeButtonContainer: {
    flex: 1,
    backgroundColor: '#EBE4EC',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  accountButtonContainer: {
    flex: 1,
    backgroundColor: '#E5ECE4',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  navIcon: {
    width: 30,
    height: 30,
  },
  navText: {
    color: 'black',
  },
});

export default UserAccountInformationPage;