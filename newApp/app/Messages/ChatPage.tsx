import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';//npm install @react-native-async-storage/async-storage
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SERVER_URL } from '@/config/config';
import SendBird from 'sendbird';
import NewPageTemplate from '../newPageTemplate';



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

  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const POLLING_INTERVAL = 3000; // 3 seconds

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const response = await axios.get(`${SERVER_URL}/messages`, {
          params: {
            sender_id: userId,
            receiver_id: receiverId
          }
        });

        // Sort messages by timestamp
        const sortedMessages = [...response.data].sort((a: Message, b: Message) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeA - timeB;
        });

        // Only update if there are changes
        const currentMessagesString = JSON.stringify(messages);
        const newMessagesString = JSON.stringify(sortedMessages);
        
        if (currentMessagesString !== newMessagesString) {
          console.log('Updating messages with new data');
          setMessages(sortedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    // Initial fetch
    fetchMessages();

    // Set up polling
    const interval = setInterval(fetchMessages, POLLING_INTERVAL);

    // Cleanup
    return () => clearInterval(interval);
  }, [userId, receiverId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || !receiverId) return;

    try {
      const payload = {
        sender_id: userId,
        receiver_id: receiverId,
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };

      const response = await axios.post(`${SERVER_URL}/messages`, payload);
      
      // Add new message to existing messages
      const newMsg: Message = {
        id: response.data.id,
        message_id: response.data.id,
        content: newMessage.trim(),
        sender: userId,
        timestamp: response.data.timestamp || new Date().toISOString()
      };

      // Update messages array with new message
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMsg];
        return updatedMessages.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });

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
    <NewPageTemplate title = {receiverName}>
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
     
      <View style={styles.messagesWrapper}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={getMessageKey}
          contentContainerStyle={styles.messagesContainer}
          inverted={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 100,
          }}
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
    </NewPageTemplate>
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
    justifyContent: 'flex-start',
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
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#E5ECE4',
    position: 'absolute',
    bottom: 100,
    width: '100%',
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#c4cec3',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
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
});

export default ChatPage;







