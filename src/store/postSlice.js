import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [
    {
      id: "",
      caption: "",
      FeaturedImage: "",
      userId: "",
      username: "",
      comments: [],
    },
  ],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      const post = {
        id: action.payload.id,
        caption: action.payload.caption,
        FeaturedImage: action.payload.FeaturedImage,
        userId: action.payload.userId,
        username: action.payload.username,
        comments: []
      };
      state.posts.push(post);
    },
    updatePost: (state, action) => {
      state.posts.map((post) => {
        if (post.id === action.payload.id) {
            (post.caption = action.payload.caption),
            (post.FeaturedImage = action.payload.FeaturedImage),
            (post.userId = action.payload.userId),
            (post.username = action.payload.username);
        }
      });
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload.id);
    },
    addComment: (state, action) => {
      const { postId, id, comment, userId, username} = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        const commentData = {
          id:id,
          comment: comment,
          userId:userId,
          username: username,
        }
        post.comments.push(commentData);  
      }
    },
    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.comments = post.comments.filter(
          (comment) => comment.id !== commentId
        );
      }
    },
    updateComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        const index = post.comments.findIndex((c) => c.id === comment.id);
        if (index !== -1) {
          post.comments[index] = comment;
        }
      }
    },
    removeComments: (state, action) => {
      const post = state.posts.find((post) => post.id === action.payload);
      if(post){
        post.comments = []
      }
      else{
        console.log("Error: in removeComments:: post not found.")
      }
    }
  },
});

export const { addPost, deletePost, updatePost, addComment, deleteComment, updateComment, removeComments} = postSlice.actions;

export default postSlice.reducer;
