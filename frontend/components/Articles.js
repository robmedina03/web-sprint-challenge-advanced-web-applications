import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PT from 'prop-types'


export default function Articles({getArticles, articles,setCurrentArticleId,deleteArticle,currentArticleId}) {
  const [editingArticle, seteditingArticle] = useState(null)

  
 
  useEffect(() => {
   getArticles()
  }, [])

  if(!localStorage.getItem('token')){
    return <Navigate to= "/" />
  }
  
  const handleEditClick = (article) => {
    
    
    if(currentArticleId=== article.article_id){
     
      setCurrentArticleId(null)
    }else {  
    setCurrentArticleId(article.article_id)
  }
};

  return (
    // ✨ fix the JSX: replace `Function.prototype` with actual functions
    // and use the articles prop to generate articles

    
    <div className="articles">
    <h2>Articles</h2>
    
    {
      articles.length === 0
        ? ('No articles yet')
        : (articles.map((art) => (
          
            <div className="article" key={art.article_id}>
              <div>
                <h3>{art.title}</h3>
                <p>{art.text}</p>
                <p>Topic: {art.topic}</p>
              </div>
                <div>
                  <button disabled={art.article_id === currentArticleId}  onClick={() => handleEditClick(art)} >{art.article_id === currentArticleId ? 'Cancel Edit' : 'Edit'}</button>
                  <button disabled={art.article_id === currentArticleId} onClick={() => deleteArticle(art.article_id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        
    </div>
  );
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
