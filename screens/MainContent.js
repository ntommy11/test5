import React, { useState, useEffect, useContext } from 'react';
import { AppRegistry } from 'react-native';
import { StyleSheet, Text, View, Button,ScrollView,TouchableOpacity,TextInput,Alert } from 'react-native';
import {Header} from 'react-native-elements';
import { ApolloClient, ApolloProvider, InMemoryCache, useQuery , createHttpLink, useMutation} from "@apollo/client";

import { GET_CONTINENTS, GET_CONTINENT, SEE_REGIST_LECTURE, GET_USERID } from "../queries";
import { Appbar } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Ionicons } from '@expo/vector-icons';
import { AuthContext, UserContext,IdContext } from '../components/context';
import AsyncStorage from '@react-native-community/async-storage';

import HomeScreen from './HomeScreen';
import ScheduleScreen from './ScheduleScreen';
import {SEE_ALL_POSTERS,POST_VIEW,POST_UPLOAD,POST_DELETE}from '../queries'
  

var Bid

function GetAllPost({navigation}){
    const{loading, error, data} = useQuery(SEE_ALL_POSTERS,{
        variables: {a: Bid}
    }) 
    if(loading) return (<Text>로딩..</Text>);
    if(error) return(<Text>에러!!{error}</Text>);
    //console.log(data);
    return(
    <View>
      <ScrollView alwaysBounceVertical={true}>
        {data.seeAllPost.map(post =>
          <TouchableOpacity 
            style={styles.line}
            onPress= {()=>{navigation.navigate("Post",{id:post.id, title: post.title, text:post.text,userId: post.UserId})}}
             key={post.id}>
            <Text style={{fontSize : 30}}>{post.title}</Text>
            <Text style={{fontSize : 13}}>{post.text}</Text>
        </TouchableOpacity>
        )}
      </ScrollView>
      <View style={{borderWidth:1,position:'absolute',bottom:0,alignSelf:'flex-end'}}>
           <Button
             title="Press"
             accessibilityLabel="Press"
             onPress={()=>{navigation.navigate("Upload")}}
             />
        </View> 
    </View>
      );

      //버튼 크기 up필요.가운데로 옮기기
}   
 

export function Community({route, navigation}){
  const userInfo = React.useContext(UserContext);
  const client = new ApolloClient({
    uri: "http://52.251.50.212:4000/",
    cache: new InMemoryCache(),
    headers: { 
       Authorization: `Bearer ${userInfo.token}`
      },
  })
  
  Bid = route.params.id
  return(
  <ApolloProvider client = {client}>
    <GetAllPost navigation ={navigation}/>
  </ApolloProvider>
   );

}
 

function ViewPost({route,navigation}){//한 Post 다 출력
  const Id =useContext(IdContext)
  const [deletemutation] = useMutation(POST_DELETE);
  const deletefunc = async(pid) =>{
      try{
      const data = await deletemutation({
        variables: {
          pid: pid
        }
      }
    )}
    catch(e){
      console.log(e); 
      }
  }  
  if(Id.id == route.params.userId){
    React.useLayoutEffect(() => { //삭제 헤더 버튼 붙이기.
      navigation.setOptions({
        headerRight: () => (
          <Button title="삭제" onPress={()=>{Alert.alert(
            "글을 삭제하시겠습니까?",
            "",
            [
              {
                text: "예",
                onPress: () => {
                  deletefunc(route.params.id);
                  navigation.navigate("Community",{id:Bid})},
                style: "cancel"
              },
              { text: "아니오", onPress: () => {return;} }
            ],
            { cancelable: true }
          );} }/>
          ),
      });
    }, [navigation]); 
  }
  const IdInfo = useContext(IdContext);

  const{loading, error, data} = useQuery(POST_VIEW,{
    variables: {a: route.params.id}
  })

  if(loading) return (<Text>로딩..</Text>);
  if(error) return(<Text>에러!!{error}</Text>);
  //const test=[1,2,3,4,5]
  return(<ScrollView automaticallyAdjustContentInsets={false}>
    <View style={styles.line}>
    <PostStyle title={route.params.title} text ={route.params.text} />
    {data.seeAllComment.map((comment)=><CommentStyle text={comment.text} key={comment.id} />)}
    </View>
  </ScrollView>);
} 



export function Post({route,navigation}){
  const userInfo = React.useContext(UserContext);
  const client = new ApolloClient({
    uri: "http://52.251.50.212:4000/",
    cache: new InMemoryCache(),
    headers: { 
       Authorization: `Bearer ${userInfo.token}`
      },
  })
  return(
    <ApolloProvider client = {client}>
      <ViewPost route ={route} navigation={navigation} />
  </ApolloProvider>
);

}

const PostStyle = ({title,text}) => {
  //console.log("타입은",title, text)
  return(
    <View style={styles.line}>
    <Text style={{fontSize:20}}>익명{"\n"}</Text>
    <Text style={{fontSize:35}}>{title}</Text>
    <Text style={{fontSize:20}}>{text}</Text> 
    </View>
  );
} 
const CommentStyle = ({text}) => {
  //console.log("타입은",title, text) 
  return(
    <View style={styles.line}>
    <Text style={{fontSize:15}}>익명</Text>
    <Text style={{fontSize:20}}>{text}{"\n"}</Text> 
    </View>
  );
}
 

const CheckUpload = ({navigation}) => {
  //console.log("eeeeee",bid,typeof(bid));
  const [uploadmutation] = useMutation(POST_UPLOAD);
  const upload = async({bid, title, text}) =>{
    try{
    const data = await uploadmutation({
      variables: {
        bid: Bid,
        title: title,
        text: text
      }
    }
  )}
  catch(e){
    console.log(e); }
  }
  return(<UpdateScreen navigation={navigation} upload={upload} />);
}

export function Upload({route,navigation}) {  
  const userInfo = React.useContext(UserContext);
  const client = new ApolloClient({
    uri: "http://52.251.50.212:4000/",
    cache: new InMemoryCache(),
    headers: {
       Authorization: `Bearer ${userInfo.token}`
      },
  })

  return(<ApolloProvider client={client}>
    <CheckUpload navigation ={navigation} />
    </ApolloProvider>
  );
}

const UpdateScreen = ({navigation, upload})=>{
  const [title,setTitle] = useState("");
  const [text, setText] = useState("");

  return(<View>
  <TextInput 
    placeholder="제목"
    onChangeText={(val)=>setTitle(val)} />
  <TextInput 
    placeholder="내용"
    onChangeText={(val)=>setText(val)}
    multiline />
      <Button title="upload" onPress={()=>{
        if(title =="" || text =="") alert("제목, 글 모두 다 입력하세요.")
        else{
          upload({Bid,title,text});
          navigation.navigate("Community",{id: Bid})
        }

      }}></Button>
  </View>
  );
}

 
const styles = StyleSheet.create({

  line: {
    backgroundColor: "#ffffff",
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    width: "90%",
    color: '#05375a',
},
});




