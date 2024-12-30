import React from "react";
import { Button, Input, RTE } from "../index";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import firebaseService from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { addPost, updatePost } from "../../store/postSlice";
import { uploadFile, deleteFile, getFile } from "../../cloudinary/cloudinary.js"

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, getValues, control } =
    useForm({
      defaultValues: {
        caption: post?.caption || "",
        FeaturedImage: post?.FeaturedImage || "",
        postId: post?.id || "",
      },
    });

  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()

  const submit = async (data) => {
    if (post) {
      const file = data.image[0]
        ? await uploadFile(data.image[0])
        : null;
      if (file) {
        deleteFile(post.FeaturedImage);
      }

      const dbPost = await firebaseService.updatePost(post.id, {
        ...data,
        FeaturedImage: file ? file : post.FeaturedImage,
      });
      if (dbPost) {
        dispatch(updatePost(dbPost))
        navigate(`/post/${dbPost.id}`)
      }
    }
    else {
      const file = await uploadFile(data.image[0])
      if (file) {
        data.FeaturedImage = file;
        const dbPost = await firebaseService.createPost({
          ...data,
          userId: userData.id,
          username: userData.username
        })
        if (dbPost) {
          dispatch(addPost(dbPost))
          navigate(`/post/${dbPost.id}`)
        }
        else{
          await deleteFile(post.FeaturedImage)
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className=" w-full flex flex-col gap-4 lg:flex-row xl:flex-row 2xl:flex-row">
      <div className="px-1 w-full lg:w-2/3 xl:w-2/3 2xl:w-2/3">
        <RTE
          label="Caption :"
          name="caption"
          control={control}
          defaultValue={getValues("")}
        />
      </div> 
      <div className="px-2 w-full lg:w-1/3 xl:w-1/3 2xl:w-1/3">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4 text-white"
          accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="mb-4 w-full lg:w-1/3 xl:w-1/3 2xl:w-1/3">
            <img
              src={firebaseService.getFile(post.FeaturedImage)}
              alt="Photo"
              className="rounded-lg"
            />
          </div>
        )}

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className={post ? "w-full p-2 hover:bg-green-900" : "w-full p-2 hover:bg-blue-500 active:bg-blue-900"}
          children={post ? "Update" : "Submit"}
        />
      </div>
    </form>
  );
}
export default PostForm;
