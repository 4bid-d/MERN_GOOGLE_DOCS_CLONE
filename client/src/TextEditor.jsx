import React, { useCallback ,useEffect } from 'react'
import Quill from "quill"    
import {io } from "socket.io-client"
import "quill/dist/quill.snow.css"
import { useState } from 'react'
import { useParams } from "react-router-dom"

const  TOOLBAR_OPTIONS  =   [
    [ { header:[ 1, 2, 3, 4, 5, 6, false ] }],
    [ { font:[] } ],
    [ { list: "ordered" },{list:"bullet"} ],
    [ "bold" , "italic" , "underline" ],
    [ { color:[] } , { background:[] } ],
    [ { script:"sub" }, { script:"super" } ],
    [ { align:[] } ],
    [ "image" , "blockquote" , "code-block" ],
    ["clean"]
]

function TextEditor() {
    const [socket, setSocket] = useState()
    const [quill, setQuill ] = useState()
    const {id : documentId} = useParams()
    
    useEffect(() => {   setSocket()
        const s =  io("http://localhost:3001")
        setSocket(s)
    
      return () => {
        s.disconnect()
      }
    }, [])

    useEffect(() => {
        if (socket == null || quill == null) return 
       const handler = delta=>{
        quill.updateContents(delta) 
    }
      socket.on("recieve-changes",handler)
      
      return () => {
        socket.off("text-change",handler)
      }
    }, [socket ,quill])

    useEffect(() => {
        if (socket == null || quill == null) return 
        socket.once("load-document",document=>{
            quill.enable()
            quill.setcontents(document)
        })
        socket.emit("get-document",documentId)
      return () => {
       
      }
    }, [socket ,quill,documentId])

    useEffect(() => {
        if (socket == null || quill == null) return 
       const handler = (delta , oldDelta , source )=>{
        if (source !== "user") return
        socket.emit("send-change",delta) 
    }
      quill.on("text-change",handler)
      
      return () => {
        quill.off("text-change",handler)
      }
    }, [socket ,quill])
    
    const wrapperRef = useCallback(wrapper  => {
    wrapper.innerHtml = ""
    const editer = document.createElement("div")
    wrapper.append(editer)
    let q = new Quill(editer,{ 
      theme:"snow" ,
      modules:{
        toolbar:TOOLBAR_OPTIONS
      }
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
    }, [])
    
    return <div className='container' ref={wrapperRef}></div>
}

export default TextEditor