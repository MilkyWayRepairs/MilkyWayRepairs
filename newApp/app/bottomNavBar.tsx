// components/bottomNavBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';

const BottomNavBar: React.FC<{ onAccountPress: () => void }> = ({ onAccountPress }) => {
    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navButton}>
                <Link href="/userHomePage">
                    <Image source={require('../assets/images/homeLogo.png')} style={styles.navIcon} />
                    <Text style={styles.navText}>Home</Text>
                </Link>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={onAccountPress}>
                <Image source={require('../assets/images/accountLogo.png')} style={styles.navIcon} />
                <Text style={styles.navText}>Account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    navButton: {
        alignItems: 'center',
    },
    navIcon: {
        width: 30,
        height: 30,
    },
    navText: {
        fontSize: 14,
        color: '#000',
    },
});

export default BottomNavBar;
