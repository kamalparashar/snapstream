import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase.js";

export class AuthService {
  async createAccount({ profile, username, email, password }) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredentials) {
        await updateProfile(userCredentials.user, {
          displayName: username,
          photoURL: profile,
        });
        console.log("create account: ", userCredentials.user);
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
                    profilePicture: user.photoURL, 
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

//   async getCurrentUser() {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userInfo = {
//             id: user.uid,
//             username: user.displayName,
//             email: user.email,
//             profilePicture: user.photoURL,
//             emailVerified: user.emailVerified,
//           };
//           return userInfo;
//         // return user;
//       } else {
//         return null;
//       }
//     });
//     return () => unsubscribe();
//     // const user = auth.currentUser;
//     // if (!user) {
//     //   return null;
//     // }
    
//   }
}

const authService = new AuthService();

export default authService;
