import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import authService from "../firebase/auth.js";
import firebaseService from "../firebase/config.js";
import { useSelector, useDispatch } from "react-redux";
import { Input, Button, Card, Modal } from "./index.js";
import { deleteFile, uploadFile } from "../cloudinary/cloudinary.js";
import { useForm } from "react-hook-form";
import { deletePost } from "../store/postSlice.js";
import User from "../assets/User.png"

function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

function Profile() {
  const { userId } = useParams()
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts.posts)
  const [userPosts, setUserPosts] = useState([])
  const [isAuthor, setIsAuthor] = useState(false)
  const [userData, setUserData] = useState(null)
  const chunkedPosts = chunkArray(userPosts, 2)
  const [showModal, setShowModal] = useState(false)
  const {register, handleSubmit, reset} = useForm()
  const [isFile, setIsFile] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(User)

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleClick = async (id,FeaturedImage)=>{
    try {
      await firebaseService.deletePostAndComments(id)
      await deleteFile(FeaturedImage)
      dispatch(deletePost({id}))
    } catch (error) {
      console.log("Error while deleting post. :: ", error)
    }
  }

  const updateProfile = async (data) => {
    await uploadFile(data.image[0])
      .then(async (url) => {
        await authService.updateProfilePhoto(url)
        setUserData((prevState) => ({ ...prevState, profilePhoto: url }))
        console.log(url)
      })
      .catch((error) => console.log("Error: while updating profile", error))
      .finally(()=>{
        reset({
          update:''
        })
      })
  };

  useEffect(() => {
    if (userId) {
      const filteredPosts = posts.filter((post) => post.userId === userId)
      setUserPosts(filteredPosts)
    }
  }, [posts]);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(async (userInfo) => {
        if (userInfo && userInfo.id === userId) {
          setIsAuthor(true);
          setUserData(userInfo);
        } else {
          // make a function getuser(userid) to get the info of the user.
          await firebaseService
            .getUser(userId)
            .then((user) => {
              setUserData(user)
              setProfilePhoto(user?.profilePhoto)
            })
            .catch((error) => {
              console.log("Error: while fetching user profile info: ", error);
            });
        }
      })
      .catch((error) => {
        console.log("error in UseEffect while fetching user data:", error);
      });
  }, [userId])

  return (
    <div>
      <div className="flex justify-around px-8 py-4">
        <div className="flex flex-col justify-center items-center text-center">
          <img
            src={userData?.profilePhoto || profilePhoto}
            alt="profile"
            onClick={openModal}
            className="block object-cover w-[15vmax] h-[15vmax] rounded-full border-2 border-double border-gray-800"
          />
          <Modal showModal={showModal} closeModal={closeModal}>
              <form onSubmit={handleSubmit(updateProfile)} className="flex justify-evenly items-center text-2xl text-blue-700 px-16">
                <img
                  src={profilePhoto}
                  alt="profile"
                  className="block object-cover w-[25vmax] h-[25vmax] rounded-full border-2 border-double border-gray-800"
                />
                {isAuthor && <Input
                      label="Change"
                      type="file"
                      className="mb-4 hidden"
                      accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                      {...register("image", { required: true })}
                      onChange = {(event)=>{
                        setIsFile(true); 
                        setProfilePhoto(event.target.files[0])
                      }}
                      />
                    }
                    {isAuthor && (isFile) && 
                      <Button 
                        type="submit"
                        className="m-4"
                        children={"Submit"}
                      />
                    }
              </form> 
          </Modal>
          <div className="text-2xl flex pt-2">
            <strong>{userData?.username}</strong>
          </div>
        </div>
        <div className="flex font-bold justify-start items-center gap-8 text-center">
          <div>
            <p>10</p>followers
          </div>
          <div>
            <p>10</p>following
          </div>
          <div>
            <p>10</p>Total posts
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="border-b border-t border-gray-600 shadow-gray-600 shadow-md p-4 flex justify-center items-center font-bold text-2xl">
          Posts
        </div>
        <div className="p-4 grid grid-cols-3 md:grid-cols-4 gap-2">
          {chunkedPosts?.map((chunk, index) => (
            <div key={index} className="grid gap-2">
              {chunk?.map((post) => (
                <div key={post.id} className="relative">
                  {isAuthor && <Button onClick={()=>handleClick(post.id, post.FeaturedImage)} children="DEL"
                      className="absolute top-2 right-2 z-[1] bg-[#006A4E] rounded-md p-1 font-semibold" 
                  />}
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="block w-full h-full"
                  >
                    <Card {...post} />
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
