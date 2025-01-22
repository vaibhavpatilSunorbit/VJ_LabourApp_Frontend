
import React from 'react';
import { TextField, Button } from '@mui/material';
import './SearchBar.css';

const SearchWages = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchResults = [],
  setSearchResults,
  handleSelectLabour,
  showResults 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(e);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <TextField
          className="search-input"
          label="Search By Name, Labour ID, Department Name, Pay Structure or pay Add By"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim() === '') {
              setSearchResults([]); // Clear search results if input is empty
            }
          }}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" className="search-button">
          Search
        </Button>
      </form>

      {showResults && searchResults && searchResults.length > 0 && (
        <div className="search-results">
          <ul>
            {searchResults.map((result) => (
              <li key={result.id}>
                {result.LabourID} - {result.name} - {result.companyName} - {result.payAddedBy} - {result.departmentName} - {result.PayStructure}
                <button onClick={() => handleSelectLabour(result)}>Select</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchWages;
