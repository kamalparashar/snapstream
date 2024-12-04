import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [{
        id: '',
        caption: '',
        FeaturedImage:'',
        userId:'',
        username:'',
        comments: [{}]
    }]
}

const postSlice = createSlice({
    name:"posts",
    initialState,
    reducers: {
        addPost: (state, action) => {
            const post = {
                id : action.payload.id,
                caption: action.payload.caption,
                FeaturedImage: action.payload.FeaturedImage,
                userId: action.payload.userId,
                username: action.payload.username,
                comments: action.payload.comments
            }
            state.posts.push(post);
        },
        removePost: (state, action) => {
            state.posts = state.posts.filter((post) => (post.id !== action.payload.id))
        },
        editPost: (state, action) => {
            state.posts.map((post) => {
                if(post.id === action.payload.id){
                    post.caption = action.payload.caption,
                    post.FeaturedImage = action.payload.FeaturedImage,
                    post.userId = action.payload.userId,
                    post.username = action.payload.username
                }
            })
        },
    }
})

export const { addPost, removePost, editPost } = postSlice.actions;

export default postSlice.reducer;