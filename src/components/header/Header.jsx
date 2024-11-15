import React from "react";
import { Container, Logo, LogoutBtn} from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Home from "../../assets/Home.png";
import User from "../../assets/User.png";
import Post from "../../assets/Post.png";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: <img src={Home} alt="Home" height={30} width={30}/>,
      slug: "/",
      active: true,
    },
    {
      name: <img src={Post} alt="add post" height={30} width={30}/>,
      slug: "/add-post",
      active: authStatus,
    },
    {
      name: <img src={User} alt="Profile" height={30} width={30}/>,
      slug: "/profile",
      active: authStatus,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "My Posts",
      slug: "/my-posts",
      active: authStatus,
    },
  ];

  return (
    <header className=' shadow-white shadow'>
      <Container className={`mx-0 max-w-full flex justify-end`}>
        <nav className="flex justify-center items-center">
          <div className="mt-1 mr-4 sm:mr-0.5">
            <Link to="/">
              <Logo className="h-[60px] w-[200px] flex justify-center items-center"/>
            </Link>
          </div>
        </nav>

        <ul className='flex justify-between items-center ml-auto float-right'>
          {navItems.map((item) =>
            item.active ? (
              <li key={item.slug}>
                <button
                onClick={()=> navigate(item.slug)}
                className='text-xl font-semibold inline-block px-3 rounded-full sm:px-2 sm:text-base'
                >
                  <span className="whitespace-nowrap">{item.name}</span>
                </button>
              </li>
            ) : null
          )}
          {authStatus && (
            <li key='logout'>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </Container>
    </header>
  );
}

export default Header;