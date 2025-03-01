import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import firebaseService from "../firebase/config"
import { Input, Button, Container } from "../components/index"
import parse from "html-react-parser"
import { useDispatch, useSelector } from "react-redux"
import { deletePost } from "../store/postSlice"
import { addComment } from "../store/postSlice.js"
import { useForm } from "react-hook-form"
import { getPostById, getCommentsByPostId } from '../store/selectors'

export default function Post() {
  const { register, handleSubmit, reset } = useForm()
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authStatus = useSelector((state) => state.auth.status)
  const [user, setUser] = useState([])
  const post = useSelector((state) => getPostById(state, id))
  const comments = useSelector((state) => getCommentsByPostId(state, id))

  useEffect(() => {
    if (id) {
      firebaseService
      .getUser(post?.userId)
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.log("Error while fetching userInfo.", error);
      })
    } else navigate("/");
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
      const res = await firebaseService.addComment({
        postId: id,
        comment: data.comment,
      });
      dispatch(
        addComment({
          postId: id,
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
        comment: '',
      });
    }
  };

  if (authStatus) {
    return post ? (
      <div className="w-full mt-4">
        <Container className="flex flex-col lg:flex-row xl:flex-row 2xl:flex-row justify-between p-4">
          <div className="mb-8 w-full lg:w-6/12 xl:w-6/12 2xl:w-6/12 bg-[#191919] border-2 border-gray-700 ">
            <div className=" flex items-center justify-between p-2 text-md">
              <div className="flex justify-evenly items-center gap-3">
                <img
                  src={user?.profilePhoto}
                  alt="photo"
                  className="w-[6vmax] h-[6vmax] xl:w-[4vmax] xl:h-[4vmax] 2xl:w-[3.5vmax] 2xl:h-[3.5vmax] block border-[5px] border-double rounded-full bg-cover"
                />
                <span className="whitespace-nowrap text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                  <strong>{user?.username}</strong>
                </span>
              </div>
              <div className="flex justify-start text-blue-500 font-semibold text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                Follow
              </div>
            </div>
            <div className="flex flex-col">
              <img src={post.FeaturedImage} />
            </div>
            <div className="flex gap-1 md:gap-2 lg:gap-2 xl:gap-3 2xl:gap-4 p-2 2xl:p-8">
              <strong>{post.username}</strong>
              {parse(post?.caption || "")}
            </div>
          </div>

          <div className="w-full lg:w-5/12 xl:w-5/12 2xl:w-5/12 px-2 py-4 border-2 border-gray-700">
            <h1 className="font-bold">Comments</h1>
            {authStatus ? (
              <form name="comment_form" onSubmit={handleSubmit(submitComment)}>
                <div className="flex w-full mt-4 pb-4 2xl:mt-8 2xl:pb-8">
                  <Input
                    placeholder="add a comment..."
                    {...register("comment", {
                      required: true,
                    })}
                    className="py-2 border-2 border-black text-white bg-[#000] focus:bg-[#000]"
                  />
                  <Button
                    type="submit"
                    children={"Post"}
                    className=" w-1/4 font-semibold text-white bg-gray-700 transition-all ease-in duration-75 border-2 border-l-0 border-black hover:bg-white hover:text-black"
                  />
                </div>
              </form>
            ) : null}
            <div className="pt-4 max-h-[400px] overflow-y-auto px-2">
              {authStatus ? (
                <div className="flex flex-col">
                  {comments?.map((comment) => (
                    <div key={comment.id} className="flex gap-2 pb-2 2xl:pb-4">
                      <span className="whitespace-nowrap">
                        <strong>{comment.username}</strong>
                      </span>
                      <p className="break-words overflow-hidden">{comment.comment}</p>
                    </div>
                  ))}
                </div>
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
