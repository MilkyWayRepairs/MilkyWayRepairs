import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

// Define the interface for the message object
interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const MessageDetail: React.FC = () => {
  const { id } = useLocalSearchParams(); // Get the message ID from the URL params
  const [message, setMessage] = useState<Message | null>(null); // State to store the fetched message
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [redirectToChat, setRedirectToChat] = useState(false); // State to manage redirection to ChatPage
  const router = useRouter(); // Router hook to navigate between pages

  // Effect to fetch the message when the component mounts or the ID changes
  useEffect(() => {
    const fetchMessage = async () => {
      if (id) {
        try {
          console.log('Fetching message with ID:', id); // Debugging line
          const response = await axios.get(`http://192.168.0.33:5000/messages/${id}`);
          if (response.status === 200) {
            setMessage(response.data); // Set the fetched message to state if successful
          } else {
            console.error('Message not found, setting redirect to chat');
            setRedirectToChat(true); // Set redirection flag if the message is not found
          }
        } catch (error) {
          console.error('Error fetching message:', error); // Log error if fetching fails
          setRedirectToChat(true); // Set redirection flag if fetching fails
        } finally {
          setLoading(false); // Set loading to false once the request is complete
        }
      }
    };

    fetchMessage();
  }, [id]);

  // Effect to handle redirection to ChatPage if needed
  useEffect(() => {
    if (redirectToChat) {
      navigateToChat();
    }
  }, [redirectToChat]);

  // Function to navigate to the ChatPage
  const navigateToChat = () => {
    // Navigate to the ChatPage, passing along the sender information
    router.push({
      pathname: './ChatPage',
      params: { id },
    });
  };

  // Display a loading message while the message is being fetched
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading message...</Text>
      </View>
    );
  }

  // If no message is found, navigate to ChatPage to create a new chat window
  if (!message) {
    return (
      <View style={styles.container}>
        <Text>No message found, redirecting to chat...</Text>
      </View>
    );
  }

  // Render the message details
  return (
    <View style={styles.container}>
      <Text style={styles.senderText}>{message.sender}</Text>
      <Text style={styles.contentText}>{message.content}</Text>
      <Text style={styles.timestampText}>
        {new Date(message.timestamp).toLocaleString()}
      </Text>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  senderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
  },
});

export default MessageDetail;
