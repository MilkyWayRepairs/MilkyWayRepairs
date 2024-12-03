import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity, 
  Image,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Link } from "expo-router";
import axios from "axios";
import { SERVER_URL } from "@/config/config";
import NewPageTemplate from "../newPageTemplate"

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
    <NewPageTemplate title = 'Appointments'>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

            {/* Main Content */}
            <View style={styles.content}>
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
            </View>
        </View>
        </TouchableWithoutFeedback>
    </NewPageTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  appointmentsContainer: {
    height: 250,
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