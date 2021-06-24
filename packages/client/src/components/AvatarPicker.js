import React, { useState } from 'react'

const AvatarPicker = ({ handleProfileImage }) => {
  const avatars = [
    "/bird.svg",
    "/dog.svg",
    "/fox.svg",
    "/lion.svg",
    "/owl.svg",
    "/tiger.svg",
    "whale.svg",
  ]

  const [selectedImage, setSelectedImage] = useState("")

  //jobin helped me with the event handlers

  const selectHandler = (img) => {
    handleProfileImage(img)
    setSelectedImage(img)
  }

  return (
    <div>
    <h5>Choose your profile avatar:</h5>
      {avatars && avatars.map((avatar) => {
        if(avatar === selectedImage) {
          return (
            <div className="selected">
              <img 
                src={avatar}
                key={avatar}
                alt={avatar}
                width="75px"
                onClick={() => selectHandler(avatar)}
              />
            </div>
          )
        } else {
          return (
            <div>
              <img 
              src={avatar}
              key={avatar}
              alt={avatar}
              width="75px"
              onClick={() => selectHandler(avatar)}
              />
            </div>
          )
        }
      })}
    </div>
  )
}

export default AvatarPicker