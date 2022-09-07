import TextEditor from "./TextEditor";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import { v4 as uuidV4} from "uuid"
import "./style.css"
  function App() {
    return (
        <>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Navigate to={`/documents/${uuidV4()}`}/>} />            
            <Route exact path="/documents/:id" element={ <TextEditor/>} />
          </Routes>
        </BrowserRouter>
        </>
    );
  }

  export default App;
