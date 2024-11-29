import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';// npm install @react-native-async-storage/async-storage
import { View,Image, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, Keyboard, } from 'react-native';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import { SERVER_URL } from '@/config/config';
import SendBird from 'sendbird'; //npm install sendbird



interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: any;
}

const ChatPage: React.FC = () => {
  const sb = new SendBird({ appId: '5D0726A7-302C-4867-867E-ED5500933EC8' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState<string | null>(null);
  const [channelUrl, setChannelUrl] = useState<string | null>(null);
  const router = useRouter();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const generateUniqueId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  useEffect(() => {
    // keyboard missing debug
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // Fetch userId from AsyncStorage
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          console.log("Retrieved userId from AsyncStorage:", storedUserId);
          setUserId(storedUserId);
        } else {
          console.error("userId not found in AsyncStorage, redirecting...");
          router.push('../Login'); // Redirect to login if userId is missing
        }
      } catch (error) {
        console.error('Error accessing AsyncStorage:', error);
      }
    };

    // Fetch receiverId and receiverName from AsyncStorage
    const getReceiverData = async () => {
      try {
        const storedReceiverId = await AsyncStorage.getItem('receiverId');
        const storedReceiverName = await AsyncStorage.getItem('receiverName');

        if (storedReceiverId && storedReceiverName) {
          setReceiverId(storedReceiverId);
          setReceiverName(storedReceiverName);
          console.log("Retrieved receiverId:", storedReceiverId);
          console.log("Retrieved receiverName:", storedReceiverName);
        } else {
          console.error("Receiver data not found in AsyncStorage, redirecting...");
          router.push('../Messages'); // Redirect if receiver data is missing
        }
      } catch (error) {
        console.error('Error accessing AsyncStorage:', error);
      }
    };

    getUserData();
    getReceiverData();
  }, []);

  useEffect(() => {
    if (receiverId && userId) {
      fetchOrCreateChat();
    }
  }, [receiverId, userId]);

  const fetchOrCreateChat = async () => {
    if (!receiverId || !userId) {
      console.error("Receiver ID or User ID is missing, redirecting to default page...");
      router.push('../Messages'); // Redirect to a safe fallback route
      return;
    }

    try {
      console.log("Attempting to fetch or create chat with:", { sender_id: userId, receiver_id: receiverId });
      const response = await axios.post(`${SERVER_URL}/chat`, {
        sender_id: userId,  // Use state variable userId here
        receiver_id: receiverId,
      });

      if (response.status === 200 || response.status === 201) {
        const { channel_url, messages } = response.data;
        setMessages([{ id: generateUniqueId(), content: "Chat started", sender: `User${userId}`, timestamp: new Date().toISOString() }]);

    
        setChannelUrl(channel_url); // Store the channel URL
        if (messages) {
          console.log("Existing chat found, setting messages:", messages);

          const updatedMessages = messages.map((msg: { timestamp: string | number | Date; }) => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date().toISOString(),
          }));
  
          setMessages(updatedMessages);

        } else {
          console.log("New chat created.");
          setMessages([{ id: generateUniqueId(), content: "Chat started", sender: `User${userId}`, timestamp: new Date().toISOString() }]);

        }
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching or creating chat:', error);
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !receiverId || !userId || !channelUrl) {
        console.error("Cannot send message. Missing data.");
        return;
    }
   // const channelUrl = `channel_${userId}_${receiverId}`;
    const payload = {
      sender_id: userId,
      channel_url: channelUrl,  // Use the correct channel URL
      content: newMessage,
    };

    try {
        console.log("Sending payload to server:", payload);  // Log payload for debugging
        const response = await axios.post(`${SERVER_URL}/messages`, payload);
        if (response.status === 201) {
          const newMessageData = {
            id: generateUniqueId(),
            content: newMessage,
            sender: `User${userId}`,
            timestamp: new Date().toISOString(), // Add timestamp when sending the message
          };
            setMessages((prev) => [...prev, newMessageData]);
            setNewMessage('');
        } else {
            console.error('Unexpected response status:', response.status);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        console.error('Error sending message:', error);
    }
};


const renderMessageItem = ({ item }: { item: Message }) => (
  <View style={[styles.messageItem, item.sender === `User${userId}` ? styles.myMessage : styles.theirMessage]}>
    <Text style={styles.messageContent}>{item.content}</Text>
    {item.timestamp ? (
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })}
      </Text>
    ) : (
      <Text style={styles.timestamp}>Invalid Date</Text>
    )}
  </View>
);



return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
  >
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Back Arrow */}
        <TouchableOpacity style={styles.arrowBack} onPress={() => router.back()}>
          <Image
            source={require('../../assets/images/arrowBack.png')} // Adjust the path as per your project structure
            style={styles.arrowBackIcon}
          />
        </TouchableOpacity>
        {/* Display Receiver Name */}
        <Text style={styles.receiverName}>{receiverName || 'Recipient'}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
        keyboardShouldPersistTaps="always"
      />
      <View style={[styles.inputContainer, keyboardVisible && { marginBottom: 10 }]}>
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
    justifyContent: 'center', // Centers the content
    padding: 10,
    backgroundColor: '#E0BBE4',
    position: 'relative', // Allows positioning of back arrow independently
  },
  arrowBackIcon: {
    width: 24,
    height: 24, // Adjust size for the back arrow icon
  },
  receiverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
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
  arrowBack: {
    position: 'absolute', // Position the back arrow independently
    left: 10, // Adjust distance from the left edge
    top: '100%', // Center vertically
    transform: [{ translateY: -12 }], // Fine-tune centering for the icon size
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