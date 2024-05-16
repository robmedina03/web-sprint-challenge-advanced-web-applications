import React, { useEffect, useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
     
      useEffect(() =>{
        checkLoggedIn()
      },[])

      const checkLoggedIn = () => {

        const token = localStorage.getItem('token')
        if(!token){
          logout()
        }
       
      }
      
      const amILoggedIn = !localStorage.getItem('token')



  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    localStorage.removeItem('token')
    setMessage('Goodbye!')

    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = async ({ username, password }) => {
        
        setSpinnerOn(true)
        try{

          const response = await fetch(loginUrl, {
            method:'POST',
            headers:{'Content-type': 'application/json'},
            body: JSON.stringify({username: username.trim(), password: password.trim()})
          })
          if(!response.ok){
            throw new Error('Invalid username or password')
          }
          const data = await response.json()
          localStorage.setItem('token', data.token)
          username= localStorage.getItem('username')
          setMessage(`Here are your articles, ${username}!`)
          setTimeout(() =>{
            redirectToArticles()
          },800)
         
        }catch(error){
          setMessage(error.message)
        }
        setSpinnerOn(false)

    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = async() => {

      setSpinnerOn(true)

      try{
        const token = localStorage.getItem('token')
        const response = await fetch(articlesUrl,{
          headers:{Authorization:token}})
          if(!response.ok){
            if(response.status === 401){
              throw new Error('Token Expired, please log in again')
            }
            throw new Error('Failed to fetch articles')
          }
          const data = await response.json()
          setArticles(data.articles)
          setMessage(`Here are your articles, ${localStorage.getItem('username')}!`)
        
      }catch(error){
        setMessage(error.message)
        if(error.message === 'Token Expired please log in again'){
          redirectToLogin()
        }
      }
      setSpinnerOn(false)
   
  }

  const postArticle = async (article) => {
      setSpinnerOn(true)
      try{
        const token= localStorage.getItem('token')
        
        const response = await fetch(articlesUrl, {
          method: 'POST',
          headers:{Authorization: token, 'Content-type': 'application/json'},
          body: JSON.stringify(article)
        })
        if(!response.ok){
          throw new Error('Failed to create article')
        }
      
        setMessage(`Well done, ${localStorage.getItem('username')}. Great article!`)
        setTimeout(()=> {
          getArticles()
        }, 4000)
        
      }catch(error){
        setMessage(error.message)
      }
      setSpinnerOn(false)
    }

    

  const updateArticle = async ({ article_id, article }) => {
    
      setSpinnerOn(true)

      try{
        const token= localStorage.getItem('token')
        const response = await fetch(`${articlesUrl}/${article_id}`, {
          method: 'PUT',
          headers: {Authorization: token, 'Content-Type': 'application/json'},
         
          body: JSON.stringify(article)
         
        })
        if(!response.ok){
          throw new Error('Failed to update article')
        }
         await response.json()
        const username = localStorage.getItem('username')
        setMessage(`Nice update, ${username}!`)
        setTimeout(() =>{
          getArticles()
        }, 4000)
        
      
      }catch(error){
        setMessage(error.message)
      }
      setSpinnerOn(false)


  }

  const deleteArticle = async article_id => {
      setSpinnerOn(true)
      try{
        const token = localStorage.getItem('token')
        const response = await fetch(`${articlesUrl}/${article_id}`,{
          method: 'DELETE',
          headers:{Authorization: token}
        })
        if(!response.ok){
          throw new Error('Failed to delete article')
        }
       
        setMessage(`Article ${article_id} was deleted, ${localStorage.getItem('username')}!`)
        setTimeout(() => {
       
         getArticles(); }, 4000 )
      }catch(error){
        setMessage(error.message)
      }
      setSpinnerOn(false)
    
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
     {message && <Message message={message} />}
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
         {amILoggedIn ? (<NavLink id="articlesScreen" to="/">Articles</NavLink>) : (<NavLink id="articlesScreen" to="/articles">Articles</NavLink>)}
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm    updateArticle={updateArticle}   postArticle={postArticle}  setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} articles={articles} />
              <Articles  CurrentArticleId={currentArticleId} articles={articles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId} getArticles={getArticles} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}