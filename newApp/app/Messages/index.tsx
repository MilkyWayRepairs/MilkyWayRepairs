import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, Image, Alert, RefreshControl } from 'react-native';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { SERVER_URL } from '@/config/config';
import NewPageTemplate from '../newPageTemplate'


interface Message {
  id: number;
  content: string;
  sender: string;
  receiver_id: string;
  sender_name?: string;
  timestamp: string;
}
interface Chat {
  id: number; // Chat ID
  name: string; // Chat user name
  lastMessage: string; // Last message content
  timestamp: string; // Timestamp of the last message
}

interface User {
  id: number;
  name: string;
  email: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderId] = useState(1); // Example sender ID
  const [receiverId, setReceiverId] = useState<number | null>(null); // Dynamic receiver ID
  const [users, setUsers] = useState<User[]>([]); // List of users
  const [userId, setUserId] = useState<string | null>(null);
  const translateX = useSharedValue(400); // Start off-screen
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const router = useRouter();
  const POLLING_INTERVAL = 2000; // Poll every 2 seconds - adjust as needed

  useEffect(() => {
    const initialize = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        await fetchConversations(storedUserId);
        await fetchUsers();
      }
    };
    initialize();

    // Set up polling for conversations
    const pollInterval = setInterval(async () => {
      const currentUserId = await AsyncStorage.getItem('userId');
      if (currentUserId) {
        await fetchConversations(currentUserId);
      }
    }, POLLING_INTERVAL);

    // Cleanup
    return () => {
      clearInterval(pollInterval);
    };
  }, []); // Empty dependency array since we want this to run once on mount

  const fetchConversations = async (currentUserId: string) => {
    try {
      const response = await axios.get(`${SERVER_URL}/conversations`, {
        params: { user_id: currentUserId }
      });
      
      // Sort messages by timestamp before updating state
      const sortedMessages = response.data.sort((a: Message, b: Message) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      // Only update if there are changes
      if (JSON.stringify(messages) !== JSON.stringify(sortedMessages)) {
        console.log('Updating conversations:', sortedMessages);
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("Fetching users..."); // Debug log
      const response = await axios.get(`${SERVER_URL}/users`);
      console.log("Response data:", response.data); // Debug log
      
      if (Array.isArray(response.data)) {
        setUsers(response.data);
        console.log("Users state updated:", response.data); // Debug log
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response:', error.response?.data);
        console.error('Status:', error.response?.status);
      }
    }
  };

  const startChatting = (receiverId: number) => {
    const selectedUser = users.find(user => user.id === receiverId);

    console.log("Selected User:", selectedUser); // Debug selected user
    if (!selectedUser) {
      console.error(`User with ID ${receiverId} not found`);
      return;
    }
    console.log("Starting chat with receiverId:", receiverId);


    //debugging
    const receiverIdStr = `${selectedUser.id}`;
    const receiverNameStr = `${selectedUser.name}`;


    router.push({
      pathname: `../Messages/ChatPage`,
      params: {
        receiverId: receiverIdStr,
        receiverName: receiverNameStr,
      },
    });
    console.log("Navigating to ChatPage with params:", {
      receiverId: selectedUser.id,
      receiverName: selectedUser.name,
    });
  };


  const deleteChat = async (chatId: number) => {
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedHistory = chatHistory.filter((chat) => chat.id !== chatId);
          setChatHistory(updatedHistory);
          saveChatHistory(updatedHistory);
        },
      },
    ]);
  };
  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => startChatting(item.id)}
      onLongPress={() => deleteChat(item.id)}
    >
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.chatTimestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );


  const renderConversation = ({ item }: { item: Message }) => {
    if (!userId) return null;
    
    const isCurrentUser = item.sender === userId;
    const displayName = isCurrentUser ? item.receiver_name : item.sender_name;
    const otherUserId = isCurrentUser ? item.receiver_id : item.sender;
    
    return (
      <TouchableOpacity 
        style={styles.conversationItem}
        onPress={() => startChatting(parseInt(otherUserId))}
      >
        <View>
          <Text style={styles.conversationName}>
            {displayName || 'Unknown User'}
          </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.content}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => startChatting(item.id)}>
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );


  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });


  const handleAccountPress = () => {
    setIsOverlayVisible(true);
    translateX.value = withTiming(0);
  };


  const handleOverlayClose = () => {
    setIsOverlayVisible(false);
    translateX.value = withTiming(400);
  };


  const handleStartChatPress = async () => {
    console.log("Start chat pressed"); // Debug log
    setIsSidebarVisible(true);
    try {
      await fetchUsers();
      console.log("Current users state:", users); // Debug log
    } catch (error) {
      console.error("Error in handleStartChatPress:", error);
    }
  };


  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  // Add a refresh control for manual updates
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (userId) {
      await fetchConversations(userId);
    }
    setRefreshing(false);
  }, [userId]);

  // Add refresh control for users list
  const [refreshingUsers, setRefreshingUsers] = useState(false);
  
  const onRefreshUsers = React.useCallback(async () => {
    setRefreshingUsers(true);
    await fetchUsers();
    setRefreshingUsers(false);
  }, []);

  return (
    <NewPageTemplate title = 'Messages'>
      <View style={styles.container}> 

        {/* Conversations List */}
        <FlatList
          data={messages}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id.toString()}
          style={styles.conversationsList}
          contentContainerStyle={styles.conversationsContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#E0BBE4']} // Match your theme color
            />
          }
        />

        {/* Start Chat Button */}
        <TouchableOpacity style={styles.startChatButton} onPress={handleStartChatPress}>
          <Text style={styles.startChatButtonText}>Start a New Chat</Text>
        </TouchableOpacity>

        <View style={styles.bottomContainer}>
        </View>

        {/* Sidebar for Selecting Users */}
        {isSidebarVisible && (
          <View style={styles.sidebarContainer}>
            <TouchableOpacity style={styles.sidebarCloseButton} onPress={handleSidebarClose}>
              <Text style={styles.sidebarCloseText}>Close</Text>
            </TouchableOpacity>
            <FlatList 
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.userListContent}
            />
          </View>
        )}
      </View>
    </NewPageTemplate>
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
  chatTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 20,
    borderColor: '#c3e7c0',
  },
  noMessagesText: {
    textAlign: 'center',
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
  logoutContent: {
    top: 10, // Adjust this value to position the first box
  },
  performanceContent: {
    top: 100, // Adjust this value to position the second box
  },
  startChatButton: {
    backgroundColor: '#6B4F9B',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: -100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%', // Adjust to make it fill most of the width, centered
    alignSelf: 'center', // Center the button horizontally
  },
  startChatButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#6B4F9B',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    right: -3, // Adjusted to align with the right side of the screen
    width: 185,
    height: '100%',
    backgroundColor: "#EBE4EC", 
    zIndex: 2,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: 0 }],
    borderWidth: 3,
    borderRadius: 20,
    borderColor: 'Black',
  },
  sidebarCloseButton: {
    padding: 10,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  sidebarCloseText: {
    color: '#888',
    fontSize: 16,
  },
  userListContent: {
    paddingHorizontal: 16,
  },
  conversationsList: {
    flex: 1,
    width: '100%',
  },
  conversationsContent: {
    padding: 10,
  },
  conversationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'black',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
    lastMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  bottomContainer: {
    flex: .3
  } 
});


export default Messages;

