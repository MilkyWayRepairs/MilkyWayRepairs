// app/Messages/[id].tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { firestore } from './firebaseConfig'; // Import Firebase configuration

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

const MessageDetail: React.FC = () => {

    const { id } = useLocalSearchParams(); // Get the message ID from the URL params
    const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      if (id) {
        try {
          const messageRef = firestore.collection('messages').doc(id as string);
          const doc = await messageRef.get();
          if (doc.exists) {
            setMessage(doc.data() as Message);
          }
        } catch (error) {
          console.error('Error fetching message:', error);
        }
      }
    };
    fetchMessage();
  }, [id]);

  if (!message) {
    return (
      <View style={styles.container}>
        <Text>Loading message...</Text>
      </View>
    );
  }

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
