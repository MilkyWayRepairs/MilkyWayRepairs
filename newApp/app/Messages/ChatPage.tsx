import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';//npm install @react-native-async-storage/async-storage
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SERVER_URL } from '@/config/config';
import SendBird from 'sendbird';

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: any;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { receiverId, receiverName } = useLocalSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [receiverDataReady, setReceiverDataReady] = useState(false);

  const sb = new SendBird({ appId: '5D0726A7-302C-4867-867E-ED5500933EC8' });

  //debugging
  useEffect(() => {
    console.log("Debug: Extracted receiverId:", receiverId);
    console.log("Debug: Extracted receiverName:", receiverName);
  }, []);

  useEffect(() => {
    const connectToSendbird = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          console.log("Retrieved userId from AsyncStorage:", storedUserId);  // Add logging here to confirm retrieval
          setUserId(storedUserId);
          sb.connect(storedUserId, (user, error) => {
            if (error) {
              console.error('Sendbird connection error:', error);
            } else {
              console.log('Connected to Sendbird:', user);
            }
          });
        } else {
          console.error("userId not found in AsyncStorage");
        }
      } catch (error) {
        console.error('Error accessing AsyncStorage:', error);
      }
    };
  
    connectToSendbird();
  }, []);
  

  useEffect(() => {
    if (receiverId) {
      setReceiverDataReady(true);
    }
  }, [receiverId]);

  useEffect(() => {
    if (receiverDataReady) {
      fetchOrCreateChat();
    }
  }, [receiverDataReady]);

  const fetchOrCreateChat = async () => {
    if (!receiverId) {
      console.error("Receiver ID is missing, redirecting to default page...");
      router.push('../Messages'); // Redirect to a safe fallback route
      return null;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/chat`, {
        sender_id: userId,
        receiver_id: receiverId,
      });

      if (response.status === 200) {
        // Existing chat
        setMessages(response.data.messages);
      } else if (response.status === 201) {
        // New chat created
        setMessages([{ id: Math.random(), content: "Chat started", sender: `User${userId}`, timestamp: new Date().toISOString() }]);
      }
    } catch (error) {
      console.error('Error fetching or creating chat:', error);
    }
  };

  const sendMessage = async () => {
    console.log("Attempting to send message...");
    if (!newMessage.trim()) {
      console.error("Message is empty, not sending.");
      return;
    }
  
    if (!userId) {
      console.error("userId is not set, cannot send message.");
      return;
    }
  
    if (!receiverId) {
      console.error("receiverId is not set, cannot send message.");
      return;
    }
  
    const payload = {
      sender_id: userId,
      receiver_id: receiverId,
      content: newMessage,
    };
  
    console.log("Sending payload:", payload);  // Log the payload for debugging
  
    try {
      const response = await axios.post(`${SERVER_URL}/messages`, payload);
      if (response.status === 201) {
        console.log("Message sent successfully:", response.data);
        setMessages((prev) => [...prev, response.data]);
        setNewMessage('');
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageItem, item.sender === `User${userId}` ? styles.myMessage : styles.theirMessage]}>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('./Messages')}>
          <Text>{receiverName || 'Mechanic'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0BBE4',
    padding: 15,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  messageItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#E0BBE4',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageContent: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#E0BBE4',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatPage;
