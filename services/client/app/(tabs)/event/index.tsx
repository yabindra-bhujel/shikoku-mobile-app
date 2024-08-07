import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import EventHeader from "@/src/components/event/EventHeader";

interface EventProps {
  title: string;
  description: string;
  imageUrl: string;
  eventDate?: string;
}

const SchoolEvent = () => {
  const theme = useColorScheme();
  const eventList: EventProps[] = [
    {
      title: "プログラミング",
      description:
        "Card (カード) コンポーネントは、見出し、画像、概要を表示し、詳細表示への入り口となる便利なコンポーネントです。マテリアルデザインでも大事な役割を果たしていて、主要なアプリケーションでも頻繁に活用されています。ここでは次のような UI を作ります。",
      imageUrl: "https://picsum.photos/seed/picsum/200/300",
      eventDate: "2021-10-10",
    },
    {
      title: "学園祭",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum",
      imageUrl: "https://picsum.photos/seed/picsum/200/300",
      eventDate: "2021-10-10",
    },
    {
      title: "スポーツ",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum",
      imageUrl: "https://picsum.photos/seed/picsum/200/300",
      eventDate: "2021-10-10",
    },
    {
      title: "音楽",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum",
      imageUrl: "https://picsum.photos/seed/picsum/200/300",
      eventDate: "2021-10-10",
    },
    {
      title: "あいずみ商工会納涼祭2024",
      description:
        "藍住町総合文化ホール屋外広場にて行われる「第18回あいずみ商工会納涼祭2024」にて、四国大学T-LAPが参加します。昨年に引き続いての参加となり、藍住町商工会館、藍住町総合文化ホールの２つの建物をライトアップし施設と夜空を彩ります。当日の屋外ステージでは、ダンスパフォーマンスなど各種パフォーマンスが披露されるほか、会場には多数の露店が出店します。子どもから大人まで楽しめる内容となっていますので、皆様お誘い合わせの上ぜひご来場ください。イベントの詳細は以下をご覧ください。",
      imageUrl: "https://www.t-lap.net/wp-content/uploads/2024/07/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88-2024-07-23-102849.png",
    }
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#333" : "#fff",
    },
    body: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      paddingHorizontal: 2,
    },
    card: {
      width: "48%",
      backgroundColor: theme === "dark" ? "#444" : "#fff",
      marginVertical: 10,
      borderRadius: 10,
      overflow: 'hidden',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    imageContainer: {
      position: 'relative',
      width: "100%",
      height: 200,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    dateText: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: '#fff',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 5,
      fontSize: 12,
    },
    cardText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#000",
      margin: 10,
    },
    cardDescription: {
      color: theme === "dark" ? "#333" : "#666",
      margin: 10,
      marginTop: 0,
      fontWeight: "semibold",
      fontSize: 15,
    },
    searchContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    searchInput: {
      width: "80%",
      padding: 10,
      borderColor: theme === "dark" ? "#666" : "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      marginRight: 10,
    },
    searchIconContainer: {
      position: "absolute",
      right: 15,
      top: 10,
    },
    searchIcon: {
      color: theme === "dark" ? "#666" : "#ccc",
    },
    headerText: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#000",
      marginBottom: 10,
    },
  });

  return (
    <View style={styles.container}>
      <EventHeader />
      <ScrollView>
        <View style={{ padding: 10 }}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              style={styles.searchInput}
            />
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={24} style={styles.searchIcon} />
            </View>
          </View>
          <Text style={styles.headerText}>upcomming event</Text>
          <View style={styles.body}>
            {eventList.map((event, index) => (
              <TouchableOpacity key={index} style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: event.imageUrl }}
                    style={styles.image}
                  />
                  <Text style={styles.dateText}>{event.eventDate}</Text>
                </View>
                <Text style={styles.cardText}>{event.title}</Text>
                <Text style={styles.cardDescription}>
                  {event.description.length > 50
                    ? event.description.substring(0, 50) + "..."
                    : event.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SchoolEvent;
