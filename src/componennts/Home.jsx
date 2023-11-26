import React, {useState} from 'react';
import Footer from './Footer';
import '../styles/Home.css';
import { SearchBar } from "./SearchBar";
import { SearchResultsList } from "./SearchResultsList";

function Home() {
  const [results, setResults] = useState([]);
  const aboutInfo = 'Information from About Component';

  return (
    <div>
      <div className="search-bar-container">
      <SearchBar setResults={setResults} />
      {results && results.length > 0 && <SearchResultsList results={results} />}
      </div>
      <Footer additionalInfo={aboutInfo} />
    </div>
  );
}

export default Home;

