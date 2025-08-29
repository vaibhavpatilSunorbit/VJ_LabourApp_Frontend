import React from 'react';
import {
  TableRow,
  TableCell,
  Button,
  Box,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InfoIcon from '@mui/icons-material/Info';

const LabourTableRow = ({
  labour,
  index,
  page,
  rowsPerPage,
  tabValue,
  user,
  statuses,
  statusesSite,
  approvedLabours,
  approvingLabours,
  submittedLabourIds,
  selectedSite,
  projectNames,
  getProjectDescription,
  getDepartmentDescription,
  handleDownloadPDF,
  handleEditLabourOpen,
  handleResubmit,
  handleEdit,
  handleApproveConfirmOpen,
  setSelectedLabour,
  setIsRejectPopupOpen,
  openPopup,
  handleSiteChange,
}) => (
  <TableRow key={labour.id}>
    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
    {tabValue !== 0 && tabValue !== 2 && <TableCell>{labour.LabourID}</TableCell>}
    <TableCell>{labour.name}</TableCell>
    <TableCell>{getProjectDescription(labour.projectName)}</TableCell>
    <TableCell>{getDepartmentDescription(labour.department)}</TableCell>
    {(tabValue === 0 || tabValue === 1 || tabValue === 2) && (
      <TableCell>{labour.OnboardName}</TableCell>
    )}
    <TableCell>
      <Box
        sx={{
          position: 'relative',
          padding: '7px 16px',
          borderRadius: '20px',
          display: 'inline-block',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          ...(labour.status === 'Pending' && {
            backgroundColor: '#EFE6F7',
            color: '#8236BC',
          }),
          ...(labour.status === 'Approved' && {
            backgroundColor: '#E5FFE1',
            color: '#54a36d',
          }),
          ...(labour.status === 'Rejected' && {
            backgroundColor: 'rgba(255, 105, 97, 0.3)',
            color: '#F44336',
          }),
          ...(labour.status === 'Resubmitted' && {
            backgroundColor: 'rgba(255, 223, 186, 0.3)',
            color: '#FF6F00',
          }),
          ...(labour.status === 'Disable' && {
            backgroundColor: 'rgb(245, 237, 237)',
            color: '#5e636e',
          }),
        }}
      >
        {labour.status}
        {labour.status === 'Pending' && labour.LabourID && (
          <Box
            sx={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#ed4b4b', fontSize: 12 }}>●</span>
          </Box>
        )}
      </Box>
    </TableCell>
    {tabValue === 1 && (
      <>
        <TableCell>
          {statuses[labour.LabourID]?.esslStatus || statuses[labour.id]?.esslStatus ? (
            <span style={{ color: 'green' }}>✔</span>
          ) : (
            <span style={{ color: 'red' }}>✘</span>
          )}
        </TableCell>
      </>
    )}
    {tabValue === 0 && (
      <TableCell>
        {labour.CreationDate ? new Date(labour.CreationDate).toLocaleDateString('en-GB') : '-'}
      </TableCell>
    )}
    {tabValue === 1 && (
      <>
        <TableCell>
          {labour.ApproveLabourDate ? new Date(labour.ApproveLabourDate).toLocaleDateString('en-GB') : '-'}
        </TableCell>
        <TableCell>
          {labour.EditLabourDate ? new Date(labour.EditLabourDate).toLocaleDateString('en-GB') : '-'}
        </TableCell>
      </>
    )}
    {tabValue === 2 && (
      <>
        <TableCell>
          {labour.RejectLabourDate ? new Date(labour.RejectLabourDate).toLocaleDateString('en-GB') : '-'}
        </TableCell>
        <TableCell>
          {labour.ResubmitLabourDate ? new Date(labour.ResubmitLabourDate).toLocaleDateString('en-GB') : '-'}
        </TableCell>
        <TableCell>
          <Box display="flex" justifyContent="center" alignItems="center">
            <InfoIcon onClick={() => {
              setSelectedLabour(labour);
              setIsRejectPopupOpen(true);
            }} style={{ cursor: 'pointer' }} />
          </Box>
        </TableCell>
        <TableCell>
          {statuses[labour.LabourID]?.disabledAttendanceCreatedAt
            ? statuses[labour.LabourID].disabledAttendanceCreatedAt.toLocaleDateString()
            : '-'}
        </TableCell>
      </>
    )}
    {tabValue === 1 && (
      <TableCell>
        <Box display="flex" justifyContent="center" alignItems="center">
          <PictureAsPdfIcon onClick={() => handleDownloadPDF(labour.id)} style={{ cursor: 'pointer' }} />
        </Box>
      </TableCell>
    )}
    {tabValue === 1 && (
      <TableCell>
        {(user.userType === 'user' && labour.status === 'Approved' && !labour.address) && (
          <Button variant="contained" onClick={() => handleEditLabourOpen(labour)}>Edit</Button>
        )}
        {((user.userType === 'admin' || user.userType === 'superadmin') && labour.status === 'Approved' && !labour.address) && (
          <Button variant="contained" onClick={() => handleEditLabourOpen(labour)}>Edit</Button>
        )}
      </TableCell>
    )}
    {user.userType === 'user' && (
      <TableCell>
        <div key={labour.id}>
          {((labour.status === 'Rejected' && labour.isApproved !== 1) || labour.status === 'Resubmitted' || labour.status === 'Disable') && (
            <Box display="flex" alignItems="center">
              {labour.status !== 'Pending' && labour.hideResubmit !== true && !submittedLabourIds.includes(labour.id) && (
                <Button variant="contained" onClick={() => handleResubmit(labour)}>Resubmit</Button>
              )}
            </Box>
          )}
        </div>
        {labour.status === 'Approved' && (
          <Button variant="contained" onClick={() => handleEdit(labour)}>Update</Button>
        )}
      </TableCell>
    )}
    {(user.userType === 'admin' || user.userType === 'superadmin') && (
      <TableCell>
        {labour.status === 'Pending' && !approvedLabours.includes(labour.id) && !approvingLabours.includes(labour.id) && (
          <>
            <Button variant="contained" onClick={() => handleApproveConfirmOpen(labour)}>Approve</Button>
            <Button variant="contained" color="error" onClick={() => {
              setSelectedLabour(labour);
              setIsRejectPopupOpen(true);
            }}>Reject</Button>
          </>
        )}
        {labour.status === 'Approved' && (
          <Button variant="contained" onClick={() => handleEdit(labour)}>Update</Button>
        )}
        <div key={labour.id}>
          {((labour.status === 'Rejected' && labour.isApproved !== 1) || labour.status === 'Resubmitted' || labour.status === 'Disable') && (
            <Box display="flex" alignItems="center">
              {labour.status !== 'Pending' && labour.hideResubmit !== true && !submittedLabourIds.includes(labour.id) && (
                <Button variant="contained" onClick={() => handleResubmit(labour)}>Resubmit</Button>
              )}
            </Box>
          )}
        </div>
      </TableCell>
    )}
    <TableCell>
      <RemoveRedEyeIcon onClick={() => openPopup(labour)} style={{ cursor: 'pointer' }} />
    </TableCell>
    {user.userType === 'admin' && tabValue !== 0 && tabValue !== 2 && tabValue !== 1 && (
      <>
        <TableCell>
          <Select
            value={selectedSite[labour.LabourID] || ''}
            onChange={(e) => handleSiteChange(labour, e.target.value)}
            displayEmpty
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="" disabled>Select New Site</MenuItem>
            {projectNames.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.Business_Unit}
              </MenuItem>
            ))}
          </Select>
        </TableCell>
        <TableCell>{statusesSite[labour.LabourID] || '-'}</TableCell>
      </>
    )}
  </TableRow>
);

export default LabourTableRow;