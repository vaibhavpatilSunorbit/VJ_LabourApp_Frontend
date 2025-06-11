import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress, 
  Alert,
  Paper,
  Chip,
  Stack,
  IconButton,
  Divider,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';

// Simulated API data
const mockTickets = [
  {
    id: 1,
    name: 'Customer Test',
    email: 'sujit.solav@sunorbit.in',
    phone: '7058233110',
    department: 'IT Support',
    category: 'Login Issue',
    subcategory: 'Password Reset',
    priority: 'High',
    description: 'Unable to reset password using the forgot password link.',
    status: 'Open',
    createdAt: '2025-06-10T14:30:00'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    department: 'Customer Support',
    category: 'Bug Report',
    subcategory: 'UI Issue',
    priority: 'Medium',
    description: 'The dashboard is misaligned on smaller screens.',
    status: 'In Progress',
    createdAt: '2025-06-09T09:15:00'
  },
  {
    id: 3,
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    phone: '9998887770',
    department: 'Billing',
    category: 'Payment Issue',
    subcategory: 'Refund Request',
    priority: 'Low',
    description: 'Requested a refund but no update yet.',
    status: 'Open',
    createdAt: '2025-06-08T11:00:00'
  },
  {
    id: 4,
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    phone: '8765432190',
    department: 'IT Support',
    category: 'Feature Request',
    subcategory: 'Dark Mode',
    priority: 'Low',
    description: 'Please add dark mode to the dashboard.',
    status: 'Closed',
    createdAt: '2025-06-07T10:00:00'
  },
  {
    id: 5,
    name: 'Nina Patel',
    email: 'nina.patel@example.com',
    phone: '9001234567',
    department: 'Customer Support',
    category: 'Login Issue',
    subcategory: '2FA Not Working',
    priority: 'High',
    description: 'Two-factor authentication fails on login.',
    status: 'Open',
    createdAt: '2025-06-06T08:45:00'
  },
  {
    id: 6,
    name: 'Ravi Kumar',
    email: 'ravi.k@example.com',
    phone: '9812312312',
    department: 'Engineering',
    category: 'Bug Report',
    subcategory: 'Backend Error',
    priority: 'High',
    description: '500 error on POST /tickets.',
    status: 'In Progress',
    createdAt: '2025-06-05T13:30:00'
  },
  {
    id: 7,
    name: 'Leena Thomas',
    email: 'leena.t@example.com',
    phone: '9123456780',
    department: 'Marketing',
    category: 'Other',
    subcategory: 'Feedback',
    priority: 'Medium',
    description: 'Great service, but the app is slow.',
    status: 'Closed',
    createdAt: '2025-06-04T15:15:00'
  },
  {
    id: 8,
    name: 'Arun Mehta',
    email: 'arun.m@example.com',
    phone: '9345678901',
    department: 'Engineering',
    category: 'Bug Report',
    subcategory: 'Memory Leak',
    priority: 'High',
    description: 'Memory usage spikes after login.',
    status: 'Open',
    createdAt: '2025-06-03T14:00:00'
  },
  {
    id: 9,
    name: 'Sara Khan',
    email: 'sara.k@example.com',
    phone: '9345612345',
    department: 'HR',
    category: 'Account Issue',
    subcategory: 'Email not updating',
    priority: 'Medium',
    description: 'Can\'t change email address.',
    status: 'Open',
    createdAt: '2025-06-02T11:30:00'
  },
  {
    id: 10,
    name: 'Tom Hanks',
    email: 'tom.h@example.com',
    phone: '9012345678',
    department: 'Customer Support',
    category: 'Payment Issue',
    subcategory: 'Double charge',
    priority: 'High',
    description: 'Charged twice for same service.',
    status: 'In Progress',
    createdAt: '2025-06-01T10:00:00'
  },
  {
    id: 11,
    name: 'Aditi Rao',
    email: 'aditi.r@example.com',
    phone: '9823456712',
    department: 'Billing',
    category: 'Payment Issue',
    subcategory: 'Invoice not received',
    priority: 'Low',
    description: 'Haven\'t received invoice for May.',
    status: 'Open',
    createdAt: '2025-05-31T14:45:00'
  },
  {
    id: 12,
    name: 'Dev Joshi',
    email: 'dev.j@example.com',
    phone: '9876501234',
    department: 'Engineering',
    category: 'Feature Request',
    subcategory: 'Live Chat',
    priority: 'Medium',
    description: 'Please add live chat support.',
    status: 'Open',
    createdAt: '2025-05-30T12:20:00'
  },
  {
    id: 13,
    name: 'Pooja Shah',
    email: 'pooja.s@example.com',
    phone: '9811122233',
    department: 'Support',
    category: 'Bug Report',
    subcategory: 'App Crash',
    priority: 'High',
    description: 'App crashes on Android 13.',
    status: 'In Progress',
    createdAt: '2025-05-29T08:10:00'
  },
  {
    id: 14,
    name: 'Raj Malhotra',
    email: 'raj.m@example.com',
    phone: '9100112233',
    department: 'IT Support',
    category: 'Login Issue',
    subcategory: 'Account Locked',
    priority: 'High',
    description: 'My account is locked after multiple failed attempts.',
    status: 'Resolved',
    createdAt: '2025-05-28T11:50:00'
  },
  {
    id: 15,
    name: 'Neha Verma',
    email: 'neha.v@example.com',
    phone: '9356789012',
    department: 'Customer Support',
    category: 'Other',
    subcategory: 'Compliment',
    priority: 'Low',
    description: 'App UI is really good!',
    status: 'Closed',
    createdAt: '2025-05-27T10:40:00'
  },
  {
    id: 16,
    name: 'Jay Patel',
    email: 'jay.p@example.com',
    phone: '9008765432',
    department: 'Engineering',
    category: 'Bug Report',
    subcategory: 'API Failure',
    priority: 'High',
    description: 'API gives 401 on valid token.',
    status: 'Open',
    createdAt: '2025-05-26T15:30:00'
  },
  {
    id: 17,
    name: 'Meena Das',
    email: 'meena.d@example.com',
    phone: '9933445566',
    department: 'HR',
    category: 'Feature Request',
    subcategory: 'Export to Excel',
    priority: 'Medium',
    description: 'Export feature would be helpful.',
    status: 'Open',
    createdAt: '2025-05-25T13:00:00'
  },
  {
    id: 18,
    name: 'Siddharth Roy',
    email: 'sid.r@example.com',
    phone: '9887766554',
    department: 'IT Support',
    category: 'Login Issue',
    subcategory: 'Invalid Credentials',
    priority: 'High',
    description: 'Login not working despite correct credentials.',
    status: 'In Progress',
    createdAt: '2025-05-24T09:30:00'
  },
  {
    id: 19,
    name: 'Priya Kapoor',
    email: 'priya.k@example.com',
    phone: '9001234321',
    department: 'Billing',
    category: 'Account Issue',
    subcategory: 'Update Profile',
    priority: 'Low',
    description: 'Unable to update profile details.',
    status: 'Open',
    createdAt: '2025-05-23T08:45:00'
  },
  {
    id: 20,
    name: 'Ankit Sharma',
    email: 'ankit.s@example.com',
    phone: '9087654321',
    department: 'Engineering',
    category: 'Bug Report',
    subcategory: 'UI Lag',
    priority: 'Medium',
    description: 'Lag when switching between tabs.',
    status: 'Open',
    createdAt: '2025-05-22T10:00:00'
  }
];

