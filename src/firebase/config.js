import { db } from "./firebase.js";
import {
    collection,
    doc, 
    addDoc,
    deleteDoc,
    updateDoc, 
    getDoc, 
    serverTimestamp
} from "firebase/firestore"
import {
    deleteObject, 
    getDownloadURL, 
    getStorage, 
    ref
} from "firebase/storage";

class Service {

    async createPost({username, image, caption}){
        try{
            const downloadUrl = await uploadFile(image);
            const postData = await addDoc(collection(db, 'posts'),
                        {
                            timestamp: serverTimestamp(),
                            imageUrl: downloadUrl,
                            caption: caption,
                            username: username,
                        },
                    )
            console.log("Post created successfully!");
            return postData;
        }
        catch(error){
            console.log("Error creating post: ", error);
            throw error;
        }
    }

    async updatePost(postId, {image, caption}){
        try {
            const docRef = doc(db, "posts", postId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                const data = docSnap.data();
                const imageURL = data[imageUrl];
                if(imageURL){
                    await deleteFile(imageURL);
                }
                const  downloadUrl = await uploadFile(image);
                const post = await updateDoc(docRef,
                    {
                        imageUrl: downloadUrl,
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
            const docRef = doc(db, "posts", postId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                const data = docSnap.data();
                const imageURL = data[imageUrl];
                if(imageURL){
                    await deleteFile(imageURL);
                }
            }
            await deleteDoc(docRef);
            console.log("Post deleted successfully");
        } catch (error) {
            console.log("Error Deleting post: ", error);
        }
    }


    // upload file
    async uploadFile(image){
        try {
            if(!image){
                return null;
            }
            const storage = getStorage();
            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = ref(storage, 'images/' + image.name);
            const uploadTask = await uploadBytesResumable(storageRef, image);

            await getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                return downloadUrl;
            })
        } catch (error) {
            throw error;
        }
    }

    // delete file
    async deleteFile(imageURL){
        const baseURL = "https://firebasestorage.googleapis.com/v0/b/your-app-id.appspot.com/o/"; 
        const filePath = decodeURIComponent(imageURL.split(baseURL)[1].split("?")[0]);
        const fileRef = ref(storage, filePath);
        try {
            await deleteObject(fileRef);
            console.log("File deleted successfully!");
        } catch (error) {
            console.log("Error! Deleting file: ", error);
            throw error;
        }
    }


}

const service = new Service();

export default service;