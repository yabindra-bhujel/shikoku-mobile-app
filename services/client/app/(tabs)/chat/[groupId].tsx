import {
    Text,
    View,
    useColorScheme,
    ScrollView,
    Alert,
} from "react-native";
import GroupHeader from "@/src/components/GroupChat/GroupHeader";
import MessageFooter from "@/src/components/GroupChat/MessageFooter";
import { useLocalSearchParams, useRouter } from "expo-router";
import GroupServices from "@/src/api/GroupServices";
import { useEffect, useState } from "react";
import GroupMessageList from "@/src/components/GroupChat/GroupMessageList";

const ChatDetail = () => {
    const theme = useColorScheme();
    const { groupId } = useLocalSearchParams<{ groupId: string }>() ?? {
        groupId: "",
    };

    const [group, setGroup] = useState<any>([]);

    useEffect(() => {
        const fetchGroup = async () => {
            if (!groupId) return;

            try {
                const response = await GroupServices.getGroup(groupId);
                setGroup(response.data);
            } catch (error) {
                Alert.alert("Error", "Failed to fetch group data from server . Please try again later.");
            }
        };
        fetchGroup();
    }, [groupId]);

    return (

        // header
        <View style={{
            flex: 1,
        }}>

            <View style={{ height: 54, backgroundColor: theme === "dark" ? "#333" : "#fff" }} />

            {/* header */}
            <GroupHeader groupData={group} />

            <ScrollView>
                {/* message list */}
                <GroupMessageList  />
            </ScrollView>

            {/* footer */}
            <MessageFooter />
        </View>
    );
};

export default ChatDetail;
