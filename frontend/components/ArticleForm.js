import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' } 
export default function ArticleForm({postArticle, updateArticle, setCurrentArticleId, currentArticleId, articles }) {
  const [values, setValues] = useState(initialFormValues)
  

  
  // ✨ where are my props? Destructure them here

  useEffect(() => {
    if(currentArticleId){

      const foundArticle = articles.find(article => article.article_id === currentArticleId)
      if(foundArticle){
      

      setValues({
        article_id:foundArticle.article_id,
        title: foundArticle.title,
        text: foundArticle.text,
        topic: foundArticle.topic
      
      })
    }
     
    }else{
      setValues(initialFormValues)
      
    }

  }, [currentArticleId])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()

    if(currentArticleId){
      updateArticle({article_id: values.article_id, article: values})
      console.log(values)
    }else{
      postArticle(values)
    }
    setCurrentArticleId(null)
    
  } 

  const isDisabled = () => {

    return !values.title || !values.text || !values.topic
   
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticleId ? 'Edit': 'Create'} Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle"> {currentArticleId ? 'Submit': 'Create'}</button>
       {currentArticleId && <button onClick={ () => setCurrentArticleId(null)}>Cancel edit</button>}
      </div>
    </form>
  )
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
