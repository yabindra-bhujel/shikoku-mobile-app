import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";


interface SettingMenuProps {
    navigateToMembers: () => void;
    groupInfo: any;
    loggedInUserId: number | null;
    isDark: boolean;
    handleLeaveGroup: () => void;
    handleDeleteGroup: () => void;
    handleShowAddMember: () => void;
}

export const SettingMenu = ({
    groupInfo,
    loggedInUserId,
    navigateToMembers,
    handleLeaveGroup,
    isDark,
    handleDeleteGroup,
    handleShowAddMember,
     }: SettingMenuProps) => {
        const { t } = useTranslation();

    return (

        <View style={[styles.menuContainer, { backgroundColor: isDark ? '#333' : '#f9f9f9' }]}>
            <Text style={[styles.menuTitle, { color: isDark ? '#fff' : '#000' }]}>Group Settings</Text>

            <TouchableOpacity style={styles.menuItem} onPress={navigateToMembers}>
                <Ionicons name='list-outline' size={24} color="#03DAC6" />
                <Text style={styles.menuText}>{t("groupchat.memberList")}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleShowAddMember}>
                <Ionicons name="person-add-outline" size={24} color="#03DAC6" />
                <Text style={styles.menuText}>{t("groupchat.addmember")}</Text>
            </TouchableOpacity>
                
            {groupInfo.admin_id === loggedInUserId ? (
                <TouchableOpacity style={styles.menuItem} onPress={handleDeleteGroup}>
                <Ionicons name='trash-bin' size={24} color="#FF6F61" />
                <Text style={styles.menuText}> {t("groupchat.deletegroup")}</Text>
            </TouchableOpacity> 
            ) : null}

            <TouchableOpacity style={styles.menuItem} onPress={handleLeaveGroup}>
                <Ionicons name="exit-outline" size={24} color="#FF6F61" />
                <Text style={styles.menuText}>{t("groupchat.leavegroup")}</Text>
            </TouchableOpacity> 
        </View>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    menuText: {
        fontSize: 18,
        marginLeft: 10,
    },
});

export default SettingMenu;
