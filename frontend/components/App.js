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
     
      
      
    


 
  const navigate = useNavigate()
  const redirectToLogin = () =>  navigate('/') 
  const redirectToArticles = () =>  navigate('/articles');

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setMessage('Goodbye!')
      navigate('/')
  

    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login =  ({ username, password }) => {
     setSpinnerOn(true)
     fetch(loginUrl, {
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({username: username.trim(), password: password.trim()})
          })
          .then((response) => {
            if(!response.ok){
              throw new Error('Invalid username or password')
            }
            return response.json();

          })
          .then(data => {
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', username.trim())
          setMessage(`Here are your articles, ${username.trim()}!`)
           redirectToArticles()

          })
          .catch((error) => 
            setMessage(error.message))
            .finally(() => 
              setSpinnerOn(false))

          
  }

  const getArticles = () => {
    setSpinnerOn(true)
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    fetch(articlesUrl,{ headers:{Authorization:token}})
          .then((response) => {
            if(!response.ok){
              if(response.status === 401){
                throw new Error('Token Expired, please log in again')
              
              }
              throw new Error('Failed to fetch articles')
            }
            return response.json()
          })
          .then(data => {
            setArticles(data.articles)
            setMessage(`Here are your articles, ${username}!`)
          
            
          })
          .catch(error => {
            setMessage(error.message)
            if(error.message === 'Token Expired, please log in again'){
                redirectToLogin()
            }
       
          })
          .finally(() =>{
            setSpinnerOn(false)
          })
      }

   
  

  const postArticle =  (article) => {
      setSpinnerOn(true)
    
        const token= localStorage.getItem('token')
        
        fetch(articlesUrl, {
          method: 'POST',
          headers:{Authorization: token, 'Content-Type': 'application/json'},
          body: JSON.stringify(article)
        })
        .then((response) =>{
          if(!response.ok){
            throw new Error('Failed to create article')
          }
          return response.json()
        })
        .then(() => {
          setMessage(`Well done, ${localStorage.getItem('username')}. Great article!`)
            getArticles()
        })
        .catch(error => 
          setMessage(error.message))
          .finally(() =>
            setSpinnerOn(false))
      }


    

  const updateArticle =  ({ article_id, article }) => {
    
      setSpinnerOn(true)
        const token= localStorage.getItem('token')
        fetch(`${articlesUrl}/${article_id}`, {
          method: 'PUT',
          headers: {Authorization: token, 'Content-Type': 'application/json'},
         
          body: JSON.stringify(article)
         
        })
        .then((response) => {
          if(!response.ok){
            throw new Error('Failed to update article')
          }
          return response.json()

        })
        .then(() => {
          const username = localStorage.getItem('username')
        setMessage(`Nice update, ${username}!`)
        getArticles()

        })

        .catch(error => 
          setMessage(error.message))
          .finally(() => 
            setSpinnerOn(false))
  }

  const deleteArticle =  (article_id) => {
      setSpinnerOn(true)
    
        const token = localStorage.getItem('token')
        fetch(`${articlesUrl}/${article_id}`,{
          method: 'DELETE',
          headers:{Authorization: token}
        })
        .then(response => {
          if(!response.ok){
            throw new Error('Failed to delete article')
          }
          return response.json()

        })
        .then(() => {
          setMessage(`Article ${article_id} was deleted, ${localStorage.getItem('username')}!`)
         getArticles()

        })
        .catch(error => 
          setMessage(error.message))
          .finally(() => 
            setSpinnerOn(false))
      
      }

      useEffect(() => {
        if(localStorage.getItem('token')){
          getArticles()
        }
      }, [])
      
    
  

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
         {localStorage.getItem('token') ? (<NavLink id="articlesScreen" to="/articles">Articles</NavLink>) : (<NavLink id="articlesScreen" to="/articles">Articles</NavLink>)}
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login= {login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm   updateArticle={updateArticle}   postArticle={postArticle}  setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} articles={articles}  />
              <Articles  currentArticleId={currentArticleId} articles={articles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId} getArticles={getArticles} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}