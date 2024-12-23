import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import NewPageTemplate from "../newPageTemplate";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Svg, { Circle } from 'react-native-svg'
import { SERVER_URL } from "@/config/config";
import { useSearchParams } from "expo-router/build/hooks";

const CircularProgress = ({ progress, color }: { progress: number, color: string } ) => {
  const logoRadius = 185;
  const radius = logoRadius+ 20;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Svg height={radius * 2} width={radius * 2}>
      <Circle
        stroke="#e6e6e6"
        fill="none"
        cx={radius}
        cy={radius}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <Circle
        stroke={color}
        fill="none"
        cx={radius}
        cy={radius}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${radius}, ${radius}`}
      />
    </Svg>
  );
};

type VehicleStatus = {
  progress: number;
  text: string
  color: string
};

const vehicleStatuses: Record<number, VehicleStatus> = {
  0: { progress: 0, text: "Vehicle not yet received.", color: "#FF0000" },
  1: { progress: 25, text: "Vehicle received, preparing to start work.", color: "#FF5733" },
  2: { progress: 50, text: "Work has begun on your vehicle.", color: "#FFC300" },
  3: { progress: 75, text: "Your vehicle is being put back together.", color: "#DAF7A6" },
  4: { progress: 100, text: "Work is complete! Time to pick up your vehicle.", color: "#28B463" },
  5: { progress: 100, text: "Vehicle picked up.", color: "#CEBDD1" }
};

const customerStatusPage = () => {
  const searchParams = useSearchParams();
  const vehicle_VIN = searchParams.get('VIN');
  const [currentStatus, setCurrentStatus] = useState<VehicleStatus | null>(null);
  const [vehicleDetails, setVehicleDetails] = useState<any | null>(null);

  useEffect(() => {
    // Function to fetch vehicle status from the API
    const fetchVehicleStatus = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/get-vehicle-status?VIN=${vehicle_VIN}`);
        const data = await response.json();
        console.log(data)

        const statusInt = data.status;
        const status = vehicleStatuses[statusInt];

        if (status) {
          setCurrentStatus(status)
          setVehicleDetails(data.vehicleDetails);
        } else {
          console.error('Invalid status received:', statusInt)
        }
      } catch (error) {
        console.error('Error fetching vehicle status:', error);
      }
    };

    fetchVehicleStatus();
  }, [vehicle_VIN]);

  if (!currentStatus) {
    return <Text>Loading...</Text>; // Show a loading state while fetching data
  }

  return (
    <NewPageTemplate title = "Vehicle Status">
      <View style={styles.container}>
        {/* Logo */}
        <Image 
        source={require('../../assets/images/MilkyWayRepair.png')} 
        style={styles.logo}
        />

        {/* Top text */}
        <Text style={styles.topText}>Your vehicle's status:</Text>

        {/* Status Text */}
        <Text style={styles.progressText}>{currentStatus.text}</Text>

        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <CircularProgress progress={currentStatus.progress} color={currentStatus.color} />
        </View>
              {/* Review Button */}
              {currentStatus.progress === 100 && (
          <TouchableOpacity style={styles.reviewButton}>
          <Link href={'/reviews'}>
            <Text style={styles.reviewButtonText}>Please leave us a review!</Text>
            </Link>
          </TouchableOpacity>
        )}
      </View>
    </NewPageTemplate>
  );
};

// Styling
const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingHorizontal: 20,
},
progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    paddingBottom: 50,
    top: 100
  },
CircularProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
logo: {
    width: 400,
    height: 300,
    position: 'absolute',
    resizeMode: 'contain',
    top: 150,
  },
progressText: {
    marginTop: 350, // Adjust to position the text below the progress bar
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  topText: {
    position: 'absolute',
    top: 50,
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
  },
  reviewButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#6B4F9B',
    borderRadius: 5,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default customerStatusPage;