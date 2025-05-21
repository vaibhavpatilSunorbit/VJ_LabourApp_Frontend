import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material';

const breadcrumbNameMap = {
  '/': 'Home',
  '/application': 'Application',
  '/application/kyc': 'KYC',
  '/application/personal': 'Personal Details',
  '/application/bankDetails': 'Bank Details',
  '/application/project': 'Project',
  '/add-user': 'Add User',
  '/labour-details': 'Labour Details',
  '/project-machine': 'Project Machine',
  '/attendance-report': 'Attendance Report',
  '/wages-report': 'Wages Report',
  '/admin-approval': 'Admin Approval',
  '/site-transfer': 'Site Transfer',
  '/variable-input': 'Variable Input',
  '/run-payroll': 'Run Payroll',
  '/view-payroll': 'View Payroll',
  // add more routes as needed
};

const BreadcrumbsNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, mt: 2 }}>
      <Link to="/">Home</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1);

        return isLast ? (
          <Typography color="text.primary" key={to}>
            {name}
          </Typography>
        ) : (
          <Link key={to} to={to} style={{ textDecoration: 'none', color: 'blue' }}>
            {name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;
