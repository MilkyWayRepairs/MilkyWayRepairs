import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { firestore } from './firebaseConfig'; // Import Firebase configuration
import { Link } from 'expo-router';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: any;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(fetchedMessages);
      }, error => {
        console.error("Error fetching messages: ", error);
      });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const renderMessageItem = ({ item }: { item: Message }) => (
    <Link href={`/Messages/${item.id}`} style={styles.messageItem}>
      <View>
        <Text style={styles.senderText}>{item.sender}</Text>
        <Text style={styles.contentText}>{item.content}</Text>
        <Text style={styles.timestampText}>
          {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleString() : ''}
        </Text>
      </View>
    </Link>
  );

  return (
    <View style={styles.container}>
      {/* Header Section with Background Color */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
      </View>

      {/* List of Messages */}
      {messages.length === 0 ? (
        <Text style={styles.noMessagesText}>No messages found</Text>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Link href="/userHomePage">
            <Image source={require('../../assets/images/homeLogo.png')} style={styles.navIcon} />
            <Text style={styles.navText}>Home</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Link href="./account">
            <Image source={require('../../assets/images/accountLogo.png')} style={styles.navIcon} />
            <Text style={styles.navText}>Account</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#E0BBE4', // Light purple color (match with Figma)
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  noMessagesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  listContent: {
    paddingHorizontal: 16,
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

export default Messages;
