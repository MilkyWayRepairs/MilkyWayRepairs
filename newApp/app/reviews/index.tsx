import { Text, View, Image, TouchableOpacity, Alert, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Link, useRouter } from "expo-router";
import React, { useState } from 'react';
import { SERVER_URL } from "../../config/config";
import AccountSidebar from '../accountSidebar';
import BottomNav from '../bottomNavBar';

const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
  const handleStarPress = (star: number) => {
    setRating(star)
  }

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
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const router = useRouter()

  const handleAccountPress = () => {
    setIsSidebarVisible(true);
  };

  const handleOverlayClose = () => {
    setIsSidebarVisible(false);
  };

  const submitReview = async () => {
    if (!review.trim()) {
      Alert.alert("Error", "Review cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: review.trim(), rating: rating }),
      });

      if (response.ok) {
        Alert.alert("Success", "Review submitted successfully!");
        setReview(""); // Clear the input field after success
        setRating(0)
        router.push("/reviews/submittedReviews")
      } else {
        Alert.alert("Error", "Failed to submit review. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while submitting the review.");
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
          <Text style={styles.headerTitle}>Write Your Review</Text>
        </View>

        {/* Container for Input Fields and Submit Button with Border */}
        <View style={styles.inputSection}>
          <StarRating rating={rating} setRating={setRating} />
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Review</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Thank You for Choosing Milky Way Repairs!"
              placeholderTextColor="#A9A9A9"
              value={review}
              onChangeText={setReview}
              multiline
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={submitReview}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation Bar */}
        <BottomNav currentRoute="reviews" />

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
    paddingBottom: 97,
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

