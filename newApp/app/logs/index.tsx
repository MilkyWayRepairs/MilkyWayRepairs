import { Text, View, Image, TouchableOpacity, Alert, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Link, useRouter } from "expo-router";
import React, { useState, useEffect } from 'react';
import AccountSidebar from '../accountSidebar'; // Ensure the path is correct
import { SERVER_URL } from "@/config/config";
import { Picker } from '@react-native-picker/picker';

// Add this interface
interface LogFormData {
  date: string;
  mileage: string;
  VIN: string;
  jobTitle: string;
  jobNotes: string;
}
interface Job {
    job_id: number;
    service_id: number;
    rating: number;
    feedback: string;
}

const AddLogs = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [formData, setFormData] = useState<LogFormData>({
    date: '',
    mileage: '',
    VIN: '',
    jobTitle: '',
    jobNotes: ''
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/jobs`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    
    fetchJobs();
  }, []);

  const getPlaceholder = (field: string) => {
    switch(field) {
      case 'date': return 'Enter date (MM/DD/YYYY)';
      case 'mileage': return 'Enter current mileage';
      case 'VIN': return 'Enter 17-character VIN';
      case 'jobTitle': return 'Enter job title (min. 3 characters)';
      case 'jobNotes': return 'Enter detailed job notes (min. 10 characters)';
      default: return `Enter ${field}`;
    }
  };

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
    // Validation checks
    if (!formData.date) {
      Alert.alert("Error", "Please enter a date");
      return;
    }
    if (!formData.mileage || isNaN(Number(formData.mileage))) {
      Alert.alert("Error", "Please enter a valid mileage number");
      return;
    }
    // if (!formData.vin || formData.vin.length !== 17) {
    //   Alert.alert("Error", "Please enter a valid 17-character VIN");
    //   return;
    // }
    // if (!formData.jobTitle) {
    //   Alert.alert("Error", "Please select a job");
    //   return;
    // }
    if (!formData.jobNotes || formData.jobNotes.length < 10) {
      Alert.alert("Error", "Please enter detailed job notes (minimum 10 characters)");
      return;
    }

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
          VIN: formData.VIN,
          jobTitle: formData.jobTitle,
          jobNotes: formData.jobNotes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Logs submitted successfully!");
        setFormData({ date: '', mileage: '', VIN: '', jobTitle: '', jobNotes: '' });
        router.push("/logs/submittedLogs");
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
          {['date', 'mileage', 'VIN', 'jobTitle', 'jobNotes'].map((field, index) => (
            <View style={styles.inputContainer} key={index}>
              <Text style={styles.inputLabel}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </Text>
              {field === 'jobTitle' ? (
                <Picker
                  selectedValue={formData.jobTitle}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleInputChange('jobTitle', itemValue)}
                >
                  <Picker.Item label="Select a job" value="" />
                  {jobs.map((job) => (
                    <Picker.Item 
                      key={job.job_id} 
                      label={job.feedback || `Job ${job.job_id}`}
                      value={job.job_id} 
                    />
                  ))}
                </Picker>
              ) : (
                <TextInput
                  style={styles.textInput}
                  placeholder={getPlaceholder(field)}
                  placeholderTextColor="#A9A9A9"
                  value={formData[field as keyof LogFormData]}
                  onChangeText={(value) => handleInputChange(field as keyof LogFormData, value)}
                  multiline={field === 'jobNotes'}
                />
              )}
            </View>
          ))}

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={submitLogs}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
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
    backgroundColor: '#6B4F9B',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
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
    height: 50,
    width: 50,
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
    fontSize: 14,
    color: '#000',
  },
  picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default AddLogs;

