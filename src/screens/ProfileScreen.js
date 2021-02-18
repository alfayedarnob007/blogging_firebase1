import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ImageBackground } from "react-native";
import { Text, Card, Button, Image } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import { AntDesign } from '@expo/vector-icons';
import HeaderTop from "../components/HeaderTop";
import { getAllPosts } from "../functions/PostFunctions";
import PostCard from "./../components/PostCard";
import LikeCommentButton from "../components/LikeCommentButton";
import { deleteUserInfo } from "../functions/ProfileFunctions";

import * as firebase from "firebase";
import "firebase/firestore";

const ProfileScreen = (props) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  const background = { uri: "https://i.pinimg.com/originals/46/d2/70/46d27066a89f31495d2c70ae49a4413e.jpg" };
  const profile = { uri: "https://www.facebook.com/photo?fbid=2561732497378918&set=a.1391721271046719" }

  const loadPosts = async () => {
    setLoading(true);
    firebase
      .firestore()
      .collection("posts")
      .where("userId", "in", [firebase.auth().currentUser.uid])
      .onSnapshot((querySnapshot) => {
        let temp_posts = [];
        querySnapshot.forEach((doc) => {
          temp_posts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setPosts(temp_posts);
        setLoading(false);
      });
  };

  const loadUser = async () => {
    setLoading(true);
    firebase
      .firestore()
      .collection('user')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUser(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    loadPosts();
    loadUser();
  }, []);

  return (
    <AuthContext.Consumer>
      {(auth) => (
        <View style={styles.viewStyle}>
          <ImageBackground source={background} style={styles.image}>
            <HeaderTop
              DrawerFunction={() => {
                props.navigation.toggleDrawer();
              }}
            />
            <Card>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={profile}
                  style={styles.imageStyle} />
                <Text style={{ fontSize: 32 }}>
                  {firebase.auth().currentUser.displayName}
                </Text>
              </View>
            </Card>
            <Button
              buttonStyle={{ backgroundColor: '#e02f2f' }}
              containerStyle={{ width: 150, marginLeft: 120, marginRight: 10, marginTop: 15 }}
              titleStyle={{ marginLeft: 5 }}
              title="Delete User"
              type='solid'
              alignSelf='center'
              icon={<AntDesign name="deleteuser" size={24} color="white" />}
              onPress={async () => {
                deleteUserInfo();
                auth.setIsLoggedIn(false);
                auth.setCurrentUser({});
              }}
            />
            <Card>
              <View>
              <Text style={{ alignSelf: "center", fontSize: 18 }}>
                  Born on: {user.birthday} {"\n"}
                  Email: {user.email} {"\n"}
                  SID: {user.sid}
              </Text>
              </View>
            </Card>
            <FlatList
              data={posts}
              renderItem={({ item }) => {
                return (
                  <View>
                    <Card>
                      <PostCard
                        author={item.data.author}
                        body={item.data.body}
                        removeFunc={async () => {
                          if (item.data.userId == firebase.auth().currentUser.uid) {
                            deletePost(item.id);
                          }
                          else {
                            alert("you are not the author of the post!");
                          }
                        }}
                      />
                      <Card.Divider />
                      <LikeCommentButton
                        postID={item.id}
                        likes={item.data.likes}
                        navigateFunc={() => {
                          props.navigation.navigate("PostScreen", item);
                        }}
                      />
                    </Card>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          </ImageBackground>
        </View>
      )}
    </AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: "blue",
  },
  viewStyle: {
    flex: 1,
  },
  imageStyle: {
    height: 200,
    width: 200,
    margin: 5,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
});

export default ProfileScreen;