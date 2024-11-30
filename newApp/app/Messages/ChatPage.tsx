import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // npm install @react-native-async-storage/async-storage
import {
  View,Image,Text,StyleSheet,FlatList,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,SafeAreaView,Keyboard,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { SERVER_URL } from '@/config/config';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedReceiverId = await AsyncStorage.getItem('receiverId');
        const storedReceiverName = await AsyncStorage.getItem('receiverName');

        if (storedUserId && storedReceiverId && storedReceiverName) {
          setUserId(storedUserId);
          setReceiverId(storedReceiverId);
          setReceiverName(storedReceiverName);
        } else {
          router.push('../Login'); // Redirect to login if data is missing
        }
      } catch (error) {
        console.error('Error fetching AsyncStorage data:', error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (userId && receiverId) {
      fetchMessages();
    }
  }, [userId, receiverId]);

  // Polling mechanism to fetch new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId && receiverId) {
        fetchMessages();
      }
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [userId, receiverId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/chat_history`, {
        params: { sender_id: userId, receiver_id: receiverId },
      });
      if (response.status === 200) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || !receiverId) {
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/messages`, {
        sender_id: userId,
        receiver_id: receiverId,
        content: newMessage,
      });

      if (response.status === 201) {
        // Append the new message locally
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: response.data.message_id,
            content: newMessage,
            sender: `User${userId}`,
            timestamp: new Date().toISOString(),
          },
        ]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageItem,
        item.sender === `User${userId}` ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require('../../assets/images/arrowBack.png')}
              style={styles.arrowBackIcon}
            />
          </TouchableOpacity>
          <Text style={styles.receiverName}>{receiverName || 'Recipient'}</Text>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
        />

        {/* Input Box */}
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
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  arrowBackIcon: {
    width: 24,
    height: 24,
  },
  receiverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#E5ECE4',
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
});

export default ChatPage;