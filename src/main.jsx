//Hooks are used to manage state(special variables) and side effects in functional components.
//UseEffect - is a hook that allows you to perform side effects in functional components. run's side by side (like. fetching data from an API)-(eg. it not disturbs previous state or process)
//UseRef - is a hook that allows you to create a reference to a DOM element.
//UseContext = manages the global context or state of the application. help of this we sent data globally to any component. (kind of dark - light theme which controls from anywhere)

//UseReducer - is a hook that allows you to manage state in a more complex way. useContext only manages the simple thing well but if we want to manage complex state then we use useReducer. (link accessing king of things, checks logins) useContext + useReducer = Redux

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './ecommerce.css'
import Router from './pages/Router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
