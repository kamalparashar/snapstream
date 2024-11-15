import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [{
        id: '',
        caption: '',
        imageUrl:'',
        userId:'',
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
                imageUrl: action.payload.imageUrl,
                userId: action.payload.userId
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
                    post.imageUrl = action.payload.imageUrl,
                    post.userId = action.payload.userId
                }
            })
        },
    }
})

export const { addPost, removePost, editPost } = postSlice.actions;

export default postSlice.reducer;