import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SERVER_URL } from '@/config/config';

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: any;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { receiverId, receiverName } = useLocalSearchParams() ;
  const router = useRouter();
  console.log("Extracted Receiver ID:", receiverId);
  console.log("Extracted Receiver Name:", receiverName);
  const senderId = 1; // Example sender ID
  


  
  useEffect(() => {
    console.log("Receiver ID1:", receiverId); // Debugging
    console.log("Receiver Name1:", receiverName); // Debugging
    if (receiverId) {
      fetchOrCreateChat();
    }
    
  }, [receiverId]);

  const fetchOrCreateChat = async () => {
    if (!receiverId) {
      console.error("Receiver ID is missing, redirecting to default page...");
      router.push('../Messages'); // Redirect to a safe fallback route
      return null;
  }

    try {
      const response = await axios.post(`${SERVER_URL}/chat`, {
        sender_id: senderId,
        receiver_id: receiverId,
      });

      if (response.status === 200) {
        // Existing chat
        setMessages(response.data.messages);
      } else if (response.status === 201) {
        // New chat created
        setMessages([{ id: Math.random(), content: "Chat started", sender: `User${senderId}`, timestamp: new Date().toISOString() }]);
      }
    } catch (error) {
      console.error('Error fetching or creating chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const payload = {
        sender_id: senderId,
        receiver_id: receiverId,  // Ensure this is included
        content: newMessage,
    };

    console.log("Sending payload:", payload);  // Log the payload for debugging

    try {
        const response = await axios.post(`${SERVER_URL}/messages`, payload);
        setMessages((prev) => [...prev, response.data]);
        setNewMessage('');
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

  

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageItem, item.sender === `User${senderId}` ? styles.myMessage : styles.theirMessage]}>
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
