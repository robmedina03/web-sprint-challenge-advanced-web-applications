import React, { useState } from 'react'
import PT from 'prop-types'





const initialFormValues = {
  username: '',
  password: '',
}
export default function LoginForm({ login  }) {
  
  const [values, setValues] = useState(initialFormValues)


  
  

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = async evt => {
    evt.preventDefault()
    try{
    await login({ username: values.username, password: values.password})
   
  }catch(error){
    console.error('Login failed:', error.message)
  }
}

  const isDisabled = () => {
    const {username, password} = values
    return !(username.trim().length >= 3 && password.trim().length >= 8)
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
  
}
