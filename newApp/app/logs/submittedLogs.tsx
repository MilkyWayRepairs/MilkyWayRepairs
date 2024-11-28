import { Text, View, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "@/config/config";

interface Log {
  id: number;
  date: string;
  mileage: string;
  vin: string;
  jobTitle: string;
  jobNotes: string;
}

const SubmittedLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${SERVER_URL}/logs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Arrow and Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowBackContainer}>
          <Link href="..">
            <Image
              source={require("../../assets/images/arrowBack.png")}
              style={styles.arrowBack}
            />
          </Link>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submitted Logs</Text>
      </View>

      {/* Container for Logs */}
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{item.date}</Text>
            <Text style={styles.label}>Mileage:</Text>
            <Text style={styles.value}>{item.mileage}</Text>
            <Text style={styles.label}>VIN:</Text>
            <Text style={styles.value}>{item.vin}</Text>
            <Text style={styles.label}>Job Title:</Text>
            <Text style={styles.value}>{item.jobTitle}</Text>
            <Text style={styles.label}>Job Notes:</Text>
            <Text style={styles.value}>{item.jobNotes}</Text>
          </View>
        )}
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Link href="/userHomePage">
            <Image source={require("../../assets/images/homeLogo.png")} style={styles.navIcon} />
            <Text style={styles.navText}>Home</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Link href="./account">
            <Image source={require("../../assets/images/accountLogo.png")} style={styles.navIcon} />
            <Text style={styles.navText}>Account</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  header: {
    backgroundColor: "#E0BBE4",
    paddingVertical: 15,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 40,
  },
  arrowBackContainer: {
    position: "absolute",
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowBack: {
    height: 30,
    width: 30,
  },
  logItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
  },
  navButton: {
    alignItems: "center",
  },
  navIcon: {
    width: 30,
    height: 30,
  },
  navText: {
    fontSize: 14,
    color: "#000",
  },
});

export default SubmittedLogs;
