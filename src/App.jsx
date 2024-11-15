import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import authService from './firebase/auth.js'
import {login, logout} from './store/authSlice.js'
import {Outlet} from 'react-router-dom'
import {collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "./firebase/firebase.js"
import {Header} from './components'

function App() {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const authStatus = useSelector(state=>state.auth.status)
  
  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData) => {
      if(userData){
        console.log("userdata");
        dispatch(login({userData}));
      }
      else{
        console.log("no data");
        dispatch(logout());
      }
    })
    .catch((error) => {
      console.log("NO user currently logged In");
      console.log("error in UseEffect:",error);
    })
    .finally(() => setLoading(false))
  },[])

  useEffect(() => {
    const colref = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    return onSnapshot(colref, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between'>
      <div className='w-full block'>
        <Header />
        <main className='min-h-screen flex justify-center items-center font-semibold md:text-lg lg:text-xl'>
          <Outlet />
        </main>
      </div>
    </div>
    ) : null
}

export default App 
