// src/styles/modalStyles.js

export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 652 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    // p: 4,    
    borderRadius: 2,
    maxHeight: '98vh',
    overflowY: 'auto',
     backgroundColor:"#fffae7"
};


export const StyleForPayslip = {
    width:'50%',
    mt: 2,
    backgroundColor: "#E4D3B5",  // Beige-like background
    padding: "8px 12px",
    display: "inline-block",
    fontWeight: "bold",
    fontSize: "16px",
    borderRadius: "4px",
    borderTopLeftRadius: "0px",
    borderBottomLeftRadius: "0px",
    borderTopRightRadius: "0px",
    borderBottomRightRadius: "10px",
    clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)',
};


export const StyleEmpInfo = {
    my:2,
    padding:'10px 30px',
    width: "calc(75% + 159px)"
};
