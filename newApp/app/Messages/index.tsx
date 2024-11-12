// app/Messages/messages.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { firestore } from './firebaseConfig'; // Import Firebase configuration
import { Link } from 'expo-router';


interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch messages from Firebase Firestore
  useEffect(() => {
    const unsubscribe = firestore.collection('messages') // Adjust the collection name if necessary
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(fetchedMessages);
      });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Render each message item
  const renderMessageItem = ({ item }: { item: Message }) => (
    <Link href={`./Messages/${item.id}`} style={styles.messageItem}>
      <View style={styles.messageItem}>
        <Text style={styles.senderText}>{item.sender}</Text>
        <Text style={styles.contentText}>{item.content}</Text>
        <Text style={styles.timestampText}>{item.timestamp}</Text>
      </View>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  messageItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    width: '100%',
  },
  senderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
});

export default Messages;
