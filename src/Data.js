import { UilUniversity, UilUserPlus, UilFileAlt } from '@iconscout/react-unicons';

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
    roles: ["admin", "user"],
  },
  {
    icon: UilFileAlt,
    heading: "Add User",
    path: "addUser",
    roles: ["admin"],
  },
  {
    icon: UilFileAlt,
    heading: "Apprved Labours",
    path: "approveLabours",
    roles: ["admin"],
  },
];

