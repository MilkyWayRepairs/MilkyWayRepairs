import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link } from "expo-router";
import React, { useState } from 'react';
import AccountSidebar from '../accountSidebar'; // Ensure the path is correct

// Custom Star Rating Component
const StarRating = () => {
  const [rating, setRating] = useState(0); // Initial rating value

  // Function to handle star press
  const handleStarPress = (star: number) => {
    setRating(star);
  };

  return (
      <View style={styles.starRatingContainer}>
        <Text style={styles.inputLabel}>Rating</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                <Text style={star <= rating ? styles.starFilled : styles.starEmpty}>★</Text>
              </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>You rated: {rating} milky star(s)</Text>
      </View>
  );
};

const Reviews = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleAccountPress = () => {
    setIsSidebarVisible(true); // Show the sidebar
  };

  const handleOverlayClose = () => {
    setIsSidebarVisible(false); // Hide the sidebar
  };

  return (
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
          <Text style={styles.headerTitle}>Write Your Review</Text>
        </View>

        {/* Container for Input Fields and Submit Button with Border */}
        <View style={styles.inputSection}>
          {/* Star Rating Component */}
          <StarRating />

          {/* Input Fields for Review */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Review</Text>
            <TextInput
                style={styles.reviewInput}
                placeholder="Thank You for Choosing Milky Way Repairs!"
                placeholderTextColor="#A9A9A9"
                multiline
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.button}>
            <Link href="./submittedReviews" style={styles.buttonLink}>
              <Text style={styles.buttonText}>Submit</Text>
            </Link>
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
  reviewInput: {
    width: '100%',
    height: 80,
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
  buttonLink: {
    width: '100%',
    alignItems: 'center',
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
  starRatingContainer: {
    width: '80%',
    marginBottom: 20,
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starFilled: {
    fontSize: 30,
    color: '#7b00ff',
    marginHorizontal: 5,
  },
  starEmpty: {
    fontSize: 30,
    color: '#CCCCCC',
    marginHorizontal: 5,
  },
  ratingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default Reviews;

