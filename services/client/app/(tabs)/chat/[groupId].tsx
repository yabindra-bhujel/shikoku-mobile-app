import {
    Text,
    View,
    useColorScheme,
    ScrollView,
} from "react-native";
import GroupHeader from "@/src/components/GroupChat/GroupHeader";
import MessageFooter from "@/src/components/GroupChat/MessageFooter";

const ChatDetail = () => {
    const theme = useColorScheme();

    return (

        // header
        <View style={{
            flex: 1,
        
        }}>
            
            <View style={{height: 54,backgroundColor: theme === "dark" ? "#333" : "#fff"}}/>

            {/* header */}
            <GroupHeader/>

            <ScrollView>
                <Text>
                    {/* messge goes to here */}
                </Text>
            </ScrollView>


            {/* footer */}
            <MessageFooter/>
        </View>
    );
};

export default ChatDetail;