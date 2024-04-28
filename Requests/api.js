export async function fetchCombinedRecommendations(updatedDataCollected) {    
    const embedding = await fetchEmbeddings(updatedDataCollected) 
    const supabaseData = await fetchSemanticSearch(embedding)
    
    const messages = [
        {
            role: 'system',
            content: "You are a movie critic providing movie recommendations. You will provide 5 unique movies to watch. For each recommendation, include 2 sections without any symbols,the first section is called 'Title:' with the movie's name, and second section is called 'Details:' with a brief explanation of why each movie is recommended incorporating user information given (maximum 40 words)."
        },
        ]
        
        updatedDataCollected.forEach((data, index) => {
            messages.push({
                role: 'user',
                content: `Hi I am Person #${index + 1} ${JSON.stringify(data.formData)}`,
            })
        })
        messages.push({
            role: 'user',
            content: `Additional data from Supabase: ${supabaseData}`,
        })
      

    const openaiResponse = await fetchRequest(messages)
    return {
        titles: openaiResponse.titles, // Correct variable name
        details: openaiResponse.details, // Correct variable name
    }
}


// Fetch embeddings from the Cloudflare worker
export async function fetchEmbeddings(data) {
    const url = "https://popchoice-api-worker.jameel-altamash.workers.dev/embeddings";
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data.map((item) => JSON.stringify(item))),
    }
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Error fetching embeddings: ${response.statusText}`);
        }

        const embedding = await response.json();
        return embedding
    } catch (err) {
        console.error("Error fetching embeddings:", err.message);
        throw err;
    }
}



// Fetch semantic search from the Cloudflare worker
export async function fetchSemanticSearch(embedding) {
    const url = "https://popchoice-api-worker.jameel-altamash.workers.dev/semanticsearch";
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ embedding }), // Ensure correct format
    }

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Error fetching semantic search: ${response.statusText}`);
        }
        
        const resultText = await response.text()
        const match = JSON.parse(resultText)
        return match;
        
    } catch (err) {
        console.error("Error fetching semantic search:", err.message);
        throw err;
    }
}


// Fetch movie reccomendations from Openai from the Cloudflare worker
export async function fetchRequest(messages) {
    const url = "https://popchoice-api-worker.jameel-altamash.workers.dev/openai";
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const openAIResponse = await response.json();
        const content = openAIResponse.content || "";

        const lines = content.split("\n"); // Split by newline to parse titles and details

        // Identify and extract the lines that contain 'Title' and 'Details'
        const titleLines = lines.filter((line) => line.includes("Title:"));
        const detailLines = lines.filter((line) => line.includes("Details:"));

        // Extract the title and details by cleaning the strings
        const titles = titleLines.map((line) => line.replace("Title:", "").trim());
        const details = detailLines.map((line) => line.replace("Details:", "").trim());

        return { titles, details }; // Correct variable names

        
    } catch (err) {
        console.error('Error fetching data:', err.message);
        throw err;
    }
}

// Fetch movie details from TMDb based on movie titles
export async function fetchTMDBRequest(movieTitle) {
    const url = `https://popchoice-api-worker.jameel-altamash.workers.dev/tmdb?title=${encodeURIComponent(movieTitle)}`;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error('Error fetching TMDB data:', err.message);
        throw err;
    }
}