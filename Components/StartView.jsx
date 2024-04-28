import React from "react"
import {useNavigate} from "react-router-dom"
import mainIcon from "../Assets/mainIcon.png"

export default function StartView() {
    const navigate = useNavigate()
    
    // State
    const [numOfPeople, setNumOfPeople] = React.useState("")
    const [timeAvailable, setTimeAvailable] = React.useState("")
    const [errorMessage, setErrorMessage] = React.useState("")
    
    
    function handleChange(event) {
        const {name, value} = event.target
        if (name === "numOfPeople") {
            setNumOfPeople(value)
        } else if (name === "timeAvailable") {
            setTimeAvailable(value)
        }
    }
    
    function handleSubmit(event) {
        event.preventDefault()
        if (!numOfPeople || !timeAvailable) {
            setErrorMessage("Fill in all the information!");
            return;
        }
        navigate(`/info/1`, { state: { numOfPeople, timeAvailable } })
    }
    
    
    return (
        <div className="container">
        <div className="header-pane">
            <img src={mainIcon} />
            <h1> PopChoice </h1>
        </div>
        
        <form className="content-pane" onSubmit={handleSubmit}>
            <input
                type="number"
                min="1"
                max="3"
                name= "numOfPeople"
                value={numOfPeople}
                onChange={handleChange}
                placeholder="How many people? (Max 3)"
            />
            <input 
                type="text"
                name="timeAvailable"
                value={timeAvailable}
                onChange={handleChange}
                placeholder="How much time do you have?"
            />
            <button className="submit-btn"> Start </button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
        
        </div>
    )
}
