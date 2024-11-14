import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Link } from "expo-router";
import React from 'react';

const Reviews = () => {
    return (
        <View style={styles.container}>
            {/* Back Arrow and Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.arrowBackContainer}>
                    <Link href="..">
                        <Image
                            source={require('../../assets/images/arrowBack.png')}
                            style={styles.arrowBack}
                        />
                    </Link>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reviews</Text>
            </View>

            {/* Container for Submitted Reviews */}

            {/* Bottom Navigation Bar */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navButton}>
                    <Link href="/userHomePage">
                        <Image source={require('../../assets/images/homeLogo.png')} style={styles.navIcon} />
                        <Text style={styles.navText}>Home</Text>
                    </Link>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Link href="./account">
                        <Image source={require('../../assets/images/accountLogo.png')} style={styles.navIcon} />
                        <Text style={styles.navText}>Account</Text>
                    </Link>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styling
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 40,
    },
    arrowBackContainer: {
        position: 'absolute',
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowBack: {
        height: 30,
        width: 30,
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
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

export default Reviews;
