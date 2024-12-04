import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import { useNavigate,  useParams } from 'react-router-dom';
import firebaseService from '../firebase/config'

function EditPost() {
    const [post, setPost] = useState(null)
    const {postId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (postId) {
            firebaseService.getPost(postId).then((post) => {
                if (post) {
                    setPost(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [postId, navigate])
    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost