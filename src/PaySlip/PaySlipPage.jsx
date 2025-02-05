import React, { useState, useEffect } from 'react';
import './paySlipPage.css'; // Import the CSS file

const Payslip = () => {
  const [data, setData] = useState({
    employeeCode: '1000027',
    name: 'Mayur Patil',
    designation: 'Junior Software Developer',
    department: 'IT',
    pan: '3434343434',
    uan: '4343434344',
    accountNo: '4143434344',
    ifscCode: 'uid4945845',
    dateOfJoining: '24/04/2024',
    payableDays: 31,
    leaveBalance: 21,
    regimeOpted: 'New Regime',
    grossPay: 30000,
    deductions: 1800,
    netPay: 28200,
    earnings: {
      basic: 15000,
      hra: 7500,
      specialAllowance: 4500,
      leaveTravelAllowance: 3000,
    },
    deductionsData: {
      pfEmployeeContribution: 1800,
    },
    yearlyTaxableIncome: {
      basic: 149834,
      hra: 74917,
      specialAllowance: 44950,
      leaveTravelAllowance: 29966,
    },
    annualTaxableSalary: 299667,
    standardDeductions: 75000,
    netTaxableIncome: 224667,
  });

  return (
    <div className="payslip-container">
      <header>
        <h1>SunOrbit</h1>
        <p>Payslip: Dec 2024</p>
      </header>

      <div className="payslip-details">
        {/* Display flex for Net Pay, Gross Pay, and Deductions */}
        <div className="pay-summary">
          <div className="pay-item">
            <p className="pay-label">Net Pay</p>
            <p className="pay-value">{data.netPay}</p>
          </div>
          <div className="pay-item">
            <p className="pay-label">=</p>
          </div>
          <div className="pay-item">
            <p className="pay-label">Gross Pay (A)</p>
            <p className="pay-value">{data.grossPay}</p>
          </div>
          <div className="pay-item">
            <p className="pay-label">+</p>
          </div>
          <div className="pay-item">
            <p className="pay-label">Deductions (B)</p>
            <p className="pay-value">{data.deductions}</p>
          </div>
          <div className="pay-item">
            <p className="pay-label">-</p>
          </div>
        </div>
      </div>

      <div className="payslip-details">
        <div className="employee-info">
          <p className="employee-information">Employee Code <ul>{data.employeeCode}</ul></p>
          <p className="employee-information">Name <ul>{data.name}</ul></p>
          <p className="employee-information">Designation <ul>{data.designation}</ul></p>
          <p className="employee-information">Department <ul>{data.department}</ul></p>
          <p className="employee-information">PAN <ul>{data.pan}</ul></p>
          <p className="employee-information">UAN <ul>{data.uan}</ul></p>
          <p className="employee-information">Account No <ul>{data.accountNo}</ul></p>
          <p className="employee-information">IFSC Code <ul>{data.ifscCode}</ul></p>
          <p className="employee-information">Date of Joining <ul>{data.dateOfJoining}</ul></p>
          <p className="employee-information">Payable Days <ul>{data.payableDays}</ul></p>
          <p className="employee-information">Leave Balance <ul>{data.leaveBalance}</ul></p>
          <p className="employee-information">Regime Opted <ul>{data.regimeOpted}</ul></p>
        </div>
        <div className="earnings">
          <h2>Gross Pay (A)</h2>
          <p>Total Earnings {data.grossPay}</p>
          <div className="earnings-details">
            <p>Basic {data.earnings.basic}</p>
            <p>House Rent Allowance {data.earnings.hra}</p>
            <p>Special Allowance {data.earnings.specialAllowance}</p>
            <p>Leave & Travel Allowance {data.earnings.leaveTravelAllowance}</p>
          </div>
        </div>
        <div className="deductions">
          <h2>Deductions (B)</h2>
          <p>Total Deductions {data.deductions}</p>
          <div className="deductions-details">
            <p>PF Employee Contribution {data.deductionsData.pfEmployeeContribution}</p>
          </div>
        </div>
        <div className="net-pay">
          <p>Net Pay: {data.netPay}</p>
        </div>
        <div className="yearly-taxable-income">
          <h2>Yearly Taxable Income (C)</h2>
          <div className="income-details">
            <p>Basic {data.yearlyTaxableIncome.basic}</p>
            <p>HRA {data.yearlyTaxableIncome.hra}</p>
            <p>Special Allowance {data.yearlyTaxableIncome.specialAllowance}</p>
            <p>Leave & Travel Allowance {data.yearlyTaxableIncome.leaveTravelAllowance}</p>
          </div>
          <p>Annual Taxable Salary: {data.annualTaxableSalary}</p>
        </div>
        <div className="net-taxable-income">
          <h2>Net Taxable Income (E)</h2>
          <p>Annual Taxable Salary {data.annualTaxableSalary}</p>
          <p>Standard Deductions {data.standardDeductions}</p>
          <p>Net Taxable Income {data.netTaxableIncome}</p>
        </div>
      </div>
    </div>
  );
};

export default Payslip;
