import { StyleSheet, ScrollView, View, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import PostCreateHeader from "@/src/components/PostCreate/PostCreateHeader";
import TextArea from "@/src/ReusableComponents/TextArea";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import PostServices from "@/src/api/PostServices";
import { useRouter } from "expo-router";

const CreatePost = () => {
  const [images, setImages] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const router = useRouter();

  const goBack = () => {
    router.back();
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 2,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 2) {
      Alert.alert("エラー", "写真は2枚以下にしてください。");
    }

    if (!result.canceled) {
      const selectedImages = [result.assets[0].uri];
      setImages(selectedImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages?.splice(index, 1);
    setImages(newImages);
  };

  const sendPost = async () => {
    try {
      const formData = new FormData();
  
      images.forEach((imageUri, index) => {
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
  
        formData.append('images', {
          uri: imageUri,
          name: `image${index}.${fileType}`,
          type: `image/${fileType}`,
        } as unknown as Blob);
      });
  
      formData.append('content', content);

      // check if image or content is empty
      if (images.length === 0 && content === "") {
        Alert.alert("エラー", "写真かテキストのどちらかを入力してください。");
        return;
      }
      const res = await PostServices.sendPost(formData);
      if (res.status === 201) {
        setImages([]);
        setContent("");
        goBack();
      }

    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: "white",
        }}
      >
        <PostCreateHeader post={sendPost} />
        <View>
          <TextArea text={content} setText={setContent} />
        </View>
        <View style={styles.imageContainer}>
          {images.map((imageUri, index) => (
            <View key={index} style={[styles.imageWrapper, images.length === 1 ? styles.fullWidth : styles.halfWidth]}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      {images.length < 2 && (
        <TouchableOpacity
          style={[styles.button, styles.buttonEnabled]}
          onPress={pickImage}
        >
          <Ionicons name="images" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonEnabled: {
    backgroundColor: 'blue',
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 350,
    marginBottom: 5,
  },
  fullWidth: {
    width: '100%',
  },
  halfWidth: {
    width: '50%',
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 2,
    borderRadius: 150,
  },
});

export default CreatePost;
