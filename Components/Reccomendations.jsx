import React from "react"
import { useLocation, useNavigate} from "react-router-dom"
import { fetchTMDBRequest } from '../Requests/api'


export default function Reccomendations() {
    const navigate = useNavigate()
    const location = useLocation()
    const apiResponse = location.state?.apiResponse
    const isLoading = location.state?.isLoading || false
 
    //State
    const [movieDetails, setMovieDetails] = React.useState({})
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [loading, setLoading] = React.useState(isLoading)
    const [error, setError] = React.useState(null)
    
    //const Title, Details, Index
    const currentMovie = movieDetails[currentIndex]
    const currentDetail = apiResponse?.details[currentIndex]

    
    React.useEffect(() => {
        if (apiResponse.title) {
            const fetchMovies = async() => {
                try {
                    const promises = apiResponse.title.map((title) => fetchTMDBRequest(title))
                    const results = await Promise.all(promises)
                    setMovieDetails(results.map((res) => res.results?.[0] || {}))
                    setLoading(false)
                } catch(err) {
                    console.error("Error fetching movie details:", err)
                    setError(err.message)
                    setLoading(false)     
                }
            }
            fetchMovies()
        }
    }, [apiResponse?.titles])
    
    
    function handleSubmit() {
        if (currentIndex < movieDetails.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1)
        } else {
            navigate("/")
        }
    }
    
    
    if (loading) {
    return <div className="loading-message">Loading, please wait...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }
    
    return (
        <div className="container">
        {currentMovie.title ? (
            
        <>
        <div className="header-pane">
            <h1 className="person-number"> {currentMovie.title} </h1>
        </div>
        
        {currentMovie.poster_path && (
        <img className="movie-img"
            src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
            alt={currentMovie.title}
        />)}
        
        <p className="movie-detials">{currentDetail}</p>
        
        <button className="submit-btn" onClick={handleSubmit}> 
            {currentIndex < movieDetails.length - 1 ? "Next Movie" : "Go Again"}
        </button>
        </>) : (
            
            <div>No movie details available.</div>
        )}
        </div>
    )
}