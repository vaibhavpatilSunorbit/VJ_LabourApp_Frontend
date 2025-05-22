import React, { useState, useEffect } from 'react';
import { BsFillBellFill, BsPersonCircle, BsJustify } from 'react-icons/bs';
import { GrLogout } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useUser } from '../../UserContext/UserContext';
import { API_BASE_URL } from '../../Data';
import axios from 'axios';

// Define notification type colors
const notificationColors = {
  siteTransfer: '#1976d2', // blue
  warning: '#ff9800',      // orange
  error: '#f44336',        // red
  success: '#4caf50',      // green
  info: '#2196f3',         // light blue
  attendanceApproval: '#9c27b0', // purple
  default: '#9e9e9e'       // grey
};

function Header({ OpenSidebar }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const isMobile = window.innerWidth <= 768;
  
  const spanStyle = {
    marginTop: '2px',
    fontSize: isMobile ? '14px' : '14px',
    color: '#000',
  };
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [siteTransferNotifications, setSiteTransferNotifications] = useState([]);
  const [attendanceNotifications, setAttendanceNotifications] = useState([]);
  const [otherNotifications, setOtherNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  
  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;
  
  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch site transfer notifications
  const fetchSiteTransferNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/getnotification`);
      if (response.data.success) {
        const notifications = response.data.data.map(notif => ({
          id: `site-${notif.currentSiteName}`,
          type: 'siteTransfer',
          title: notif.currentSiteName,
          message: `Pending site transfer requests: ${notif.PendingCount}`,
          siteName: notif.currentSiteName,
          pendingCount: notif.PendingCount,
          isRead: notif.PendingCount === 0,
          timestamp: new Date().toISOString()
        }));
        setSiteTransferNotifications(notifications);
      }
    } catch (error) {
      console.error('Failed to fetch site transfer notifications:', error);
    }
  };

  // Fetch attendance approval notifications
  const fetchAttendanceNotifications = async () => {
    try {
      // You may need to update this endpoint to the correct one for attendance notifications
      const response = await axios.get(`${API_BASE_URL}/attendance/getPendingApprovals`);
      if (response.data.success) {
        const notifications = response.data.data.map(notif => {
          // Create a notification object from attendance data
          return {
            id: `attendance-${notif.AttendanceId || Math.random()}`,
            type: 'attendanceApproval',
            title: 'Attendance Approval',
            // Include all relevant fields
            AttendanceId: notif.AttendanceId,
            LabourId: notif.LabourId,
            FirstPunchManually: notif.FirstPunchManually,
            LastPunchManually: notif.LastPunchManually,
            RemarkManually: notif.RemarkManually,
            // Generate message
            message: generateAttendanceMessage(notif),
            isRead: false,
            timestamp: notif.timestamp || new Date().toISOString()
          };
        });
        
        console.log('Attendance notifications:', notifications);
        setAttendanceNotifications(notifications);
      }
    } catch (error) {
      console.error('Failed to fetch attendance notifications:', error);
      // For testing, create some sample attendance notifications
      const sampleAttendanceNotifications = [
        {
          id: 'attendance-sample-1',
          type: 'attendanceApproval',
          title: 'Attendance Approval',
          AttendanceId: 1191908,
          LabourId: 'L12345',
          FirstPunchManually: '11:01:18',
          LastPunchManually: '21:48:48',
          RemarkManually: 'Technical Error',
          isRead: false,
          timestamp: new Date().toISOString()
        },
        {
          id: 'attendance-sample-2',
          type: 'attendanceApproval',
          title: 'Attendance Approval',
          AttendanceId: 1191909,
          LabourId: 'L67890',
          FirstPunchManually: '09:30:00',
          LastPunchManually: '18:45:22',
          RemarkManually: 'Forgot to punch',
          isRead: false,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      
      // Add sample notifications for testing
      setAttendanceNotifications(sampleAttendanceNotifications);
    }
  };

  // Generate message specifically for attendance notifications
  const generateAttendanceMessage = (notif) => {
    const labourInfo = notif.LabourId ? ` for Labour ID: ${notif.LabourId}` : '';
    const timeInfo = notif.FirstPunchManually && notif.LastPunchManually 
      ? ` (${notif.FirstPunchManually} - ${notif.LastPunchManually})`
      : '';
    const remarkInfo = notif.RemarkManually 
      ? ` - ${notif.RemarkManually}`
      : '';
    
    return `Attendance approval required${labourInfo}${timeInfo}${remarkInfo}`;
  };

  // Generate appropriate message based on notification type
  const generateMessage = (notification) => {
    // If notification already has a message, use it
    if (notification.message) return notification.message;
    
    // For attendance approval notifications
    if (notification.type === 'attendanceApproval') {
      return generateAttendanceMessage(notification);
    }
    
    // For other notification types
    switch(notification.type) {
      case 'warning':
        return `Warning: ${notification.title || 'Action required'}`;
      case 'error':
        return `Error: ${notification.title || 'Something went wrong'}`;
      case 'success':
        return `Success: ${notification.title || 'Operation completed'}`;
      case 'info':
        return `Info: ${notification.title || 'For your information'}`;
      default:
        return notification.title || 'New notification';
    }
  };

  // Fetch all other notifications
  const fetchOtherNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/getAllNotification`);
      if (response.data.success) {
        // Process all notifications to ensure they have proper messages
        const processedNotifications = response.data.data
          .filter(notif => notif.type !== 'siteTransfer' && notif.type !== 'attendanceApproval')
          .map(notif => {
            // Create a processed notification with all the original data
            const processedNotif = { ...notif };
            
            // Ensure we have a message for each notification
            if (!processedNotif.message) {
              processedNotif.message = generateMessage(processedNotif);
            }
            
            // Ensure we have a timestamp
            if (!processedNotif.timestamp) {
              processedNotif.timestamp = new Date().toISOString();
            }
            
            // Set isRead property if not provided
            if (processedNotif.isRead === undefined) {
              processedNotif.isRead = false;
            }
            
            return processedNotif;
          });
        
        setOtherNotifications(processedNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch other notifications:', error);
    }
  };

  // Calculate total unread count
  useEffect(() => {
    const siteTransferUnread = siteTransferNotifications.filter(notif => !notif.isRead).length;
    const attendanceUnread = attendanceNotifications.filter(notif => !notif.isRead).length;
    const otherUnread = otherNotifications.filter(notif => !notif.isRead).length;
    
    setUnreadCount(siteTransferUnread + attendanceUnread + otherUnread);
  }, [siteTransferNotifications, attendanceNotifications, otherNotifications]);

  // Fetch notifications when popover opens
  useEffect(() => {
    if (open) {
      fetchSiteTransferNotifications();
      fetchAttendanceNotifications(); // Separate fetch for attendance notifications
      fetchOtherNotifications();
    }
  }, [open]);

  const handleNotificationClick = (notif) => {
    // Navigate based on notification type
    switch(notif.type) {
      case 'siteTransfer':
        navigate('/adminApproval/siteTransferApproval');
        break;
      case 'attendanceApproval':
        navigate('/adminApproval/adminAttendanceApproval');
        break;
      case 'warning':
      case 'error':
      case 'info':
      case 'success':
        navigate(`/notifications/${notif.id}`);
        break;
      default:
        navigate('/notifications');
    }
    handlePopoverClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Get avatar color based on notification type
  const getAvatarColor = (type) => {
    return notificationColors[type] || notificationColors.default;
  };

  // Get avatar letter based on notification type
  const getAvatarLetter = (notif) => {
    if (notif.type === 'siteTransfer') {
      return notif.siteName?.charAt(0) || 'S';
    }
    
    switch(notif.type) {
      case 'attendanceApproval': return 'A';
      case 'warning': return 'W';
      case 'error': return 'E';
      case 'success': return 'S';
      case 'info': return 'I';
      default: return 'N';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day ago`;
    
    return date.toLocaleDateString();
  };

  // Render notification list
  const renderNotificationList = (notifications, emptyMessage) => {
    if (!notifications || notifications.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='body1' color='textSecondary'>
            {emptyMessage}
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ p: 0 }}>
        {notifications.map((notif, index) => (
          <React.Fragment key={notif.id || index}>
            <ListItem
              button
              onClick={() => handleNotificationClick(notif)}
              sx={{
                p: 2,
                backgroundColor: notif.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', width: '100%' }}>
                <Avatar
                  sx={{
                    mr: 2,
                    bgcolor: getAvatarColor(notif.type),
                    width: 40,
                    height: 40,
                  }}
                >
                  {getAvatarLetter(notif)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant='subtitle2'
                    sx={{
                      fontWeight: notif.isRead ? 400 : 600,
                      color: '#333',
                    }}
                  >
                    {notif.title || (
                      notif.type === 'attendanceApproval' 
                        ? 'Attendance Approval' 
                        : notif.type === 'siteTransfer'
                          ? 'Site Transfer'
                          : 'Notification'
                    )}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    {notif.message || generateMessage(notif)}
                  </Typography>
                  <Typography
                    variant='caption'
                    color='textSecondary'
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    {formatTimestamp(notif.timestamp)}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
            <Divider component='li' />
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <header className='header' style={{ position: 'relative' }}>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
      <div className='header-left'></div>
      <div
        className='header-right headericon'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Badge wrapped around bell icon */}
          <Badge
            badgeContent={unreadCount}
            color='error'
            overlap='circular'
            invisible={unreadCount === 0}
          >
            <BsFillBellFill
              className='icon'
              style={{ margin: '0 10px', cursor: 'pointer' }}
              aria-describedby={id}
              onClick={handleBellClick}
            />
          </Badge>
          <Tooltip title='Logout' arrow>
            <GrLogout
              className='icon'
              onClick={handleLogout}
              style={{ margin: '0 10px', cursor: 'pointer' }}
            />
          </Tooltip>
          <BsPersonCircle className='icon' style={{ margin: '0 12px', cursor: 'pointer' }} />
        </div>
        <span style={spanStyle}>{user ? user.name : 'Guest'}</span>
      </div>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 4,
          style: {
            width: '350px',
            maxHeight: '450px',
            overflowY: 'auto',
            borderRadius: '12px',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #eaeaea',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600, color: '#333' }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color='error'>
              <Typography variant='body2' sx={{ color: '#666' }}>
                New
              </Typography>
            </Badge>
          )}
        </Box>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">Site Transfer</Typography>
                {siteTransferNotifications.filter(n => !n.isRead).length > 0 && (
                  <Badge 
                    badgeContent={siteTransferNotifications.filter(n => !n.isRead).length} 
                    color="error" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">Attendance</Typography>
                {attendanceNotifications.filter(n => !n.isRead).length > 0 && (
                  <Badge 
                    badgeContent={attendanceNotifications.filter(n => !n.isRead).length} 
                    color="error" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">Other</Typography>
                {otherNotifications.filter(n => !n.isRead).length > 0 && (
                  <Badge 
                    badgeContent={otherNotifications.filter(n => !n.isRead).length} 
                    color="error" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            } 
          />
        </Tabs>
        
        <Box sx={{ mt: 1 }}>
          {tabValue === 0 && renderNotificationList(
            siteTransferNotifications, 
            "No site transfer notifications"
          )}
          
          {tabValue === 1 && renderNotificationList(
            attendanceNotifications, 
            "No attendance approval notifications"
          )}
          
          {tabValue === 2 && renderNotificationList(
            otherNotifications, 
            "No other notifications"
          )}
        </Box>
        
        <Box sx={{ p: 1.5, textAlign: 'center', borderTop: '1px solid #eaeaea' }}>
          <Button
            size='small'
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              color: '#1976d2',
            }}
            onClick={() => navigate('/notifications')}
          >
            View All Notifications
          </Button>
        </Box>
      </Popover>
    </header>
  );
}

export default Header;
 
