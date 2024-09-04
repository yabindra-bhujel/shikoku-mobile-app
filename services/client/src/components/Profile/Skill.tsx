import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    TextInput,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import UserInfoServices from "@/src/api/UserInfo";

interface SkillSchema {
    id: number;
    name: string;
}

interface SkillProps {
    skillProps: SkillSchema[] | undefined;
    fetchUserInfo: () => void;
}

const Skill: React.FC<SkillProps> = ({ skillProps, fetchUserInfo }) => {
    const [isSkillEditing, setIsSkillEditing] = useState<boolean>(false);
    const [skills, setSkills] = useState<SkillSchema[]>([]);
    const [newSkill, setNewSkill] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const skillColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#FFC133", "#33FFF9"];

    useEffect(() => {
        if (skillProps) {
            setSkills(skillProps);
        }
    }, [skillProps]);

    const handleEditing = () => {
        setIsSkillEditing(true);
    };

    const updateInterest = () => {
        setIsSkillEditing(false);
    };

    const addSkill = async () => {
        if (newSkill.trim() === '') return;

        setLoading(true);
        try {
            const response = await UserInfoServices.addSkill(newSkill);
            if (response.status === 201) {
                fetchUserInfo();
                setNewSkill('');
            }
        } catch (error) {
            Alert.alert('エラー', 'スキルの追加に失敗しました。再度お試しください。');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInterest = async (id: number) => {
        setLoading(true);
        try {
            const response = await UserInfoServices.deleteSkill(id);
            if (response.status === 204) {
                fetchUserInfo();
            }
        } catch (error) {
            Alert.alert('エラー', 'スキルの削除に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <FontAwesome name="code" size={20} color="purple" />
                    <Text style={styles.sectionTitle}>スキルセット</Text>
                </View>
                <TouchableOpacity 
                    onPress={isSkillEditing ? updateInterest : handleEditing}
                    accessibilityLabel={isSkillEditing ? "Save Skills" : "Edit Skills"}
                    accessibilityHint={isSkillEditing ? "Saves the skills" : "Allows you to edit skills"}
                >
                    <Ionicons name={isSkillEditing ? "save" : "create"} size={24} color={isSkillEditing ? "#FF33A6" : "#33FF57"} />
                </TouchableOpacity>
            </View>

            <View style={styles.interestContainer}>
                {isSkillEditing ? (
                    <View style={styles.editContainer}>
                        {skills.map((skill) => (
                            <View key={skill.id} style={[styles.interestBadge, { backgroundColor: skillColors[skills.findIndex(i => i.id === skill.id) % skillColors.length] }]}>
                                <FontAwesome name="code" size={16} color="black" />
                                <Text style={styles.interestText}>{skill.name}</Text>
                                <TouchableOpacity onPress={() => handleDeleteInterest(skill.id)} accessibilityLabel="Delete Skill">
                                    <Ionicons name="remove-circle" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <View style={styles.addContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="新しいスキルを入力"
                                value={newSkill}
                                onChangeText={setNewSkill}
                            />
                            <TouchableOpacity onPress={addSkill} disabled={loading} accessibilityLabel="Add Skill">
                                <View style={styles.addBtn}>
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="add" size={24} color="white" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.interestContainer}>
                        {skills.length === 0 && <Text>スキルが登録されていません。編集ボタンを押して追加してください。</Text>}
                        {skills.map((skill) => (
                            <View key={skill.id} style={[styles.interestBadge, { backgroundColor: skillColors[skills.findIndex(i => i.id === skill.id) % skillColors.length] }]}>
                                <Ionicons name="heart-outline" size={16} color="#fff" />
                                <Text style={styles.interestText}>{skill.name}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        minHeight: 150,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    interestContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    editContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    addContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    interestBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    interestText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 50,
        padding: 10,
        marginRight: 10,
        flex: 1,
        fontWeight: '600',
        minWidth: 200,
    },
    addBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        backgroundColor: '#FF5733',
        borderRadius: 50,
    },
});

export default Skill;
