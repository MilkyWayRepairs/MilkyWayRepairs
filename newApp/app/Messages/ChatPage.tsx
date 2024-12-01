import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';//npm install @react-native-async-storage/async-storage
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SERVER_URL } from '@/config/config';
import SendBird from 'sendbird';



interface Message {
  id?: number;
  message_id?: number;
  content: string;
  sender: string;
  timestamp: string;
}


const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { receiverId, receiverName } = useLocalSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const sb = new SendBird({ appId: '5D0726A7-302C-4867-867E-ED5500933EC8' });

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          sb.connect(storedUserId, (user, error) => {
            if (error) {
              console.error('Sendbird connection error:', error);
            } else {
              console.log('Connected to Sendbird:', user);
            }
          });
        }
      } catch (error) {
        console.error('Error getting userId:', error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !receiverId) return;
      
      try {
        console.log(`Fetching messages between ${userId} and ${receiverId}`);
        const response = await axios.get(`${SERVER_URL}/messages`, {
          params: {
            sender_id: userId,
            receiver_id: receiverId
          }
        });
        console.log('Received messages:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    // Set up an interval to fetch messages periodically
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [userId, receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || !receiverId) return;

    try {
      const payload = {
        sender_id: userId,
        receiver_id: receiverId,
        content: newMessage.trim()
      };

      console.log("Attempting to send message...");
      console.log("Sending payload:", payload);

      const response = await axios.post(`${SERVER_URL}/messages`, payload);
      console.log("Message sent successfully:", response.data);

      const newMsg: Message = {
        id: response.data.id,
        message_id: response.data.id,
        content: newMessage.trim(),
        sender: userId,
        timestamp: response.data.timestamp || new Date().toISOString()
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getMessageKey = (message: Message): string => {
    if (message.message_id) return message.message_id.toString();
    if (message.id) return message.id.toString();
    return `${message.sender}-${message.timestamp}-${message.content}`;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.sender === userId;
    const key = getMessageKey(item);
    
    return (
      <View 
        key={key}
        style={[
          styles.messageItem, 
          isMyMessage ? styles.myMessage : styles.theirMessage
        ]}
      >
        <Text style={styles.messageContent}>{item.content}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
<View style={styles.header}>
  {/* Back Arrow */}
  <TouchableOpacity style={styles.arrowBack} onPress={() => router.back()}>
    <Image
      source={require('../../assets/images/arrowBack.png')} // Ensure the correct path to your arrow image
      style={styles.arrowIcon} // Style for the arrow icon
    />
  </TouchableOpacity>

  {/* Header Title */}
  <Text style={styles.headerText}>{receiverName}</Text>
</View>
      
      <View style={styles.messagesWrapper}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={getMessageKey}
          contentContainerStyle={styles.messagesContainer}
        />
      </View>

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'center',
    backgroundColor: '#E0BBE4', // Adjust background color
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  messagesWrapper: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
  },
  messageItem: {
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
    borderRadius: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#7cc4ff',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageContent: {
    fontSize: 16,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#E5ECE4',
    position: 'absolute',
    bottom:55,
    width: '100%',
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#c4cec3',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
    minHeight: 40,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    backgroundColor: '#E0BBE4',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0BBE4',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  arrowBack: {
    position: 'absolute',
    left: 15, // Position the arrow to the left
    zIndex: 1,
  },
  arrowIcon: {
    width: 24, // Adjust size
    height: 24, // Adjust size
    tintColor: '#333', // Optional: adjust color if the icon supports tinting
  },
});

export default ChatPage;


function generateTemporaryId(): string {
  throw new Error('Function not implemented.');
}
function generateUniqueId() {
  throw new Error('Function not implemented.');
}





