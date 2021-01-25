import React from 'react';
import {gql} from 'apollo-boost';

export const GET_CONTINENTS = gql`
    query{
        continents{
            code
            name
        }
    }
`;

export const  LOGIN = gql`
    mutation login($email: String!, $password: String!){
        login(email: $email, password: $password)
    }
`;

export const GET_USERID = gql`
    query findUserbyName($email: String!){
        findUserbyName(email: $email){
            id
            name
            grade
        }
    }
`;
export const GET_CONTINENT = gql`
query
  findContinent($code: ID!){
    continent(code: $code){
      name
    }
  }
`;

export const SEE_REGIST_LECTURE = gql`
query {
    seeRegistLecture{
        id
        name
        room
        classes{
            VOD
            startTime
            endTime
            week
        }
    }
}
`;

export const SEE_ALL_CLASSES = gql`
query find_classes($LectureId: Int, $week: Int){
    seeAllClasses(LectureId: $LectureId, week: $week){
        VOD
        startTime
        endTime
        LectureId
    }
}
`

export const SEE_ALL_POSTERS = gql`
query see_all($a: Int! ){
    seeAllPost(boardId: $a){
        title
        text
        id
        UserId

    }

}
`;

export const POST_VIEW = gql`
query post_view($a: Int!){
    seeAllComment(postId: $a){
      text
    }
}
`;

export const POST_UPLOAD = gql`
mutation upload($bid: Int!, $title:String!, $text:String!){
    createPost(BoardId:$bid ,title:$title , text: $text){
        title
        text
      }
}

`;

export const POST_DELETE = gql`
mutation postdelete($pid: Int!){
    deletePost(PostId:$pid){
      id
    }
  }

`;