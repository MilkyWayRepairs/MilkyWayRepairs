import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

const AdministratorControls: React.FC = () => {
  const handleAccountPress = () => {
    console.log('Account button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administrator Controls</Text>

      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.controlButton}>
          <Link href="/adminControls/add">
          <Text style={styles.buttonText}>Add</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.buttonText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.homeButtonContainer}>
          <Link href="/adminHomePage">
            {"  "}
            <Image
              source={require('../../assets/images/homeLogo.png')}
              style={styles.navIcon}/>
            {"\n"}
            <Text style={styles.navText}>Home</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accountButtonContainer} onPress={handleAccountPress}>
          <Image source={require('../../assets/images/accountLogo.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#000000',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    backgroundColor: '#EBE4EC',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  homeButtonContainer: {
    flex: 1,
    backgroundColor: '#EBE4EC',
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
    color: 'black',
  },
});

export default AdministratorControls;
