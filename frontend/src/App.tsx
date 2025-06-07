import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// Defines a type for our API response, helping with type safety and autocompletion
interface ApiResponse {
  message : string;
}

// Defines a shape for our component state, allows us to track loading, data, and error states
interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiErrorResponse {
  detail: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const testApiUrl = `${API_BASE_URL}/api/test`;

axios.get(testApiUrl)
  .then(response => {
    console.log('API Response:', response.data);
  });

function App() {
  //State Management
  //Initialize state with default values, and expect ApiResponse type for data
  const [apiData, setApiData] = useState<FetchState<ApiResponse>>({
    data: null,
    isLoading: true, // Initializes in loading state
    error: null,
  });
  
  // Data Fetching 
  useEffect(() => {
    //env var for API urls to work in both dev and prod 
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/test`;

    const fetchData = async () => {
      try{
        // Set loading state to true before request
        setApiData(prevState => ({ ...prevState, isLoading: true, error: null}));
        
        const response = await axios.get<ApiResponse>(apiUrl);

        // Update state with fetched data
        setApiData(prevState => ({ ...prevState, data: response.data}))
      
      } catch (err) {
        // check if error is an axios error so it can show specific details 
        let errorMessage = "An unknown error occcured";
        //tells TS what shape the error is expected to be
        if (axios.isAxiosError<ApiErrorResponse>(err)) {
          //Check if the response and data exist before trying to access detail
          if(err.response?.data?.detail){
            errorMessage = err.response.data.detail
          }else {
            errorMessage = err.message; // Fallback to generic message
          }
        }
        console.error("Error fetching data:", errorMessage);
        // Update state with error message so UI can display
        setApiData(prevState => ({ ...prevState, error: errorMessage, data: null}));
    } finally{
      // Ensure isLoading is set to false whether the request succeeds or fails so no infinite loading
      setApiData(prevState => ({ ...prevState, isLoading: false}));
    }
  };

  fetchData();
  }, []); // Empty dependency array so it runs only once when component first added to screen. Without it would run after every render, infinite loop of API calls. 
  
  // Conditional Rendering for different states
  const renderContent = () => {
    //Handle loading state
    if (apiData.isLoading){
      return <p><i>Loading from backend...</i></p>;
    }

    //Handle error state
    if (apiData.error) {
      return <p style={{color: 'red'}}>Error: {apiData.error}</p>;
    }
    // Success case: display the data 
    if (apiData.data){
      return <p><i>{apiData.data.message}</i></p>;
    }
    // Fallback if no data, loading, or error
    return <p>No data available</p>;
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <h2>Message from Backend:</h2>
        {/* We call our rendering function here */}
        {renderContent()}
      </div>
    </>
  );
}

 
export default App
