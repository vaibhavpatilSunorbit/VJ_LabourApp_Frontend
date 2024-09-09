import { UilUniversity, UilUserPlus, UilFileAlt } from '@iconscout/react-unicons';




// export const API_BASE_URL = "https://laboursandbox.vjerp.com";
export const API_BASE_URL = "http://localhost:4000";
// export const API_BASE_URL = "https://vjlabour.vjerp.com";


export const accessPages = [
  "Bank Balance",
  "Add User",
  "Statement",
  "Transaction",
  "Hold/Release",
  "Release Approval",
];



// Data.js
export const SidebarData = [
  {
    icon: UilUniversity,
    heading: "Application",
    roles: ["admin", "user"],
    subLinks: [
      {
        heading: "KYC",
        path: "kyc",
        roles: ["admin", "user"],
      },
      {
        heading: "Personal",
        path: "personal",
        roles: ["admin", "user"],
      },
      {
        heading: "Bank Details",
        path: "bankDetails",
        roles: ["admin", "user"],
      },
      {
        heading: "Project",
        path: "project",
        roles: ["admin", "user"],
      },
    ],
  },
  {
    icon: UilUserPlus,
    heading: "Labour Details",
    path: "labourDetails",
    roles: ["admin"],
  },
  {
    icon: UilFileAlt,
    heading: "Add User",
    path: "addUser",
    roles: ["admin"],
  },
  {
    icon: UilFileAlt,
    // heading: "Approved Labours",
    heading: "Project Machine",
    path: "approveLabours",
    roles: ["admin"],
  },
];







export const INDUCTED_BY_OPTIONS = [
  "Dhiraj Dindikar Meshram",
  "Sandip Adhikrav Chavan",
  "Omkar Mahadev Kadam",
  "Mahesh Madhukar Kate",
  "Akshay Jaysing Shedge",
  "Mangesh Ashok Pardhi",
  "Gouspak Salim Patel",
  "Aishwarya Tatyaso Shinde",
  "Rahul Krushnarao Deshmukh",
  "Chirantan Deoram Somwanshi",
  "Harshal Vijay Ahire",
  "Santosh Sadashiv Patil",
  "Aniket Shivaji Pardhi",
  "Athar S Shaikh",
  "Satish Shivaji Lande",
  "Sanket Ravindra Hule",
  "Tushar Rajesh Kamble",
  "Vrushabh Sanjay Kagnole",
  "Sachin Mahadu Papal"
];




// export const INDUCTED_BY_OPTIONS = [
// "DHIRAJ DINDIKAR MESHRAM",
// "SANDIP ADHIKRAV CHAVAN",
// "OMKAR MAHADEV KADAM",
// "MAHESH MADHUKAR KATE",
// "AKSHAY JAYSING SHEDGE",
// "MANGESH ASHOK PARDHI",
// "GOUSPAK SALIM PATEL",
// "AISHWARYA TATYASO SHINDE",
// "RAHUL KRUSHNARAO DESHMUKH",
// "CHIRANTAN DEORAM SOMWANSHI",
// "HARSHAL VIJAY AHIRE",
// "SANTOSH SADASHIV PATIL",
// "ANIKET SHIVAJI PARDHI",
// "ATHAR S SHAIKH",
// "SATISH SHIVAJI LANDE",
// "SANKET RAVINDRA HULE",
// "TUSHAR RAJESH KAMBLE",
// "VRUSHABH SANJAY KAGNOLE",
// "SACHIN MAHADU PAPAL",
// ];