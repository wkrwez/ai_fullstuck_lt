import { useState, useRef, useEffect } from 'react'
import LanguageSelector from './components/LanguageSelector'
import Progress from './components/Progress'

import './App.css'

function App() {
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);
  const [ready, setReady] = useState(false)

  const worker = useRef(null)

  const translate = () => {
    setDisabled(true)
    // console.log(targetLanguage)
    // return;
    worker.current.postMessage({
      text: input,
      src_lang:sourceLanguage,
      tgt_lang:targetLanguage
    })
  }

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }
    const onMessageReceived = (e) => {
      // console.log(e);
      switch(e.data.status) {
        case 'initiate':
          setReady(false);
          setProgressItems(prev => [...prev, e.data]);
          break;
        case 'progress':
          console.log(e.data, '////')
          
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return {
                  ...item,
                  progress: e.data.progress
                }
              }
              return item;
            }) 
          )
          break;
        case 'done':
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          )
          break;
        case 'ready':
          setReady(true)
          break;
        case 'update':
          setOutput(e.data.output)
          break;
        case 'complete':
          setDisabled(false);
          break;
      }
    }

    worker.current.addEventListener('message', onMessageReceived);     
    

    return () => worker.current.removeEventListener('message', 
    onMessageReceived)
  })

  return (
    <>
      <h1>Transformers.js</h1>
      <h2>ML-powered multiligual translation in React！</h2>
      <div className="container">
        <LanguageSelector 
        type="Source" 
        defaultLanguage="eng_Latn"
        onChange={x => setSourceLanguage(x.target.value)}/>
        <LanguageSelector 
        type="Target" 
        defaultLanguage="fra_Latn"
        onChange={x => setTargetLanguage(x.target.value)}/>
      </div>
      <div className="textbox-container">
        <textarea value={input} rows={3} 
        onChange={e => setInput(e.target.value)}></textarea>
        <textarea value={output} rows={3} 
        readOnly></textarea>
      </div>
      <button disabled={disabled} onClick={translate}>Translate</button>
      <Progress text="下载中" percentage={20}/>

      <div className="progress-bars-container">
        {
          ready == false && (
            <label>Loading Models ...(only run once)</label>
          )
        }
        {
          progressItems.map(data => (
            <div key={data.file}>
              <Progress text={data.file} percentage={data.progress} />
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App
