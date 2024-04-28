import React from "react"
import {useNavigate, useParams, useLocation} from "react-router-dom"
import mainIcon from "../Assets/mainIcon.png"
import { fetchCombinedRecommendations } from '../Requests/api'

export default function InformationView() {
    const {id} = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    
    const numOfPeople = location.state?.numOfPeople
    const isLastPerson = parseInt(id) === parseInt(numOfPeople)
    const timeAvailable = location.state?.timeAvailable
    const dataCollected = location.state?.dataCollected || []
 
    // State
    const [formData, setFormData] = React.useState({
        favoriteMovie: "",
        movieEra: "",
        mood: "",
        favoriteActor: "",
    })
    const [formError, setFormError] = React.useState("")
    const [focusedButtons, setFocusedButtons] = React.useState({ mood: null, movieEra: null })
    const [isLoading, setIsLoading] = React.useState(false)



    // Handle Change Function
    function handleChangeTextArea(event) {
        const {name, value} = event.target
        setFormData(prevFormData => ({...prevFormData, [name]: value}))
        setFormError("")
    }
    
    function handleChangeButton(name, value) {
        setFormData(prevFormData => ({...prevFormData,[name]: value}))
        setFormError("")
    }
    
    function toggleFocus(category, value) {
        setFocusedButtons(prevState => ({
            ...prevState,
            [category]: prevState[category] === value ? null : value
        }))
    }    
    
    // Form Completion Function
    function allFieldsFilled() {
        return formData.favoriteMovie && formData.movieEra && formData.mood && formData.favoriteActor;
    }
    
    
    // Form Submit Function
    const handleSubmit = async (event) => {
        event.preventDefault()
        
        if (!allFieldsFilled()) {
            setFormError("All fields are required!")
            return
        }
        
        
        const updatedDataCollected = [...dataCollected, { id, formData }]

        if (isLastPerson) {
            setIsLoading(true)
            fetchCombinedRecommendations(updatedDataCollected).then((data) => {         
                navigate("/movie", { state: { 
                    apiResponse: { title: data.titles, details: data.details }, isLoading: true }, 
                })
            }).catch(console.error);
        } else {
            const nextPerson = parseInt(id) + 1;
            navigate(`/info/${nextPerson}`, 
            { state: { numOfPeople, timeAvailable, dataCollected: updatedDataCollected } });
        }
        
        setFormData({
            favoriteMovie: "",
            movieEra: "",
            mood: "",
            favoriteActor: "",
        })
        
        setFocusedButtons({mood: null, movieEra: null })
    }
    
    
    return (
        <div className="container">
        
        {isLoading ? (
            <div className="loading-message"> Loading, please wait...</div>) : (
        <>
        <div className="header-pane">
            <img src={mainIcon} />
            <h1 className="person-number"> {id} </h1>
        </div>
        
        
        <form className="content-pane" onSubmit={handleSubmit}>
            <label> What’s your favorite movie and why? </label>
            <textarea
                value={formData.favoriteMovie}
                onChange={handleChangeTextArea}
                name="favoriteMovie"
            />
            
            <label> Are you in the mood for something new or a classic? </label>
            <br />
            <button className={`movie-era-btn 
                    ${focusedButtons.movieEra === "New" ? "focused" : ""}`}
                type="button"
                onClick={() => {
                    handleChangeButton("movieEra", "New")
                    toggleFocus("movieEra", "New")}}>
            New </button>
            <button className={`movie-era-btn 
                    ${focusedButtons.movieEra === "Classic" ? "focused" : ""}`}
                type="button"
                onClick={() => 
                    {handleChangeButton("movieEra", "Classic")
                    toggleFocus("movieEra", "Classic")}}>
            Classic </button>
            <br />
            
            <label> What are you in the mood for? </label>
            <br />
            <button className={`mood-btn 
                    ${focusedButtons.mood === "Fun" ? "focused" : ""}`}
                type="button"
                onClick={() => {
                    handleChangeButton("mood", "Fun")
                    toggleFocus("mood", "Fun")}}> 
            Fun </button>
            <button className={`mood-btn 
                    ${focusedButtons.mood === "Serious" ? "focused" : ""}`}
                type="button"
                onClick={() => {
                    handleChangeButton("mood", "Serious")
                    toggleFocus("mood", "Serious")}}> 
            Serious </button>
            <button className={`mood-btn 
                    ${focusedButtons.mood === "Inspiring" ? "focused" : ""}`}
                type="button"
                onClick={() => {
                    handleChangeButton("mood", "Inspiring")
                    toggleFocus("mood", "Inspiring")}}> 
            Inspiring </button>
            <button className={`mood-btn 
                    ${focusedButtons.mood === "Scary" ? "focused" : ""}`}
                type="button"
                onClick={() => {
                    handleChangeButton("mood", "Scary")
                    toggleFocus("mood", "Scary")}}> 
            Scary </button>
            <br />
            
            <label> 
                Which famous film person would you love to be stranded on an island with and why    
            </label>
            <textarea
                value={formData.favoriteActor}
                onChange={handleChangeTextArea}
                name="favoriteActor"
            />
            
            <button type="submit" className="submit-btn">
                {isLastPerson ? "Get Movie" : "Next Person"}
            </button>
            {formError && <p className="error-message">{formError}</p>}        
        </form>
        </>)}
        </div>
    )
}
  
