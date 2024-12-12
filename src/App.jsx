import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "./firebase/auth.js";
import firebaseService from "./firebase/config.js";
import { login, logout } from "./store/authSlice.js";
import { Outlet } from "react-router-dom";
import { Header } from "./components";
import { addPost } from "./store/postSlice.js";
import { comment } from "postcss";

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
    firebaseService.getPosts().then((posts) => {
      if (posts) {
        posts.map((post) => dispatch(addPost(post)));
      }
    });
  }, []);


  return !loading ? (
    <div className="min-h-screen flex w-full">
      <div className="w-full block">
        <Header />
        <main className="min-h-screen md:text-lg lg:text-xl">
          <Outlet />
        </main>
      </div>
    </div>
  ) : null;
}

export default App;
