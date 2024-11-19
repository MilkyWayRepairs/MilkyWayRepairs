// components/accountSidebar.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

interface AccountSidebarProps {
    onClose: () => void;
    isVisible: boolean;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ onClose, isVisible }) => {
    const translateX = useSharedValue(isVisible ? 0 : 400);
    const [selectedOption, setSelectedOption] = useState<string | null>(null); // State to track selected option

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    useEffect(() => {
        translateX.value = withTiming(isVisible ? 0 : 400);
    }, [isVisible]);

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
    };

    return (
        <>
            {isVisible && (
                <TouchableOpacity style={styles.overlayBackground} activeOpacity={0} onPress={onClose} />
            )}
            <Animated.View style={[styles.accountOverlayContainer, animatedStyles]}>
                {/* Sidebar Options */}
                <TouchableOpacity
                    style={[
                        styles.accountOverlayContent,
                        selectedOption === "Logout" ? styles.selectedBorder : null,
                    ]}
                    onPress={() => handleOptionSelect("Logout")}
                >
                    <Text style={styles.accountOverlayText}>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.accountOverlayContent,
                        selectedOption === "Car Information" ? styles.selectedBorder : null,
                    ]}
                    onPress={() => handleOptionSelect("Car Information")}
                >
                    <Text style={styles.accountOverlayText}>Car Information</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.accountOverlayContent,
                        selectedOption === "Upcoming Appointments" ? styles.selectedBorder : null,
                    ]}
                    onPress={() => handleOptionSelect("Upcoming Appointments")}
                >
                    <Text style={styles.accountOverlayText}>Upcoming Appointments</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.accountOverlayContent,
                        selectedOption === "Account Information" ? styles.selectedBorder : null,
                    ]}
                    onPress={() => handleOptionSelect("Account Information")}
                >
                    <Text style={styles.accountOverlayText}>Account Information</Text>
                </TouchableOpacity>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    overlayBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1,
    },
    accountOverlayContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 250,
        height: '100%',
        backgroundColor: '#EBE4EC',
        zIndex: 2,
        overflow: 'hidden',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 3,
        borderRadius: 20,
        borderColor: 'black',
    },
    accountOverlayContent: {
        width: '90%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CEBDD1',
        marginVertical: 10,
    },
    accountOverlayText: {
        color: 'black',
        textAlign: 'center',
    },
    selectedBorder: {
        borderWidth: 2,
        borderColor: 'black',
    },
});

export default AccountSidebar;
