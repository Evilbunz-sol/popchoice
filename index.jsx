import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom"
import StartView from "./Components/StartView"
import InformationView from "./Components/InformationView"
import Reccomendations from "./Components/Reccomendations"

function App() {
    return (
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<StartView />} />
              <Route path="/info/:id" element={<InformationView />} />
              <Route path="/movie" element={<Reccomendations />} />
            </Routes>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)