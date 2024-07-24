import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axiosInstance from "@/src/config/Api";
import CreaetReminder from "@/src/components/Reminder/CreaetReminder";

type ReminderType = {
  id: number;
  title: string;
  description: string;
  time_to_remind: string;
  time_to_do: string;
};

const Reminder = () => {
  const theme = useColorScheme();
  const router = useRouter();
  const [reminders, setReminders] = useState<ReminderType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    time_to_remind: '',
    time_to_do: '',
  });

  const getReminder = async () => {
    try {
      const response = await axiosInstance.get("/reminder");
      setReminders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReminder();
  }, []);

  const goBack = () => {
    router.back();
  };

  const addReminder = () => {
    // モーダルを開く
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post("/reminder", newReminder);
      setModalVisible(false);
      getReminder();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add reminder.");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
    },
    header: {
      flexDirection: "row",
      gap: 10,
      padding: 10,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
    },
    body: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 20,
    },
    card: {
      width: 200,
      height: 200,
      backgroundColor: theme === "dark" ? "#444" : "#ddd",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
    },
    cardText: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#000",
    },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme === "dark" ? "#555" : "#007BFF",
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonText: {
      fontSize: 24,
      color: "#fff",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#333" : "#fff",
      padding: 20,
    },
    modalInput: {
      width: '100%',
      padding: 10,
      marginVertical: 10,
      borderColor: theme === "dark" ? "#666" : "#ccc",
      borderWidth: 1,
      borderRadius: 5,
    },
    modalButton: {
      marginTop: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 54,
          backgroundColor: theme === "dark" ? "#333" : "#fff",
        }}
      />
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={goBack}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons
              name="chevron-back-sharp"
              size={24}
              color={theme === "dark" ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: theme === "dark" ? "#fff" : "#000",
            }}
          >
            Reminder
          </Text>
        </View>
      </View>

      {/* body */}
      <View style={styles.body}>
        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.card}>
            <Text style={styles.cardText}>{reminder.title}</Text>
            <Text style={styles.cardText}>{reminder.description}</Text>
            <Text style={styles.cardText}>{reminder.time_to_remind}</Text>
            <Text style={styles.cardText}>{reminder.time_to_do}</Text>
          </View>
        ))}
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={addReminder}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Full-size Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <CreaetReminder setModalVisible={setModalVisible} />
      
      </Modal>
    </View>
  );
};

export default Reminder;
