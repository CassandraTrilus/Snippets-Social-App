import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from '../utils/axiosConfig'
import { toast } from 'react-toastify'

const Uploader = () => {
  const [myFile, setMyFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const formData = new FormData()
    formData.append('myFile', myFile)

    try {
      let success = axios.post(`upload/`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })

      if(success) {
        toast.success('Your avatar has been updated')
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleChange = (e) => {
    setMyFile(e.target.files[0])
  }

  return (
    <Form onSubmit={(e) => handleSubmit(e)}>
      <h5>Upload your profile photo:</h5>
      <input
        className='myFileUploader'
        type='file'
        name='myFile'
        required
        onChange={(e) => handleChange(e)}></input>
      <Button type='submit'>Upload File</Button>
    </Form>
  )
}

export default Uploader