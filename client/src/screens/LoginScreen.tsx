import React from "react";
import { View, SafeAreaView, Text, StyleSheet, Image, TextInput } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


const Login = () => {
    return (
        <SafeAreaView style={styles.Wrapper}>
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image source={require('@/assets/images/64px-shikoku-logo.png')}/>
                    <View style={styles.title}>
                        <Text style={styles.text1}>SHIKOKU UNIVERSITY</Text>
                        <Text style={styles.text2}>四国大学</Text>
                    </View>
                </View>
                <Text style={styles.welback}>Welcome Back</Text>
                <View style={styles.inputFormer}>
                    <View style={styles.inputContainer}>
                        <FontAwesome5 name="user-alt" size={24} color="black"
                        style={styles.inputIcon}/>
                        <TextInput
                        style={styles.textInput}
                        placeholder="username"
                        textContentType="username"/>
                    </View>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={24} color="black"
                        style={styles.inputIcon}/>
                        <TextInput
                        style={styles.textInput}
                        placeholder="password"
                        textContentType="password"/>
                    </View>
                    
                    <View style={styles.forgetfield}>
                        <View>
                            <Text>Remember me</Text>
                        </View>
                        <Text style={styles.forgetText}>Forgot Password</Text>
                    </View>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </View>
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
    logo: {
        marginTop: 105,
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
    },
    title: {
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
        },
    text1: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000000',
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
        },
    text2: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000000',
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
        },
    welback: {
        fontSize: 30,
        marginTop: 34,
        marginBottom: 20,
        color: '#000000',
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
    },
    inputFormer: {
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
    textInput: {
        textAlign: 'center',
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
        fontSize: 20,
        fontWeight: 'bold',
        },
    privacyText: {
        color: '#3F44D1',
        fontSize: 13,
        textAlign: 'center',
    }
    
})

export default Login;