import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, Image, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { SERVER_URL } from '@/config/config';


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
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const translateX = useSharedValue(400); // Sidebar animation
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadChatHistory();
    fetchChatHistory();
    fetchUsers();
  }, []);

  // Load chat history from local storage
  const loadChatHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('chatHistory');
      if (storedHistory) {
        setChatHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Save chat history to local storage
  const saveChatHistory = async (history: Chat[]) => {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Fetch chat history from the server
  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/chat_list`, {
        params: { user_id: 1 }, // Replace with the logged-in user's ID
      });
      if (response.status === 200) {
        setChatHistory(response.data.chat_list);
        saveChatHistory(response.data.chat_list);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // Fetch the list of users from the server
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/users`, {
        params: { current_user_id: 1 }, // Replace with the logged-in user's ID
      });
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Start chatting with a user
  const startChatting = (receiverId: number) => {
    const selectedUser = users.find(user => user.id === receiverId);
    if (!selectedUser) {
      console.error(`User with ID ${receiverId} not found`);
      return;
    }

    router.push({
      pathname: `../Messages/ChatPage`,
      params: {
        receiverId: `${selectedUser.id}`,
        receiverName: selectedUser.name,
      },
    });
  };

  // Delete a chat from history
  const deleteChat = (chatId: number) => {
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
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

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => startChatting(item.id)}
    >
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
        <TouchableOpacity style={styles.arrowBack}>
          <Link href="..">
            <Image
              source={require('../../assets/images/arrowBack.png')}
              style={styles.arrowBack}
            />
          </Link>
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatHistory}
        renderItem={renderChatItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />

      {/* Sidebar for Selecting Users */}
      {isSidebarVisible && (
        <View style={styles.sidebarContainer}>
          <TouchableOpacity style={styles.sidebarCloseButton} onPress={handleSidebarClose}>
            <Text style={styles.sidebarCloseText}>Close</Text>
          </TouchableOpacity>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.userListContent}
          />
        </View>
      )}
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
    backgroundColor: '#E0BBE4',
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  arrowBack: {
    position: 'absolute',
    top: 8,
    left: 0,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  userListContent: {
    paddingHorizontal: 16,
    paddingVertical: 10, // Adjust vertical padding if needed
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#666',
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 3,
    paddingTop: 20,
    borderLeftWidth: 1,
    borderColor: '#ccc',
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
  userItem: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
});

export default Messages;
