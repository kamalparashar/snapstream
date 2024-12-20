import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import authService from "../firebase/auth.js";
import firebaseService from "../firebase/config.js";
import { useSelector } from "react-redux";
import { Button, Card, Modal } from "./index.js";
import updateImage from "../assets/updateImage.png";
import { uploadFile } from "../cloudinary/cloudinary.js";

function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

function Profile() {
  const { userId } = useParams();
  const posts = useSelector((state) => state.posts.posts);
  const [userPosts, setUserPosts] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const [userData, setUserData] = useState(null);
  const chunkedPosts = chunkArray(userPosts, 2);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadFile(e.target[0].files[0])
      .then(async (url) => {
        await authService.updateProfilePhoto(url);
      })
      .then((res) => {
        setUserData((prevState) => ({ ...prevState, profilePicture: res }));
        console.log(userData);
      })
      .catch((error) => console.log("Error: while updating profile", error));
  };

  useEffect(() => {
    if (userId) {
      const filteredPosts = posts.filter((post) => post.userId == userId);
      setUserPosts(filteredPosts);
    }
  }, [userId, posts]);

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
            })
            .catch((error) => {
              console.log("Error: while fetching user profile info: ", error);
            });
        }
      })
      .catch((error) => {
        console.log("error in UseEffect while fetching user data:", error);
      });
  }, [userId]);
  return (
    <div>
      <div className="flex justify-around px-8 py-4">
        <div className="flex flex-col  justify-center items-center text-center">
          <img
            src={userData?.profilePhoto}
            alt="profile"
            onClick={openModal}
            className="block object-cover w-[15vmax] h-[15vmax] rounded-full border-2 border-double border-gray-800"
          />
          {isAuthor && <Modal showModal={showModal} closeModal={closeModal}>
          {/* <form className="flex flex-col space-y-4">
              <h2 className="text-xl font-bold">Contact Form</h2>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Name"
              />
              <input
                type="email"
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Email"
              />
              <textarea
                className="border border-gray-300 p-2 rounded-md"
                placeholder="Message"
              ></textarea>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md"
              >
                Submit
              </button>
            </form>  */}
            </Modal>
          }
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
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="block w-full h-full"
                >
                  <Card {...post} />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
