import { LogBox } from 'react-native';
import _ from 'lodash';

import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { AuthContext, AuthProvider } from "./src/providers/AuthProvider";

import AppDrawerScreen from "./src/navigation/AppDrawer";
import AuthStackScreen from "./src/navigation/AuthStack";

import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyChR1T3shBQsk_mrRFg59lx_7wTeGW05Kk",
  authDomain: "blogging-app-b2b30.firebaseapp.com",
  databaseURL: "https://blogging-app-b2b30-default-rtdb.firebaseio.com",
  projectId: "blogging-app-b2b30",
  storageBucket: "blogging-app-b2b30.appspot.com",
  messagingSenderId: "125359243686",
  appId: "1:125359243686:web:160cfcc264ac05e66f8f67"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {(auth) => (
          <NavigationContainer>
            {auth.IsLoggedIn ? <AppDrawerScreen /> : <AuthStackScreen />}
          </NavigationContainer>
        )}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;