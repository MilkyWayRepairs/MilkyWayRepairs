import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { SERVER_URL } from '@/config/config';


interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: any;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderId] = useState(1); // Example sender ID
  const [receiverId, setReceiverId] = useState<number | null>(null); // Dynamic receiver ID
  const [users, setUsers] = useState<User[]>([]); // List of users
  const translateX = useSharedValue(400); // Start off-screen
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const router = useRouter(); // Use router to navigate between pages

  useEffect(() => {
    //fetchMessages();
    fetchUsers();
  }, [receiverId]);
/*
  const fetchMessages = async () => {
    if (receiverId === null) return;
    try {
        const response = await axios.get('http://192.168.0.33:5000/messages', {
            params: { sender_id: senderId, receiver_id: receiverId },
        });
        setMessages(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle Axios errors
            console.error('Error fetching messages:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                console.error('No response received:', error.request);
            }
        } else {
            // Handle non-Axios errors
            console.error('Error setting up request:', (error as Error).message);
        }
    }
};*/

const fetchUsers = async () => {
    try {
        const response = await axios.get(`${SERVER_URL}/users`, {
          params: { current_user_id: senderId },
        });
        console.log("Fetched users:", response.data); // Log users for debugging
        setUsers(response.data);
    } catch (error) {
        console.error('Error fetching users:', error);
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

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={styles.messageItem}>
      <Text style={styles.senderText}>
        {item.sender === `User${senderId}` ? 'You' : `User${receiverId}`}:
      </Text>
      <Text style={styles.contentText}>{item.content}</Text>
      <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => startChatting(item.id)}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
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

  const handleStartChatPress = () => {
    setIsSidebarVisible(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
      </View>

      {/* Chat List */}
      {messages.length === 0 ? (
        <View style={styles.noMessagesContainer}>
          <Text style={styles.noMessagesText}>No messages found</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Start a New Chat Button */}
      <TouchableOpacity style={styles.startChatButton} onPress={handleStartChatPress}>
        <Text style={styles.startChatButtonText}>Start a New Chat</Text>
      </TouchableOpacity>

      {/* Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.homeButtonContainer}>
          <Link href="/userHomePage">
            {"  "}
            <Image
              source={require('../../assets/images/homeLogo.png')}
              style={styles.navIcon}
            />
            {"\n"}
            <Text style={styles.navText}>Home</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountButtonContainer} onPress={handleAccountPress}>
          <Image source={require('../../assets/images/accountLogo.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>

      {/* Account Overlay */}
      {isOverlayVisible && (
        <TouchableOpacity style={styles.overlayBackground} activeOpacity={0} onPress={handleOverlayClose} />
      )}
      <Animated.View style={[styles.accountOverlayContainer, animatedStyles]}>
        <View style={[styles.accountOverlayContent, styles.logoutContent]}>
          <Text style={styles.accountOverlayText}>Logout</Text>
        </View>
        {/* Additional account options */}
      </Animated.View>

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
  noMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#f5f0fa', // Updated to match Figma design
  },
  homeButtonContainer: {
    flex: 1,
    backgroundColor: '#E0BBE4',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  accountButtonContainer: {
    flex: 1,
    backgroundColor: '#E5ECE4',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  navIcon: {
    width: 30,
    height: 30,
  },
  navText: {
    fontSize: 14,
    color: '#000',
    marginTop: 10,
  },
  accountOverlayContainer: {  // Everything below is the overlay
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
    borderColor: 'black',
  },
  accountOverlayContent: {
    position: 'absolute',
    width: '100%',
    height: 80,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#CEBDD1',
  },
  logoutContent: {
    top: 10, // Adjust this value to position the first box
  },
  performanceContent: {
    top: 100, // Adjust this value to position the second box
  },
  accountOverlayText: {
    color: 'black',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    zIndex: 1,
  },
  startChatButton: {
    backgroundColor: '#E0BBE4', // Light purple color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%', // Adjust to make it fill most of the width, centered
    alignSelf: 'center', // Center the button horizontally
  },
  startChatButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '70%',
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
  userListContent: {
    paddingHorizontal: 16,
  },
});

export default Messages;
