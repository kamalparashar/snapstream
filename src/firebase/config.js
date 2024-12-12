import { db } from "./firebase.js";
import {
    collection,
    doc, 
    onSnapshot,
    addDoc,
    deleteDoc,
    updateDoc, 
    getDoc,
    serverTimestamp,
    query, 
    orderBy,
} from "firebase/firestore"
import { auth } from "./firebase.js";

class Service {

    async createPost({userId, username, FeaturedImage, caption}){
        try{
            const postData = await addDoc(collection(db, 'posts'),
                            {
                                timestamp: serverTimestamp(),
                                FeaturedImage: FeaturedImage,
                                caption: caption,
                                userId: userId,
                                username: username,
                            },
                        )

            const post = await this.getPost(postData.id)
            return post
        }
        catch(error){
            console.log("Error creating post: ", error);
            throw error;
        }
    }

    async updatePost(postId, {FeaturedImage, caption}){
        try {
            const docRef = doc(db, "posts", postId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                const data = docSnap.data();
                const imageURL = data[FeaturedImage];
                if(imageURL){
                    await deleteFile(imageURL);
                }
                const post = await updateDoc(docRef,
                    {
                        FeaturedImage: FeaturedImage,
                        caption: caption
                    }
                )
                console.log("Post updated successfully.");
                return post;
            }
            else{
                console.log("Document does not exists.");
                return null;
            }
        } catch (error) {
            console.log("Error while updating post: ", error);
        }
    }

    async deletePost(postId){
        try {
            const docRef = doc(db, "posts", postId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                const data = docSnap.data()
                const imageURL = data[FeaturedImage]
                if(imageURL){
                    await deleteFile(imageURL)
                }
            }
            await deleteDoc(docRef);
            console.log("Post deleted successfully");
        } catch (error) {
            console.log("Error Deleting post: ", error);
        }
    }

    //get post
    async getPost(postId){
        try {
            const docRef = doc(db, "posts", postId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                const post = {
                    id: docSnap.id,
                    FeaturedImage: docSnap.data().FeaturedImage,
                    caption: docSnap.data().caption,
                    userId: docSnap.data().userId,
                    username: docSnap.data().username,
                }
                post.comments = await this.getComments(post.id);
                return post;
            }
        } catch (error) {
            throw error;
        }
    }

    //get Posts
    async getPosts(postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"))){
        return await new Promise((resolve, reject) => { 
            const unsubscribe = onSnapshot(postsQuery, async(snapshot) => { 
                const posts = (snapshot.docs?.map(doc => {
                    return {
                        id: doc.id, 
                        FeaturedImage: doc.data().FeaturedImage, 
                        caption: doc.data().caption, 
                        userId: doc.data().userId, 
                        username: doc.data().username,
                    }
                }
            ))
            resolve(posts); 
            }, reject); 
            return ()=>{
                unsubscribe(); // Unsubscribe to clean up 
            }    
        });
    }

    async addComment({postId, comment}){
        try {
            const commentData = {
                timestamp:serverTimestamp(),
                comment: comment,
                username: auth.currentUser.displayName,
                userId: auth.currentUser.uid,
            }
            await addDoc(collection(db, 'posts', postId, 'comments'),commentData)
            return commentData
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
 
    async getComments(postId, callback) {
            const unsubscribe = onSnapshot(
            collection(db, 'posts', postId, 'comments'), 
            (snapshot) => { 
                const commentsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    comment: doc.data().comment,
                    username: doc.data().username,
                    userId: doc.data().userId
                }));
                if (callback) callback(commentsList); // Invoke the callback if provided
            })
            return () => unsubscribe(); // Unsubscribe to clean up 
    }

    async getUser(userId){
        try {
            const docSnap = await getDoc(doc(db, "users", userId))
            if(docSnap.exists()){
                console.log("cmiovmseiv")
                const user = {
                    profilePhoto: docSnap.data()?.profilePhoto,
                    username: docSnap.data()?.username
                }
                return user
            }
            else{
                return null
            }
        } catch (error) {
            throw error
        }
    }
}

const service = new Service();

export default service;