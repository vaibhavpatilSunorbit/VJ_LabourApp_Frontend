// import React from 'react';
// import { TextField, Button } from '@mui/material';
// import './SearchBar.css';

// const SearchBar = ({
//   searchQuery,
//   setSearchQuery,
//   handleSearch,
//   searchResults,
//   setSearchResults,
//   handleSelectLabour
// }) => {
//   const isMuiAvailable = TextField && Button;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleSearch(e);
//   };

//   return (
//     <div className="search-bar">
//       {isMuiAvailable ? (
//         <form onSubmit={handleSubmit} className="search-form">
//           <TextField
//             className="search-input"
//             label="Search Labours"
//             variant="outlined"
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               if (e.target.value.trim() === '') {
//                 setSearchResults([]);
//               }
//             }}
//             fullWidth
//             margin="normal"
//           />
//           <Button type="submit" variant="contained" color="primary" className="search-button">
//             Search
//           </Button>
//         </form>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Search by Aadhaar number or Name"
//             label="Search by Aadhaar number or Name"
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               if (e.target.value.trim() === '') {
//                 setSearchResults([]);
//               }
//             }}
//           />
//           <button type="submit" id="searchbutton">Search</button>
//         </form>
//       )}

//       {searchResults.length > 0 && (
//         <div className="search-results">
//           <ul>
//             {searchResults.map((result) => (
//               <li key={result.id}>
//                 {result.name} - {result.aadhaarNumber}
//                 <button onClick={() => handleSelectLabour(result)}>Select</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;












// import React from 'react';
// import { TextField, Button } from '@mui/material';
// import './SearchBar.css';

// const SearchBar = ({
//   searchQuery,
//   setSearchQuery,
//   handleSearch,
//   searchResults = [], // Initialize searchResults with an empty array
//   setSearchResults,
//   handleSelectLabour
// }) => {
//   const isMuiAvailable = TextField && Button;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleSearch(e);
//   };

//   return (
//     <div className="search-bar">
//       {isMuiAvailable ? (
//         <form onSubmit={handleSubmit} className="search-form">
//           <TextField
//             className="search-input"
//             label="Search Labours"
//             variant="outlined"
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               if (e.target.value.trim() === '') {
//                 setSearchResults([]);
//               }
//             }}
//             fullWidth
//             margin="normal"
//           />
//           <Button type="submit" variant="contained" color="primary" className="search-button">
//           Search
//           </Button>
//         </form>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Search by Aadhaar number or Name"
//             label="Search by Aadhaar number or Name"
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               if (e.target.value.trim() === '') {
//                 setSearchResults([]);
//               }
//             }}
//           />
//           <button type="submit" id="searchbutton">Search</button>
//         </form>
//       )}

//       {searchResults && searchResults.length > 0 && ( 
//         <div className="search-results">
//           <ul>
//             {searchResults.map((result) => (
//               <li key={result.id}>
//                 {result.name} - {result.aadhaarNumber}
//                 <button onClick={() => handleSelectLabour(result)}>Select</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchBar;









import React from 'react';
import { TextField, Button } from '@mui/material';
import './SearchBar.css';

const SearchBar = ({
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
          label="Search Labours"
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
                {result.LabourID} - {result.name} - {result.aadhaarNumber} - {result.OnboardName}
                <button onClick={() => handleSelectLabour(result)}>Select</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
