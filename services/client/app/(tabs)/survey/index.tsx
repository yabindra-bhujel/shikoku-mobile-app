import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Linking } from "react-native";
import { DateFormat } from "@/src/ReusableComponents/DateFormat";
import { Ionicons } from '@expo/vector-icons'; // For icons
import { useRouter } from "expo-router";

const Survey = () => {
    const router = useRouter();

    const surveys = [
        { 
            id: 1,
            title: "Customer Satisfaction",
            date: new Date('2024-09-01'),
            url: "https://docs.google.com/forms/d/e/1FAIpQLSf0_c2NS4qpyVsN9n7nRMszlxyl1gdxeh9dL0ReuEUOEJ2aXQ/viewform?usp=sf_link",
         },
    ];


    const navigationToSurvey = (id: number) => {
        router.push(`/survey/${id}`);
    }
    

    // Render each survey item
    const renderSurveyItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.surveyItem} 
            activeOpacity={0.7} 
            onPress={() => navigationToSurvey(item.id)}
            
        >
            <View style={styles.surveyInfo}>
                <Text style={styles.surveyTitle}>{item.title}</Text>
                <Text style={styles.surveyDate}>
                    <DateFormat date={item.date} />
                </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#007bff" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Available Surveys</Text>
            <FlatList
                data={surveys}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSurveyItem}
                contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add New Survey')}>
                <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 16,
    },
    heading: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    listContainer: {
        paddingBottom: 80, // Space for the floating button
    },
    surveyItem: {
        backgroundColor: "#ffffff",
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
    },
    surveyInfo: {
        flex: 1,
        paddingRight: 10,
    },
    surveyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    surveyDate: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#007bff",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
});

export default Survey;
