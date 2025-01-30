"use client"

import {useState} from "react"

export default function Footer() {
    const [count, setCount] = useState(0)
    function handleClick() {
      setCount(count + 1)}

    return (
        <footer className="bg-white/50 backdrop-blur rounded-lg">
        <div className="max-w-4xl mx-auto flex flex-col items-center py-6 text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Our Company.</p>
      <p>Vous avez cliqué {count} fois sur le boutton.<button onClick={handleClick}>Click Me</button></p>
      </div>
        </footer>
    )
  }