import React, { useState} from "react";
import { View, SafeAreaView, Text, StyleSheet, Image,TouchableOpacity, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StyledTextInput from "@/src/components/StyledTextInput";
import { router } from "expo-router";


const ForgetPass = () => {

    const onPressButton = () => {
        if (form.email === "") {
            Alert.alert("Please fill the email adress !")
        } else {
            Alert.alert("Reset link sent to your email !");
        }
    }

    const [form, setForm] = useState({
        email: "",
      })

    return (
        <SafeAreaView style={styles.Wrapper}>
            <View style={styles.container}>
                <TouchableOpacity>
                <View style={styles.backBtnContainer}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                    <Text style={styles.backBtnText} onPress={()=> {router.back()}}>Back</Text>
                </View>
                </TouchableOpacity>
                <View style={styles.headerLogo}>
                    <Image source={require('@/assets/images/64px-shikoku-logo.png')}/>
                    <View style={styles.headtitle}>
                        <Text style={styles.text1}>SHIKOKU UNIVERSITY</Text>
                        <Text style={styles.text2}>四国大学</Text>
                    </View>
                </View>
                <Text style={styles.welback}>Reset Password</Text>
                <View style={styles.inputFormer}>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="email" size={24} color="black" 
                        style={styles.inputIcon}/>
                        <StyledTextInput
                        placeholder="s20*******@shikoku-u.ac.jp"
                        keyboardType="email-address"
                        textContentType="emailAddress"/>
                    </View>
                    
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText} onPress={onPressButton}>Send Me Link</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.privacyText}>Terms of service and privacy policy</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    Wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    backBtnContainer: {
        flexDirection: 'row',
        marginTop: 48,
        marginLeft: 21,
    },
    backBtnText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerLogo: {
        marginTop: 105,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
    },
    headtitle: {
        marginLeft: 7,
        },
    text1: {
        fontSize: 13,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        color: '#000000',
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
        },
    text2: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#000000',
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
        },
    welback: {
        fontSize: 30,
        marginTop: 34,
        marginBottom: 57,
        color: '#000000',
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
    },
    inputFormer: {
        height: 55,
    },
    forgetfield: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    inputContainer: {
        backgroundColor: "#FCF5F5",
        alignItems: 'center',
        flexDirection: "row",
        borderRadius: 10,
        borderWidth: 1,
        marginHorizontal: 36,
        marginVertical: 20,
        height: 53,
        gap: 7
    },
    inputIcon: {
        marginLeft: 14
    }
    ,
    textInputField: {
        height: 53,
        width: "100%"
    },
    forgetText: {
        fontSize: 13,
        color: "#F84A4A"
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 53,
        margin: 10,
        borderRadius: 5,
        marginTop: 47,
        marginHorizontal: 36,
        backgroundColor: '#4785FC',
    },
    buttonText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        },
    privacyText: {
        color: '#3F44D1',
        fontSize: 13,
        textAlign: 'center',
    }
    
})

export default ForgetPass;