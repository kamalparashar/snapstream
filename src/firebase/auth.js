import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { auth } from "./firebase.js";

export class AuthService {

    async createAccount({name, email, password}){
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            if(userCredentials){
                userCredentials.user.displayName = name;
                return userCredentials.user;
            }
            else{
                return null;
            }
        } catch (error) {
            console.log("Error occurred while creating account: ",error);
            throw error;
        }
    }

    async login({email, password}){
        try{
            return await signInWithEmailAndPassword(auth, email, password);
        }
        catch(error){
            throw error;
        }
    }

    async logout(){
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        return new Promise((resolve, reject) => { 
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe(); 
                // Unsubscribe after the first event 
                resolve(user || null); 
            }, reject); 
        });
    }
    
}

const authService = new AuthService();

export default authService;