import React, { useState, useEffect } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import axios from 'utils/axiosConfig.js'
import { Post } from 'components'
import LoadingSpinner from 'components/LoadingSpinner'
import { useProvideAuth } from 'hooks/useAuth'
import { toast } from 'react-toastify'

const initialState = {
  postText: '',
  isSubmitting: false,
  errorMessage: null,
}

export default function Feed() {
  const {
    state: { user },
  } = useProvideAuth()
  const [posts, setPosts] = useState(null)
  const [postLoading, setPostLoading] = useState(true)
  const [postError, setPostError] = useState(false)

  const [data, setData] = useState(initialState)
  const [validated, setValidated] = useState(false)
  const [rerender, setRerender] = useState(true)
  const [searchData, setSearchData] = useState("")

  const handleRerender = () => {
    setRerender(!rerender)
  }

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    })
  }


  const handlePostSubmit = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      toast.error('Post text is required');
      setValidated(true)
      return
    }

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })

    axios
      .post('/posts', {
        text: data.postText,
        author: user.username,
      })
      .then(
        (res) => {
          setData(initialState)
          setPosts((posts) => [
            {
              ...res.data,
              author: {
                username: user.username,
                profile_image: user.profile_image,
              },
            },
            ...posts,
          ])
          setValidated(false)
        },
        (error) => {
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: error.message,
          })
        }
      )
  }


  useEffect(() => {
    const getPosts = async () => {
      try {
        const allPosts = await axios.get('posts')

        //Becky explained the logic for this in our whole group learning last Wednesday
        allPosts.data.forEach((post) => {
          let allLikes = []
          post.likes.forEach((user) => {
            allLikes.push(user.username)
          })
          const separatedLikes = allLikes.join(', ')
          post.separatedLikes = separatedLikes
        })


        setPosts(allPosts.data)
        setPostLoading(false)
      } catch (err) {
        console.error(err.message)
        setPostLoading(false)
        setPostError(true)
      }
    }
    getPosts()
  }, [rerender])

  //Jobin and Mike helped me with the ternary below in the render

  return (
    <>
      <Container className='pt-3 pb-3 clearfix'>
        <h4>Share a Snip</h4>
        <Form
          noValidate
          validated={validated}
          onSubmit={handlePostSubmit}
        >
          <Form.Control
            as='textarea'
            rows={3}
            maxLength='120'
            name='postText'
            placeholder="What's on your mind?"
            aria-describedby='post-form'
            size='lg'
            required
            value={data.postText}
            onChange={handleInputChange}
          />

          {data.errorMessage && (
            <span className='form-error'>{data.errorMessage}</span>
          )}
          <Button
            className='float-right mt-3'
            type='submit'
            disabled={data.isSubmitting}
          >
            {data.isSubmitting ? <LoadingSpinner /> : 'Post'}
          </Button>
        </Form>
      </Container>

      <Container>
      <Form className="search-bar">
        <input
          placeholder="Search"
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
      </Form>
    </Container>


      {!postLoading ? (
        <Container
          className='pt-3 pb-3'
        >
          <h6>Recent Snips</h6>
          {postError && 'Error fetching posts'}
          {posts && searchData === "" ?
            posts.map((post) => <Post key={post._id} post={post} handleRerender={handleRerender} />) 
            : posts.map((post) => {
              if(post.text.includes(searchData)) {
                return <Post key={post._id} post={post} handleRerender={handleRerender} />
              }
            })}
        </Container>
      ) : (
        <LoadingSpinner full />
      )}
    </>
  )
}
