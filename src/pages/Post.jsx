import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import firebaseService from "../firebase/config";
import {Input, Button, Container} from '../components/index'
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../store/postSlice";
import { useForm } from "react-hook-form";

export default function Post() {
  const { register, handleSubmit, reset} = useForm();
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const postData = useSelector((state) => state.posts.posts);
  const isAuthor = post && userData ? post.userId === userData.id : false;
  const [comments, setComments] = useState([])

  useEffect(() => {
    if (id) {
      const post = postData.filter(post => post.id == id)
      if(post){
        setComments(post.comments)
      }
      else{
        navigate("/")
      }
    } 
    else navigate("/");
  }, [id]);

  const deletePost = () => {
    firebaseService.deletePost(post.id).then((status) => {
      if (status) {
        firebaseService.deleteFile(post.FeaturedImage).then((status) => {
          if (status) {
            dispatch(deletePost(post));
            navigate("/");
          }
        });
      }
    });
  };

  const submitComment = async (data) => {
    try {
      await firebaseService.addComment({postId: post.id, comment: data.comment});
      setComments((prev) => (prev = [...prev, res]))
    } catch (error) {
      console.log(error)
      throw error;
    }
    finally{
      reset({
        comment:'',
      });
    }
  };

  if (authStatus) {
    return post ? (
      <div className="w-full mt-8 ">
        <Container className="flex justify-between p-4 ">
          <div className="  w-6/12 bg-[#191919] border-2 border-gray-700">
            <div
              className=" flex items-center justify-between px-4 py-2"
            >
              <div className="flex justify-evenly items-center gap-3">
                <img
                  src={post.FeaturedImage}
                  alt="photo"
                  width={50}
                  height={50}
                  className="w-[4vmax] h-auto block border-[5px] border-double rounded-full"
                />
                <span className="whitespace-nowrap">
                  <strong>{post.username}</strong>
                </span>
              </div>
              <div className="flex justify-start text-blue-500 ">Follow</div>
            </div>

            <div className="flex flex-col">
              <img src={post.FeaturedImage} />
            </div>
            <div className="flex gap-2 pt-4">
              <strong>{post.username}</strong>
              {parse(post.caption)}
            </div>
          </div>
          <div className=" w-5/12 ">
            <div className=" max-h-[600px] overflow-y-auto pl-6 border border-gray-700 rounded-xl ">
              {authStatus ? (
                <div className="flex flex-col">
                  {comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <strong>{comment.username}</strong>
                      <p>{comment.comment}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div>
            {authStatus ? (
                <form
                  name="comment_form"
                  onSubmit={handleSubmit(submitComment)}
                >
                  <div className="flex w-full mt-3">
                    <Input
                      placeholder="add a comment..."
                      {...register("comment", {
                        required: true,
                      })}
                      className="py-2 focus:border-2 border-black"
                    />
                    <Button
                      type="submit"
                      children={"Post"}
                      className="w-1/5 bg-white border text-gray-600 text-center hover:bg-[#212121] hover:border-white hover:text-white"
                    />
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </Container>
      </div>
    ) : null;
  } else {
    navigate("/login");
  }
}
