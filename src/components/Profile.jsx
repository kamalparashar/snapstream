import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import firebaseService from "../firebase/config"
import { useSelector } from 'react-redux'
import { db } from "../firebase/firebase.js"
import {
    collection,
    query, 
    orderBy,
    where,
} from "firebase/firestore"
import {Card} from './index.js'

function Profile() {
  const {userId} = useParams()
  const allPosts = useSelector(state=>state.posts.posts)
  const [userData, setUserData] = useState("") 
  const [posts, setPosts] = useState(null)
  
  useEffect(()=>{
    // const Query = query(collection(db, "posts"), where("userId","==",`${userId}`) ,orderBy("timestamp", "desc"))
    // firebaseService.getPosts(Query).then((posts)=>{
    //   setPosts(posts)
    // })
    if(userId){
      const post = allPosts.filter((post)=> post.userId == userId)
      setPosts(post)
      // setUserData(post[0].username)
      console.log(post[0].username)
      
    }
  },[userId])

  return (
    <div className='p-4 gap-y-8'>
      <div className='flex justify-around'>
        <div className='flex flex-col text-center'>
          <img src="https://res.cloudinary.com/snapstream/image/upload/q_auto/c_fill,g_auto,h_300,w_300/firebase_jagmm8?_a=DATAg1AAZAA0" alt={userData.username} 
          className='w-[20vmax] h-auto border-2 border-double border-gray-800 rounded-full'/>
          <div className='text-3xl flex justify-center items-center p-2'>
            <strong>{userData.username}</strong>
          </div>
        </div>
        <div className='flex font-bold justify-start items-center gap-8 text-center'>
          <div><p>10</p>followers</div>
          <div><p>10</p>following</div>
          <div><p>10</p>Total posts</div>
        </div>
      </div>
      <div className='mt-4 flex flex-wrap gap-4'>
        {posts?.map((post)=> (
            <div id={post.id}>
                <Link to={`/post/${post.id}`}>
                  <Card {...post}/>
                </Link>
              </div>
          ))
        }
      </div>
    </div>
  )
}

export default Profile