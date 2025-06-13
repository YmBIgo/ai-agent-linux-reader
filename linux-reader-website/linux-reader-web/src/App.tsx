import { Route, Routes, useNavigate } from "react-router"
import Top from "./pages/Top"
import Register from "./pages/Register"
import SearchResult from "./pages/SearchResult"
import JsonResult from "./pages/JsonResult"
import { useEffect, useRef } from "react"

function App() {
  const navigate = useNavigate();
  const isFirst = useRef<boolean>(false)
  useEffect(() => {
    if (isFirst.current) return;
    navigate("/linux-reader/")
    isFirst.current = true;
  }, [navigate])
  return (
    <Routes>
      <Route path="/linux-reader/" element={<Top/>}></Route>
      <Route path="/linux-reader/register" element={<Register/>}></Route>
      <Route path="/linux-reader/searchResult" element={<SearchResult/>}></Route>
      <Route path="/linux-reader/jsonResult" element={<JsonResult/>}></Route>
    </Routes>
  )
}

export default App
