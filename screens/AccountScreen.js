import React from 'react';
import { AuthContext, UserContext, IdContext} from '../components/context';
import {View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function AccountScreen(){
    const user = React.useContext(UserContext);
    const user_meta = React.useContext(IdContext);
    const { signOut } = React.useContext(AuthContext);
  
    return(
      
        <View>
            <View style={styles.card}>
                <Text>계정: {user.email}</Text>
                <Text>등급: {user_meta.grade}</Text>
            </View>
            <View style={{alignItems:"center", justifyContent:"center"}}>
                <TouchableOpacity style={styles.button} onPress={()=>signOut()}>
                    <Text style={{fontSize:20, color:"white"}}>로그아웃</Text>
                </TouchableOpacity>
            </View>
        </View>
      
    )
  }

  const styles = StyleSheet.create({
    classboxText:{
      textAlign: "center",
      fontSize: 11,
    },
    classboxTextsmall:{
      textAlign: "center",
      fontSize: 6,
    },
    classbox:{
      paddingVertical: 3,
      justifyContent: "center",
      borderStyle: "dashed",
      borderWidth: 1,
      flex: 1
    },
    classbox2:{
      justifyContent: "center",
      borderStyle: "dashed",
      borderWidth: 1,
      flex: 1
    },
    weeklyHeader: {
      backgroundColor: "white",
      flexDirection: 'row',
      borderStyle: "dashed",
      borderWidth: 1,
    },
    weeklyHeaderBox: {
      padding: 9,
      flex: 1
    },
    weeklyHeaderText: {
      textAlign: "center",
      fontWeight: "700"
    },
    scrollView: {
      height: 200
    },
    card2: {
      marginVertical: 5,
      marginHorizontal: 25,
      borderWidth: 1,
      borderColor: "#dcdcdc",
      borderRadius: 10,
      height: "40%"
    },
    card: {
      backgroundColor: "white",
      marginVertical: 5,
      marginHorizontal: 25,
      borderWidth: 1,
      borderColor: "#dcdcdc",
      borderRadius: 10,
      padding: 10
    },
    date: {
      margin: 5,
      color: "blue",
      fontSize: 15,
      borderColor: "black",
      textAlign: "center",
    },
    time: {
      margin: 5,
      fontWeight: "600",
      fontSize: 20,
      textAlign: "center",
    },
    subject: {
      textAlign: "center",
      fontSize: 30,
      fontWeight: "600",
    },
    location: {
      textAlign: "center",
      fontSize: 10,
      color: "#646464",
    },
    week: {
      margin: 5,
      textAlign: "center",
      fontSize: 10,
      color: "#646464",
    },
    where: {
      marginTop: 7,
      padding: 3,
      borderRadius: 10,
      backgroundColor: "#dcdcdc",
      alignSelf: "center",
      fontSize: 10,
      color: "grey",
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    button: {
      alignItems: 'center',
      marginVertical: 10,
      marginHorizontal: 10,
      borderStyle:"dashed", 
      borderWidth:1,
      padding:10,
      width: "80%",
      borderRadius: 10,
      backgroundColor: "#1478FF",
      borderColor: "white"
  },
  });