import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { firestore } from './firebaseConfig';  // Import Firestore instance
import { Link } from "expo-router";  // Import Link from expo-router

interface Message {
  id: string;
  name: string;
  role: string;
  time: string;
  avatar: string;
}

const MessagesScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('messages')
      .orderBy('time', 'desc')
      .onSnapshot(snapshot => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(fetchedMessages);
      });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const renderItem = ({ item }: { item: Message }) => (
    <Link href={{ pathname: `/Messages/messages`, params: { id: item.id } }} style={styles.messageContainer}>
    <View style={styles.messageContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{item.name} ({item.role})</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => (
  <Tab.Navigator>
    <Tab.Screen name="Messages" component={MessagesScreen} />
    {/* Add other screens here */}
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5FF',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    color: '#4B4B8C',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    marginLeft: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#888',
  },
});

export default AppNavigator;
