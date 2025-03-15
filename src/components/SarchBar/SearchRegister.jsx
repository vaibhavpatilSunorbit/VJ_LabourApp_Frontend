
// import React from 'react';
// import { TextField, Button } from '@mui/material';
// // import './salaryRegister.css';
// import './SearchBar.css';

// const SearchRegister = ({
//   searchQuery,
//   setSearchQuery,
//   handleSearch,
//   searchResults = [],
//   setSearchResults,
//   handleSelectLabour,
//   showResults 
// }) => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleSearch(e);
//   };

//   return (
//     <div className="search-bar">
//       <form onSubmit={handleSubmit} className="search-form">
//         <TextField
//           className="search-input"
//           label="Search By Name.."
//           variant="outlined"
//           value={searchQuery}
//           onChange={(e) => {
//             setSearchQuery(e.target.value);
//             if (e.target.value.trim() === '') {
//               setSearchResults([]); // Clear search results if input is empty
//             }
//           }}
//           fullWidth
//           margin="normal"
//         />
//         <Button type="submit" variant="contained" color="primary" className="search-button">
//           Search
//         </Button>
//       </form>

//       {showResults && searchResults && searchResults.length > 0 && (
//         <div className="search-results">
//           <ul>
//             {searchResults.map((result) => (
//               <li key={result.id}>
//                 {result.LabourID} - {result.name} - {result.companyName} - {result.payAddedBy} - {result.departmentName} - {result.PayStructure}
//                 <button onClick={() => handleSelectLabour(result)}>Select</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchRegister;







import React from 'react';
import './salaryRegister.css';

const SearchRegister = ({
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
    <div className="search-register">
      <form onSubmit={handleSubmit} role="search" className="search-register__form">
        <label htmlFor="search" className="search-register__label">Search for stuff</label>
        <input
          id="search"
          type="search"
          placeholder="Search By Name, Labour ID.."
          value={searchQuery}
          autoFocus
          required
          className="search-register__input"
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim() === '') {
              setSearchResults([]); // Clear search results if input is empty
            }
          }}
        />
        <button type="submit" className="search-register__button">Go</button>
      </form>

      {showResults && searchResults.length > 0 && (
        <div className="search-register__results">
          <ul className="search-register__results-list">
            {searchResults.map((result) => (
              <li key={result.id} className="search-register__result-item">
                <span className="search-register__result-info">
                  {result.LabourID} - {result.name} - {result.aadhaarNumber} - {result.OnboardName} - {result.workingHours}- {result.companyName} - {result.payAddedBy} - {result.departmentName} - {result.PayStructure}
                </span>
                <button 
                  onClick={() => handleSelectLabour(result)} 
                  className="search-register__select-button"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchRegister;

