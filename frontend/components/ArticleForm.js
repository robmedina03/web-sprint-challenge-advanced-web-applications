import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' } 
export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  const [isSubmitedDisabled, setIsSubmitDisabled] = useState(true)

  const {currentArticleId,articles,updateArticle,setCurrentArticleId,postArticle} = props
  
  
  

  
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

  useEffect(() => {
    setIsSubmitDisabled(true)
  },[])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
    const isDisabled = !values.title || !values.text || !values.topic
    setIsSubmitDisabled(isDisabled)
  }

  const onSubmit = evt => {
    evt.preventDefault()

    if(currentArticleId){
      updateArticle({article_id: values.article_id, article: values})
      
    }else{
      postArticle(values)
    }
    setCurrentArticleId(null)

    setValues(initialFormValues)

    setIsSubmitDisabled(true)
    
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
        <button disabled={isSubmitedDisabled} id="submitArticle"> {currentArticleId ? 'Submit': 'Submit'}</button>
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
