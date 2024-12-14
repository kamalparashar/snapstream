import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Button } from "./index";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import firebaseService from "../firebase/config.js";
import { addComment } from "../store/postSlice.js";

function PostCard(post) {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const initialComments = useSelector(
    (state) => state.posts.posts.find((p) => p.id === post.id)?.comments || []
  );
  const [comments, setComments] = useState(initialComments);
  const [user, setUser] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const userData = await firebaseService.getUser(post.userId);
      setUser(userData);
      const unsubscribe = firebaseService.getComments(
        post.id,
        (commentsList) => {
          setComments(commentsList)
          commentsList.forEach((comment) => {
            dispatch(addComment({ postId: post.id, ...comment }));
          });
        }
      );
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
    fetchData();
  }, [post.id, post.userId, dispatch]);

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
  };
  
  return (
    <div className=" h-auto w-[316px] flex flex-col border-2 border-gray-700 lg:w-[600px] lg:text-4xl xl:w-[500px] 2xl:w-[800px] ">
      <div className="flex items-center justify-between px-4 py-2">
        <Link to={`/user/${post.userId}`}>
          <div className="flex justify-evenly items-center gap-3">
            <img
              src={user.profilePhoto}
              alt="photo"
              className="w-[4vmax] h-[4vmax] block border-[5px] border-double rounded-full"
            />
            <span className="whitespace-nowrap">
              <strong>{user.username}</strong>
            </span>
          </div>
        </Link>
        <div className="flex justify-start text-blue-500">Follow</div>
      </div>
      <Link to={`/post/${post.id}`}>
        <div className="h-full flex flex-col gap-4">
          <img src={post.FeaturedImage} />
          <div className="flex gap-2 pl-2 pb-2">
            <strong>{post.username}</strong>
            {parse(post.caption)}
          </div>
        </div>
      </Link>
      <div className="flex flex-col pl-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <strong>{comment.username}</strong> 
            <p>{comment.comment}</p>
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
              className="py-2 focus:border border-black"
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
  );
}

export default PostCard;
