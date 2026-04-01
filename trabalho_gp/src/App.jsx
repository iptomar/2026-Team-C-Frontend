import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Create_form from './components/create_form.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Create_form></Create_form>
    
    </>
  )
}

export default App
