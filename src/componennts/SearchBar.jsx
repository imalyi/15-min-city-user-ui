import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import addresses from "../data/addresses.json"

import "../styles/SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    const results = addresses.filter((address) => {
      console.log(address.address)
      return (
        value &&
        address &&
        address.address.toLowerCase().includes(value.toLowerCase())
      );
    });
    console.log(results)
    setResults(results);
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};