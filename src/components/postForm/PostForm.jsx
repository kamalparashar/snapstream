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
      const file = await uploadFile(data.image[0]);
      if (file) {
        data.FeaturedImage = file;
        const dbPost = await firebaseService.createPost({
          ...data,
          userId: userData.id,
          username: userData.username
        });
        if (dbPost) {
          dispatch(addPost(dbPost))
          navigate(`/post/${dbPost.id}`)
        }
        else{
          await deleteFile(post.FeaturedImage);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2 sm:w-full">
        <RTE
          label="Caption :"
          name="caption"
          control={control}
          defaultValue={getValues("")}
        />
      </div> 
      <div className="w-1/3 px-2 sm:w-full sm:mt-4">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
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
