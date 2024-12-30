import { createSelector } from 'reselect';

const getPosts = (state) => state.posts.posts;
const getPostId = (_, id) => id;

export const getPostById = createSelector(
  [getPosts, getPostId],
  (posts, id) => posts.find(post => post.id === id)
);

export const getCommentsByPostId = createSelector(
  [getPostById],
  (post) => post ? post.comments : []
);
