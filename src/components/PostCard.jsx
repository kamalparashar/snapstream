import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Button } from "./index";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import firebaseService from "../firebase/config.js";
import { addComment } from "../store/postSlice.js";
import { getPostById, getCommentsByPostId } from '../store/selectors'

function PostCard(post) {
  const { register, handleSubmit, reset } = useForm()
  const dispatch = useDispatch()
  const authStatus = useSelector((state) => state.auth.status)
  const [user, setUser] = useState([])
  const comments = useSelector((state) => getCommentsByPostId(state, post.id))

  useEffect(() => {
      firebaseService.getUser(post.userId)
      .then((userData)=>{
        setUser(userData);
      })
  }, [post.id])

  const submitComment = async (data) => {
    try {
      const res = await firebaseService.addComment({
        postId: post.id,
        comment: data.comment,
      });
      dispatch(
        addComment({
          postId: post.id,
          comment: res.comment,
          id: res.id,
          username: res.username,
          userId: res.userId,
        })
      );
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      reset({
        comment: "",
      });
    }
  }
  return (
    <div className="h-auto w-[318px] md:w-[650px] lg:w-[700px] xl:w-[800px] 2xl:w-[1800px] flex flex-col border-2 border-gray-700">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex justify-evenly items-center">
          <Link to={`/user/${post.userId}`}>
            <div className="flex justify-evenly items-center gap-3">
              <img
                src={user.profilePhoto}
                alt="photo"
                className="w-[6vmax] h-[6vmax] xl:w-[4vmax] xl:h-[4vmax] block border-[5px] border-double rounded-full"
              />
              <span className="whitespace-nowrap text-2xl">
                <strong>{user.username}</strong>
              </span>
            </div>
          </Link>
          <div className="px-2 text-sm">●</div>
          <div className="flex justify-start items-end text-blue-500 text-lg">Follow</div>
        </div>
        <div className="text-white text-2xl font-bold">⋮</div>
      </div>
      <Link to={`/post/${post.id}`}>
        <div className="h-full flex flex-col gap-4 pb-2">
          <img src={post.FeaturedImage} />
          <div className="flex gap-2 pl-4">
            <strong>{post.username}</strong>
            <div className="line-clamp-3">{parse(post.caption)}</div>
          </div>
        </div>
      </Link>
      <div className="flex flex-col px-4 max-h-[100px] overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <strong>{comment.username}</strong> 
            <p className="break-words overflow-hidden">{comment.comment}</p>
          </div>
        ))}
      </div>

      {authStatus ? (
        <form name="comment_form" onSubmit={handleSubmit(submitComment)}>
          <div className="flex w-full mt-3">
            <Input
              placeholder="add a comment..."
              {...register("comment", {
                required: true,
              })}
              className="py-2 border-2 border-black text-white bg-[#191919] focus:bg-[#000]"
            />
            <Button
              type="submit"
              children={"Post"}
              className="w-1/4 font-semibold text-white bg-gray-700 transition-all ease-in duration-75 border-2 border-black hover:bg-white hover:text-black"
            />
          </div>
        </form>
      ) : null}
    </div>
  );
}

export default PostCard;