// Priority and Status color mappings
const priorityColors = {
  High: 'error',
  Medium: 'warning',
  Low: 'success'
};

const statusColors = {
  Open: 'primary',
  'In Progress': 'warning',
  Resolved: 'success',
  Closed: 'default'
};

// Individual Ticket Card Component
const TicketCard = ({ ticket, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 2,
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          elevation: 3,
          borderColor: '#1976d2',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
        }
      }}
      onClick={() => onClick(ticket)}
    >
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: '#1976d2',
              width: 40,
              height: 40,
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            {getInitials(ticket.name)}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="600" color="text.primary">
              #{ticket.id} - {ticket.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ticket.category} • {ticket.subcategory}
            </Typography>
          </Box>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={ticket.priority}
            color={priorityColors[ticket.priority]}
            size="small"
            variant="outlined"
          />
          <Chip
            label={ticket.status}
            color={statusColors[ticket.status]}
            size="small"
          />
        </Stack>
      </Stack>

      {/* Contact Information */}
      <Stack direction="row" spacing={3} mb={2} flexWrap="wrap">
        <Stack direction="row" spacing={1} alignItems="center">
          <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {ticket.email}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {ticket.phone}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {ticket.department}
          </Typography>
        </Stack>
      </Stack>

      {/* Description */}
      <Typography 
        variant="body2" 
        color="text.primary" 
        sx={{ 
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.5
        }}
      >
        {ticket.description}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Footer */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Created: {formatDate(ticket.createdAt)}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1}>
                   <Tooltip title="View Details">
            <IconButton size="small" color="primary">
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Ticket">
            <IconButton size="small" color="secondary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
};

const AllTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate API call
  useEffect(() => {
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTicketClick = (ticket) => {
    console.log('Opening ticket:', ticket);
    // Add navigation logic here
    alert(`Opening ticket #${ticket.id} - ${ticket.name}`);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fafafa'
      }}
    >
      {/* Fixed Header */}
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 0,
          bgcolor: 'white',
          borderBottom: '2px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="600" color="text.primary" gutterBottom>
                All Support Tickets
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and track all customer support requests
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6" color="primary.main" fontWeight="600">
                {tickets.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tickets
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Paper>

      {/* Scrollable Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f5f5f5',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#bdbdbd',
            borderRadius: '4px',
            '&:hover': {
              background: '#9e9e9e',
            },
          },
        }}
      >
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {loading ? (
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              minHeight="400px"
            >
              <Stack alignItems="center" spacing={2}>
                <CircularProgress size={40} />
                <Typography variant="body1" color="text.secondary">
                  Loading tickets...
                </Typography>
              </Stack>
            </Box>
          ) : tickets.length === 0 ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <Alert 
                severity="info" 
                sx={{ 
                  maxWidth: 400,
                  '& .MuiAlert-message': {
                    textAlign: 'center',
                    width: '100%'
                  }
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No tickets found
                </Typography>
                <Typography variant="body2">
                  There are currently no support tickets to display.
                </Typography>
              </Alert>
            </Box>
          ) : (
            <Box>
              {/* Summary Stats */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  bgcolor: 'white'
                }}
              >
                <Stack direction="row" spacing={4} justifyContent="center">
                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight="600" color="error.main">
                      {tickets.filter(t => t.status === 'Open').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Open
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight="600" color="warning.main">
                      {tickets.filter(t => t.status === 'In Progress').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      In Progress
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight="600" color="success.main">
                      {tickets.filter(t => t.status === 'Resolved').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Resolved
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight="600" color="text.secondary">
                      {tickets.filter(t => t.status === 'Closed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Closed
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Tickets List */}
              <Box>
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={handleTicketClick}
                  />
                ))}
              </Box>

              {/* Bottom Spacing */}
              <Box sx={{ height: '20px' }} />
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default AllTicketsPage;

