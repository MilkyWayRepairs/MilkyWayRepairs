import { Text, View, Image, TouchableOpacity, Alert, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Link, useRouter } from "expo-router";
import React, { useState } from 'react';
import AccountSidebar from '../accountSidebar'; // Ensure the path is correct
import { SERVER_URL } from "@/config/config";

// Add this interface
interface LogFormData {
  date: string;
  mileage: string;
  vin: string;
  jobTitle: string;
  jobNotes: string;
}

const AddLogs = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [formData, setFormData] = useState<LogFormData>({
    date: '',
    mileage: '',
    vin: '',
    jobTitle: '',
    jobNotes: ''
  });
  const router = useRouter();

  const handleAccountPress = () => {
    setIsSidebarVisible(true); // Show the sidebar
  };

  const handleOverlayClose = () => {
    setIsSidebarVisible(false); // Hide the sidebar
  };

  const handleInputChange = (field: keyof LogFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const submitLogs = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/logs`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          date: formData.date,
          mileage: formData.mileage,
          vin: formData.vin,
          jobTitle: formData.jobTitle,
          jobNotes: formData.jobNotes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Logs submitted successfully!");
        setFormData({ date: '', mileage: '', vin: '', jobTitle: '', jobNotes: '' });
        router.push("/(app)/logs/submittedLogs");
      } else {
        Alert.alert("Error", data.error || "Failed to submit logs. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while submitting the logs.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Back Arrow and Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.arrowBackContainer}>
            <Link href="..">
              <Image
                source={require('../../assets/images/arrowBack.png')}
                style={styles.arrowBack}
              />
            </Link>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Logs</Text>
        </View>

        {/* Container for Input Fields and Submit Button */}
        <View style={styles.inputSection}>
          {/* Input Fields */}
          {['date', 'mileage', 'vin', 'jobTitle', 'jobNotes'].map((field, index) => (
            <View style={styles.inputContainer} key={index}>
              <Text style={styles.inputLabel}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={`Enter ${field}`}
                placeholderTextColor="#A9A9A9"
                value={formData[field as keyof LogFormData]}
                onChangeText={(value) => handleInputChange(field as keyof LogFormData, value)}
                multiline={field === 'jobNotes'}
              />
            </View>
          ))}

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={submitLogs}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navButton}>
            <Link href="/userHomePage">
              <Image source={require('../../assets/images/homeLogo.png')} style={styles.navIcon} />
              <Text style={styles.navText}>Home</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleAccountPress}>
            <Image source={require('../../assets/images/accountLogo.png')} style={styles.navIcon} />
            <Text style={styles.navText}>Account</Text>
          </TouchableOpacity>
        </View>

        {/* Account Sidebar */}
        <AccountSidebar isVisible={isSidebarVisible} onClose={handleOverlayClose} />
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#E0BBE4',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 40,
  },
  arrowBackContainer: {
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowBack: {
    height: 30,
    width: 30,
  },
  inputSection: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 20,
    marginBottom: 5,
    color: '#333',
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '80%',
    paddingVertical: 10,
    backgroundColor: '#6B4F9B',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  navButton: {
    alignItems: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
  },
  navText: {
    fontSize: 14,
    color: '#000',
  },
});

export default AddLogs;
