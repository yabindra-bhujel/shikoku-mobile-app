import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";

interface ImagePostProps {
  images: string[];
}

const ImagePost: React.FC<ImagePostProps> = ({ images }) => {
  return (
    <View style={styles.container} >
      {images.map((image, index) => (
        <View
          key={index}
          style={[
            images.length === 1 ? styles.singleImage: null,
          ]}
        >
          <Image
            source={{ uri: image }}
            style={[
              styles.image,
              images.length === 1 ? styles.singleImageStyle : null,
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
  },

  singleImage: {
    width: "100%",
  },
  doubleImage: {
    width: (screenWidth - 30) / 2, 
    height: 150,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  singleImageStyle: {
    height: 350,
  },

});

export default ImagePost;
