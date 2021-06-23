import React from 'react'

const avatars = [
  "/bird.svg",
  "/dog.svg",
  "/fox.svg",
  "/lion.svg",
  "/owl.svg",
  "/tiger.svg",
  "whale.svg",
]

function AvatarPicker({ selector }) {
  return (
    <div>
      <h6>Choose your profile avatar:</h6>
      <div></div>
        {avatars.map((avatar) => (
          <img 
            src={avatar}
            key={avatar}
            alt={avatar}
            width="75px"
          onClick={() => selector(avatar)}
          />
        ))}
    </div>
  )
}

export default AvatarPicker