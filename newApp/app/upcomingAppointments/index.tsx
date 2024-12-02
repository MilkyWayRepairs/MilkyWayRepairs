import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList,TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import axios from "axios";
import { SERVER_URL } from "@/config/config";

type Appointment = {
  id: number;
  name: string;
  date: string;
  time: string;
};

const AppointmentPage = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/GetAppointment`);

      const upcoming = response.data.upcomingAppointments.sort(
        (a: Appointment, b: Appointment) =>
          new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
      );

      const past = response.data.pastAppointments.sort(
        (a: Appointment, b: Appointment) =>
          new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()
      );

      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <TouchableOpacity>
          <Text style={styles.backArrow}>←</Text> {/* Replace with an icon if desired */}
        </TouchableOpacity>
        <Text style={styles.title}>Appointments</Text>
      </View>

      {/* Top bar */}
      <View style={styles.topBar}>
        <Link href="/scheduleAppointment" style={styles.link}>
          <Text style={styles.buttonText}>Need to Schedule Appointment</Text>
        </Link>
      </View>

      {/* Upcoming Appointments */}
      <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
      <View style={styles.appointmentsContainer}>
        {upcomingAppointments.length > 0 ? (
          <FlatList
            data={upcomingAppointments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.appointmentCard}>
                <Text style={styles.appointmentDetails}>{item.name}</Text>
                <Text style={styles.appointmentDate}>
                  {new Date(item.date).toLocaleDateString()} at {item.time}
                </Text>
              </View>
            )}
            style={styles.flatList}
          />
        ) : (
          <Text>No upcoming appointments.</Text>
        )}
      </View>

      {/* Past Appointments */}
      <Text style={styles.sectionTitle}>Past Appointments</Text>
      <View style={styles.appointmentsContainer}>
        {pastAppointments.length > 0 ? (
          <FlatList
            data={pastAppointments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.appointmentCard}>
                <Text style={styles.appointmentDetails}>{item.name}</Text>
                <Text style={styles.appointmentDate}>
                  {new Date(item.date).toLocaleDateString()} at {item.time}
                </Text>
              </View>
            )}
            style={styles.flatList}
          />
        ) : (
          <Text>No past appointments.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  topBar: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    textDecorationLine: "none",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  appointmentsContainer: {
    maxHeight: 250, // Limit the height of each section
    marginBottom: 16,
  },
  flatList: {
    flexGrow: 0,
  },
  appointmentCard: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 8,
  },
  appointmentDetails: {
    fontSize: 16,
  },
  appointmentDate: {
    fontSize: 14,
    color: "#666",
  },


});

export default AppointmentPage;
