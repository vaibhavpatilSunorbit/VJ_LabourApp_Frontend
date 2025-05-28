import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Chip,
  Box,
  Avatar
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';
import { API_BASE_URL } from '../Data';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/getnotification`);
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDelete = (siteName) => {
    setNotifications(notifications.filter(n => n.currentSiteName !== siteName));
  };

  const pendingNotifications = notifications.filter(n => n.PendingCount > 0);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Pending Site Transfer Requests
      </Typography>

      {pendingNotifications.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No pending site transfer requests.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: 2,
            mt: 2,
          }}
        >
          <List>
            {pendingNotifications.map((notif, index) => (
              <React.Fragment key={index}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDelete(notif.currentSiteName)}>
                      <Delete />
                    </IconButton>
                  }
                  sx={{ backgroundColor: '#fff8e1' }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: '#ff9800' }}>
                      {notif.currentSiteName?.charAt(0) || 'S'}
                    </Avatar>
                  </ListItemIcon>

                  <ListItemText
                    primary={notif.currentSiteName}
                    secondary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="textSecondary">
                          Pending site transfer requests
                        </Typography>
                        <Chip size="small" color="warning" label={`Count: ${notif.PendingCount}`} />
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
};

export default NotificationPage;
