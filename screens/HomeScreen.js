import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { ApolloClient, InMemoryCache, useQuery, ApolloProvider } from "@apollo/client";
import { AuthContext, UserContext } from '../components/context';
import { SEE_REGIST_LECTURE, SEE_ALL_POST, POST_LOAD } from '../queries';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { Ionicons, EvilIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview'
import { ScrollView } from 'react-native-gesture-handler';

const NOW = new Date();
const TIMEZONE = NOW.getTimezoneOffset()*60000;

const weekday = ['일','월', '화', '수', '목', '금', '토'];

const currentClass = {
  date: "2019년 9월 23일 월",
  time: "09:00",
  name: "금융과 핀테크",
  week: "4주차",
  type: "SC수업",
  room: "무궁관 911호"
}
// 객체가 비어있는지 확인하는 함수 
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}

const CardInfo = ({current_class}) => {
  console.log("current class at CardInfo: ", current_class);
  // 더이상 수업이 없는 경우 처리
  if (current_class == undefined){
    const NOW = new Date();
    let year = NOW.getFullYear();
    let month = NOW.getMonth()+1;
    let date = NOW.getDate();
    let day = weekday[NOW.getDay()];
    return (
      <View style={styles.card}>
        <Text style={styles.date}>{year}년 {month}월 {date}일 {day}요일</Text>
        <Text style={styles.subject}> 현재 수업이 없습니다</Text>
      </View>
    )
  }
  // 현재 수업 데이터 전처리
  let year = current_class.start_time.getFullYear();
  let month = current_class.start_time.getMonth()+1;
  let date = current_class.start_time.getDate();
  let day = weekday[current_class.start_time.getDay()];
  let hours = current_class.start_time.getHours();
  let minutes = current_class.start_time.getMinutes();
  

  return (
    <View style={styles.card}>
      <Text style={styles.date}>{year}년 {month}월 {date}일 {day}요일</Text>
      <Text style={styles.time}>{hours>=10? hours: `0${hours}`}:{minutes >= 10? minutes: `0${minutes}`}</Text>
      <Text style={styles.subject}>{current_class.name}</Text>
      <Text style={styles.week}>{current_class.week}주차</Text>
      <View style={styles.where}>
        <Text style={styles.location}> {current_class.vod? "VOD":"SC"} | {current_class.room}   </Text>
      </View>
    </View>
  )
}
const CardInfo2 = ({next_class}) => {
  console.log("next class in CardInfo2: ", next_class);
  if (next_class == undefined){
    return (
      <View style={styles.card2}>
        <Text style={{ color: "#787878" }}>일정이 더이상 없습니다.</Text>
      </View>
    )
  }
  let name = next_class.name;
  let room = next_class.room;
  let month = next_class.start_time.getMonth()+1;
  let date = next_class.start_time.getDate();
  let day = weekday[next_class.start_time.getDay()];
  let hours = next_class.start_time.getHours();
  let minutes = next_class.start_time.getMinutes();
  return (
    <View style={styles.card2}>
      <Text style={{ color: "#787878" }}>{name} - {month}월 {date}일 {hours>=10? hours: `0${hours}`}:{minutes >= 10? minutes: `0${minutes}`} {room} </Text>
    </View>
  )
}

