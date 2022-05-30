import React, { useState } from 'react'
import { useEffect } from 'react';
import SearchModule from './search';
import Container from './container';
import Module from './module';
import { useRouter } from 'next/router';
import { getPosts, getUser, getUsers, isSignedIn, trySignIn, signOut } from '../components/query.js';


const Leaderboard = () => {
    const [ret, setReturn] = useState(null);

    const getAllUsers = async () => {//temp
        return(getUsers());
    }
    const idsToRatings = (users) =>{
        for(let index in users){
            console.log(users[index]);
            for(let post in users[index]['interactions']['posts']){
                users[index]['interactions']['posts'][post] = Math.floor(Math.random() * 10) + 1;
            }
            for(let comment in users[index]['interactions']['comments']){
                users[index]['interactions']['comments'][comment] = Math.floor(Math.random() * 10) + 1;
            }
        }
    }
    const addRatings = (users) =>{
        for(let index in users){
            if(users[index]['interactions']['posts'].length == 0){
                users[index]['postrating'] = "N/A";
            }
            else{
                users[index]['postrating'] = users[index]['interactions']['posts'].reduce((a, b) => a + b, 0);
            }
            if(users[index]['interactions']['comments'].length == 0){
                users[index]['commentrating'] = "N/A";
            }
            else{
                users[index]['commentrating'] = users[index]['interactions']['comments'].reduce((a, b) => a + b, 0);
            }
            
        }
    }
    const renderList = (users, type) => {
        const listItems = []
        if(type){
            for(let index in users){
                listItems.push(
                <li>
                    <div class="leaderentry">
                        <img src="https://e7.pngegg.com/pngimages/439/554/png-clipart-ghost-emoji-emoticon-ghost-smiley-emoji-sticker-fictional-character-thumbnail.png" />
                        <div className='description'>
                            <p class="name">{users[index]["firstname"]} {users[index]["lastname"]}</p>
                            <p class="ratingvalue">Average Rating: {users[index]["postrating"] === "N/A"? "N/A" : users[index]["postrating"]}</p>
                        </div>
                    </div>
                </li>
                );
            }
        }
        else{
            for(let index in users){
                listItems.push(
                <li>
                    <div class="leaderentry">
                        <img src="https://e7.pngegg.com/pngimages/439/554/png-clipart-ghost-emoji-emoticon-ghost-smiley-emoji-sticker-fictional-character-thumbnail.png" />
                        <div className='description'>
                            <p class="name">{users[index]["firstname"]} {users[index]["lastname"]}</p>
                            <p class="ratingvalue">Average Rating: {users[index]["commentrating"] === "N/A"? "N/A" :users[index]["commentrating"]}</p>
                        </div>
                    </div>
                </li>
                );
            }
        }
        
        return(listItems);
    }
    const generateReturns = () => { 
        console.log("here");

        if(ret != null){
            return;
        }
        getAllUsers().then((res)=>{
            const users = [];
            for(let index in res){
                users.push(res[index]['data']);
            }
            //users is a list of dictionaries of user data
            idsToRatings(users);
            addRatings(users);
            //each user data now has a postrating and commentrating field
            console.log(users);
    
            const postSortedUsers = users.sort((a, b) => b["postrating"] - a["postrating"]);
    
            const postLeaderboard = 
            <div class='leaderboard'>
                <h1 class='leadertitle'>Post Leaderboard</h1>
                <ul>
                    {renderList(postSortedUsers, true)}
                </ul>
            </div>
    
            const commentSortedUsers = users.sort((a, b) => b["commentrating"] - a["commentrating"]);
    
            const commentLeaderboard = 
            <div class='leaderboard'>
                <h1 class='leadertitle'>Comment Leaderboard</h1>
                <ul>
                    {renderList(commentSortedUsers, false)}
                </ul>
            </div>
            let retVal = 
            <div class={'leaderwrapper'}>
                <div className='leaderpagetitle'> Leaderboards</div>
                {postLeaderboard}
                {commentLeaderboard}
            </div>
            setReturn(retVal);
        })
    }
    generateReturns();
    return(ret);
 }
  
export default Leaderboard;