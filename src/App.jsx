import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "./firebase/auth.js";
import firebaseService from "./firebase/config.js";
import { login, logout } from "./store/authSlice.js";
import { Outlet } from "react-router-dom";
import { Header } from "./components";
import { addPost, addComment } from "./store/postSlice.js";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log("error in UseEffect:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let unsubscribeAllComments = [];
    async function fetchComments(id) {
      const unsubscribe = await firebaseService.getComments(id, (comments) => {
        comments.forEach((comment) => {
          dispatch(addComment({ postId: id, ...comment }));
        });
      });
      unsubscribeAllComments.push(unsubscribe);
    }
    firebaseService.getPosts().then((posts) => {
      if (posts) {
        posts.forEach((post) => {
          dispatch(addPost(post));
          fetchComments(post.id);
        });
      }
    });
    return () => {
      unsubscribeAllComments.forEach((unsubscribe) => unsubscribe());
    };
  }, [dispatch]);

  return !loading ? (
    <div className="relative min-h-screen flex w-full ">
      <div className="w-full block">
        <Header />
        <main className="min-h-screen md:text-md lg:text-lg xl:text-xl 2xl:text-5xl">
          <Outlet />
        </main>
      </div>
    </div>
  ) : null;
}

export default App;