const Notification = ({navigation}) => {

  const { loading, error, data, refetch } = useQuery(SEE_ALL_POST,{
    variables:{
      boardId:1
    }
  });



  console.log("Notification loading: ",loading);
  console.log("Notification error  : ", error );
  
  

  if(loading){
    return(
      <View style={styles.card2}>
        <ActivityIndicator color="blue"/>
      </View>
    )
  }
  if(data){
    let posts = data.seeAllPost;
    console.log("posts: ", posts);
    if(posts.length<2){
      return(
        <View style={styles.card2}>
          <Text style={{ color: "#787878" }}>공지가 없습니다</Text>
        </View>
      )
    }
    return (
      <View style={styles.card2}>
        <TouchableOpacity style={styles.notificationList} 
          onPress= {()=>{navigation.navigate("Post",{id:posts[0].id, title: posts[0].title, text:posts[0].text, userId: posts[0].UserId})}}
        >
          <Text style={{ color: 'blue' }}>
            {posts[0].title}
          </Text>
          <Text style={{ color: "#787878" }}>{posts[0].text}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationList} onPress={() => alert("notification")}>
          <Text style={{ color: 'blue' }}>
            {posts[1].title}
          </Text>
          <Text style={{ color: "#787878" }}>{posts[1].text}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  if(error){
    return(
      <View style={styles.card2}>
        <Text style={{ color: "#787878" }}>불러오기 실패</Text>
      </View>
    )
  }
}

const Notification2 = ({navigation}) => {
  const { loading, error, data } = useQuery(POST_LOAD,{
    variables:{
      bid:2,
      snum: 0,
      tnum: 2,
    }
  });

  console.log("Notification loading: ",loading);
  console.log("Notification data   : " , data);
  console.log("Notification error  : ", error );
  

  if(loading){
    return(
      <View style={styles.card2}>
        <ActivityIndicator color="blue"/>
      </View>
    )
  }
  if(data){
    let posts = data.loadPost;
    console.log("posts: ", posts);
    if(posts.length==0){
      return(
        <View style={styles.card2}>
          <Text>공지가 없습니다</Text>
        </View>
      )
    }
    return (
      <View style={styles.card2}>
        {
          posts.map((post, index)=>{
            return(
              <TouchableOpacity 
                key={index}
                style={styles.notificationList} 
                onPress= {()=>{navigation.navigate("Post",{
                  id:post.id, 
                  title: post.title, 
                  text:post.text, 
                  UserId: post.UserId,
                  Comment: post.Comment
                })}}>
                <Text style={{ color: "#787878" }}>{post.title} {post.text}</Text>
              </TouchableOpacity>
            )
          })
        }
      </View>
    )
  }
  if(error){
    return(
      <View style={styles.card2}>
        <Text style={{ color: "#787878" }}>불러오기 실패</Text>
      </View>
    )
  }
}

function Main({navigation}){
  const { signOut } = React.useContext(AuthContext);
  // 강의 정보 받기.
  const { loading, error, data } = useQuery(SEE_REGIST_LECTURE);

  console.log("loading: ",loading);
  console.log("data   : " , data);
  console.log("error  : ", error );
  

  if(error){
    console.log("error  : ", error );
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>{error}</Text>
      </View>
    )
  }
  if(loading){
    console.log("loading...");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )    
  }
  if(data){
    // 데이터 전처리. 
    let lectures = data.seeRegistLecture;
    console.log("length: ", lectures.length);
    let class_list = [];
    for(let i=0; i<lectures.length; i++){
      let num_of_classes = lectures[i].classes.length;
      for(let j=0; j<num_of_classes; j++){
        let start_time = new Date(Number(lectures[i].classes[j].startTime)+TIMEZONE);
        console.log("timezone offset: ", start_time.getTimezoneOffset());
        let end_time = new Date(Number(lectures[i].classes[j].endTime)+TIMEZONE);
        let class_obj = {
          name: lectures[i].name,
          room: lectures[i].room,
          start_time: start_time,
          end_time: end_time,
          week: lectures[i].classes[j].week,
          vod: lectures[i].classes[j].VOD
        }
        class_list.push(class_obj);
      }
    }
    // 수업을 빠른 시간순으로 정렬 
    if(class_list.length > 1){
      class_list.sort((a,b)=>{
        return a.start_time.getTime() - b.start_time.getTime();
      })
    } 
    console.log("class_list: ",class_list);
    // 현재 시간 포함 가장 가까운 수업을 찾는다.
    let current_class = 0;
    let next_class = 0;
    let now = new Date();                     // 나중에 현재 시간으로 수정되어야 함
    for (let i=0; i<class_list.length; i++){
      if (now <= class_list[i].start_time){
        current_class = i;
        if(current_class+1 < class_list.length) next_class = i+1;
        break;
      }
    }
    console.log(now)
    console.log(class_list[current_class]);
    console.log(class_list[next_class]);
    return(
      <ScrollView style={{flex:1}}>
      <CardInfo current_class={class_list[current_class]}/>

      <Text style={{ textAlign: "left", paddingLeft: 30, fontWeight: "700", paddingTop: 10 }}>다음 일정</Text>
      
      <CardInfo2 next_class={class_list[next_class]}/>
      <TouchableOpacity style={{width: 100 }} onPress={() => alert("공지사항 더보기")}>
        <Text style={{ textAlign: "left", paddingLeft: 30, fontWeight: "700", paddingTop: 10 }}>공지사항</Text>
      </TouchableOpacity>
      <Notification navigation={navigation}/>
      <TouchableOpacity style={{width: 120}} onPress={() => alert("학생회 공지사항 더보기")}>
        <Text style={{ textAlign: "left", paddingLeft: 30, fontWeight: "700", paddingTop: 10 }}>학생회 공지사항</Text>
      </TouchableOpacity>
      <Notification2 navigation={navigation}/>
      <View style={{flex:1,flexDirection:"row", alignItems:"center", justifyContent:"center", marginHorizontal:20}}>
        
        <View style={styles.webview}>
          <TouchableOpacity onPress={()=>navigation.navigate("WebviewLMS")}>
            {/*<Image source={require('../assets/lms.png')} resizeMode="stretch"/>*/}
            <Text style={styles.webviewText}>LMS</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.webview}>
          <TouchableOpacity onPress={()=>navigation.navigate("WebviewHome")}>
            <Text style={styles.webviewText}>학교홈</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.webview}>
          <TouchableOpacity onPress={()=>navigation.navigate("WebviewPortal")}>
            {/*<Image source={require('../assets/portal.png')} resizeMode="stretch"/>*/}
            <Text style={styles.webviewText}>통합정보시스템</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    )
  }

}


export default function HomeScreen({navigation}) {
  const isFocused = useIsFocused();
  const userInfo = React.useContext(UserContext);
  const client = new ApolloClient({
    uri: "http://52.251.50.212:4000/",
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${userInfo.token}`
    }
  });
  /*
  useFocusEffect(React.useCallback(()=>{
    // 이곳에서 refetch
    alert('SCREEN IS FOCUSED');
    return()=>{
      alert("SCREEN WAS UNFOCUSED");
    }
  },[])
  );
  */
  if(isFocused){
    return (
      <ApolloProvider client={client}>
        <Main navigation={navigation}/>
      </ApolloProvider>
    )
  }else{
    return (
      <View></View>
    )
  }

}


const styles = StyleSheet.create({
  notificationTitle: {

  },
  notificationList: {
    flexDirection: "row",
    padding: 3,
  },
  card2: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 25,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    textAlign: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    margin: 25,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    textAlign: "center",
    justifyContent: "center",
  },
  date: {
    margin: 5,
    color: "blue",
    fontSize: 15,
    borderColor: "black",
    textAlign: "center",
    justifyContent: "center",
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
    justifyContent: 'center',
  },
  webview:{
    margin: 5,
    padding: 5,
    flex: 1,
    alignItems:"center",
    justifyContent: "center"
  },
  webviewText:{
    textAlign: "center",
    fontWeight: "700",
    color: "#323232"
  },
  logo:{
    width: 32,
    height: 32,
  }
});
