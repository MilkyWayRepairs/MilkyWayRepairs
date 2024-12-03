import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
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

  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<UserInfo>({ ...userInfo });

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
        setEditedInfo({
          name: data.name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          notification_preference: data.notification_preference || 'email'
        })
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);  // toggles edit mode
    setEditedInfo({ ...userInfo }); // reset the editing fields to current user info
  }

  const handleSave = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId'); // Retrieve user ID
      if (!userId) {
        Alert.alert("Error", "User ID not found.");
        return;
      }
  
      // Send a PUT request to update user info
      const response = await fetch(`${SERVER_URL}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedInfo), // Send edited info
      });
  
      const result = await response.json();
      console.log("Response:", result);
  
      if (response.ok) {
        // Update local state and exit editing mode
        setUserInfo(editedInfo);
        setIsEditing(false);
        Alert.alert("Success", "Information updated successfully.");
      } else {
        Alert.alert("Error", result.error || "Failed to update information.");
      }
    } catch (error) {
      console.error("Error saving user info:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };
  
  

  // const handleNotificationPreferenceChange = async (value: string) => {
  //   try {
  //     const userId = await AsyncStorage.getItem('userId');
  //     if (!userId) return;

  //     const response = await fetch(`${SERVER_URL}/user/${userId}/preferences`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify({
  //         notification_preference: value
  //       })
  //     });

  //     if (response.ok) {
  //       setUserInfo(prev => ({
  //         ...prev,
  //         notification_preference: value
  //       }));
  //     }
  //   } catch (error) {
  //     console.error('Error updating notification preference:', error);
  //   }
  // };

  // const handleAccountPress = () => {
  //   console.log('Account button pressed');
  // };

  return (
    <NewPageTemplate title = 'User Account Information'>
      <View style={styles.container}>
        {/* Conditionally render the view */}
        {isEditing ? (
          // Editing Mode
          <View style={styles.editForm}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={editedInfo.name}
              onChangeText={(text) =>
                setEditedInfo((prev) => ({ ...prev, name: text }))
              }
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={editedInfo.email}
              onChangeText={(text) =>
                setEditedInfo((prev) => ({ ...prev, email: text }))
              }
            />

            <Text style={styles.label}>Phone:</Text>
            <TextInput
              style={styles.input}
              value={editedInfo.phone_number}
              onChangeText={(text) =>
                setEditedInfo((prev) => ({ ...prev, phone_number: text }))
              }
            />
          </View>
        ) : (
          // Viewing Mode
          <View>
            <Text style={styles.text}>Name: {userInfo.name}</Text>
            <Text style={styles.text}>Email: {userInfo.email}</Text>
            <Text style={styles.text}>Phone: {userInfo.phone_number}</Text>
          </View>
        )}

        {/* Button to toggle editing */}
        <TouchableOpacity style={styles.button} onPress={isEditing ? handleSave : handleEditToggle}>
          <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit Info'}</Text>
        </TouchableOpacity>
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
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
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
    backgroundColor: '#6B4F9B',
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
  editForm: {
    marginBottom: 20,
  },
});

export default UserAccountInformationPage;