import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Box,
  Button
} from '@mui/material';

const priorityColors = {
  Low: 'success',
  Medium: 'warning',
  High: 'error'
};

const TicketCard = ({
  name,
  email,
  phone,
  department,
  category,
  subcategory,
  priority,
  description,
  status,
  createdAt,
  onClick
}) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">{category} - {subcategory}</Typography>
          <Chip label={priority} color={priorityColors[priority] || 'default'} />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Stack spacing={0.5}>
          <Typography variant="body2">
            <strong>Name:</strong> {name}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {email}
          </Typography>
          <Typography variant="body2">
            <strong>Phone:</strong> {phone}
          </Typography>
          <Typography variant="body2">
            <strong>Department:</strong> {department}
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {status}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Created: {new Date(createdAt).toLocaleString()}
          </Typography>
        </Stack>

        {onClick && (
          <Box mt={2} textAlign="right">
            <Button onClick={onClick} size="small" variant="outlined">
              View Details
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketCard;
