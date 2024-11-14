import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { firestore } from './firebaseConfig'; // Import Firebase configuration
import { Link } from 'expo-router';
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Animated from "react-native-reanimated";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: any;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const translateX = useSharedValue(400); // Start off-screen
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

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

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleAccountPress = () => {
    setIsOverlayVisible(true);
    translateX.value = withTiming(0); // Animate to visible position
  };

  const handleOverlayClose = () => {
    setIsOverlayVisible(false);
    translateX.value = withTiming(400); // Animate to off-screen position
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Background Color */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
      </View>

      {/* List of Messages */}
      {messages.length === 0 ? (
        <View style={styles.noMessagesContainer}>
          <Text style={styles.noMessagesText}>No messages found</Text>
        </View>
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
        <TouchableOpacity style={styles.homeButtonContainer}>
          <Link href="/userHomePage">
            <Image source={require('../../assets/images/homeLogo.png')} style={styles.navIcon} />
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
        <TouchableOpacity 
          style={styles.overlayBackground}
          activeOpacity={0} 
          onPress={handleOverlayClose}
        ></TouchableOpacity>
      )}
      <Animated.View style={[styles.accountOverlayContainer, animatedStyles]}
      onStartShouldSetResponder={() => true}
        onTouchEnd={(e) => e.stopPropagation()}>
        <View style={[styles.accountOverlayContent, styles.logoutContent]}>
          <Text style={styles.accountOverlayText}>
            Logout
          </Text>
        </View>
        <View style={[styles.accountOverlayContent, styles.performanceContent]}>
          <Text style={styles.accountOverlayText}>
            Car Information
          </Text>
        </View>
        <View style={[styles.accountOverlayContent, styles.performanceContent, { top: 190 }]}>
          <Text style={styles.accountOverlayText}>
            Upcoming Appointments
          </Text>
        </View>
        <View style={[styles.accountOverlayContent, styles.performanceContent, { top: 280 }]}>
          <Text style={styles.accountOverlayText}>
            Account Information
          </Text>
        </View>
      </Animated.View>
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
    backgroundColor: 'transparent', // Removed any background color to match the Account icon
  },
  navText: {
    fontSize: 14,
    color: '#000',
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
});

export default Messages;
