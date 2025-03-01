import React from "react";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";

function Home() {
  const authStatus = useSelector(state => state.auth.status);
  const posts = useSelector(state => state.posts.posts);

  return (
    <div className="w-full h-[calc(100vh-50px)]">
      <Container className="flex justify-center items-center">
          <div className="flex flex-col ">
            {posts.slice(1)?.map((post) => (
              <div
                key={post.id}
                className="mb-8 p-0 sm:w-full sm:flex sm:flex-col sm:flex-wrap"
              >
                <PostCard {...post} />
              </div>
            ))}
          </div>
      </Container>
    </div>
  );
}

export default Home;
