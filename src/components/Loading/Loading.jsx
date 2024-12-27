import React from 'react';
import './Loading.css'; 

const Loading = () => (
  <div className="loader-container">
    <div className="loader"></div>
    {/* <div className="loading-text">Loading...</div> */}
  </div>
);

export default Loading;


// import React, { useEffect, useState } from 'react';
// import Lottie from 'lottie-react';

// const Loading = () => {
//     const [animationData, setAnimationData] = useState(null);

//     useEffect(() => {
//         // Fetch animation JSON dynamically from the public folder
//         const fetchAnimationData = async () => {
//             try {
//                 const response = await fetch('/calender.json'); // Public folder URL
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch animation data');
//                 }
//                 const data = await response.json();
//                 setAnimationData(data);
//             } catch (error) {
//                 console.error('Error loading animation:', error);
//             }
//         };

//         fetchAnimationData();
//     }, []);

//     if (!animationData) {
//         // Fallback while animation data is loading
//         return <p>Loading...</p>;
//     }

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <Lottie animationData={animationData} loop autoplay style={{ height: 200, width: 200 }} />
//         </div>
//     );
// };

// export default Loading;