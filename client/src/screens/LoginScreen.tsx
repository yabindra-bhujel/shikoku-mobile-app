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
                <View style={styles.former}>
                    <View style={styles.userField}>
                        <FontAwesome5 name="user-alt" size={24} color="black" />
                        <TextInput
                        style={styles.input}
                        placeholder="username"
                        inlineImageLeft={FontAwesome5}
                        textContentType="username"/>
                    </View>
                    <View style={styles.userField}>
                        <MaterialIcons name="lock" size={24} color="black" />
                        <TextInput
                        style={styles.input}
                        placeholder="password"
                        textContentType="password"/>
                    </View>
                    
                    <View style={styles.forgetfield}>
                        <View>
                            <Text>Remember me</Text>
                        </View>
                        <Text>Forgot Password</Text>
                    </View>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </View>
                </View>
            </View>
            <View style={styles.privacyText}>
                <Text>Terms of service and privacy policy</Text>
            </View>
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
        fontWeight: 'bold',
        color: '#000000',
        alignItems: 'center',
        justifyContent: "center",
        textAlign: 'center',
    },
    former: {
        padding: 35,
    },
    forgetfield: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    userField: {
        flexDirection: "row",
    },
    input: {
        height: 53,
        width: 321,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        fontSize: 15
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        marginTop: 47,
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
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
    }
    
})

export default Login;