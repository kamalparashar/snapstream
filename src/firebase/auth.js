import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase.js";
import userPhoto from "../assets/User.png"
import { setDoc, doc, updateDoc} from "firebase/firestore";
import { db } from "./firebase.js";

export class AuthService {
  async createAccount({ profile, username, email, password }) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredentials) {
        console.log(userCredentials)
        await updateProfile(userCredentials.user, {
          displayName: username,
          photoURL: profile?profile:userPhoto,
        });
        console.log("Account created: ", userCredentials.user);
        await setDoc(doc(db, "users", userCredentials.user.uid), {
          username: userCredentials.user.displayName,
          profilePhoto: userCredentials.user.photoURL
        })
        return userCredentials.user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error occurred while creating account: ", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(){
    return new Promise((resolve, reject) => { 
        const unsubscribe = onAuthStateChanged(auth, (user) => { 
            unsubscribe(); // Unsubscribe immediately after getting the user 
            if (user) { 
                const userInfo = { 
                    id: user.uid, 
                    username: user.displayName, 
                    email: user.email, 
                    profilePhoto: user.photoURL?user.photoURL:userPhoto, 
                    emailVerified: user.emailVerified, 
                }; 
                resolve(userInfo); 
            } 
            else { 
                resolve(null); 
            } 
        }, reject);
    });
  }

  async updateProfilePhoto(url){
    try {
      await updateProfile(auth.currentUser, {
        photoURL: url,
      })
      .then(async()=>{
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          profilePhoto: auth.currentUser.photoURL
        })
        return url
      })
      .catch((error) => {
        throw error
      })
    } 
    catch(error){
      throw error
    }
  }
}


const authService = new AuthService();

export default authService;