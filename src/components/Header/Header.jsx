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
  warning: '#ff9800', // orange
  error: '#f44336', // red
  success: '#4caf50', // green
  info: '#2196f3', // light blue
  attendanceApproval: '#9c27b0', // purple
  alert: '#e91e63', // pink
  update: '#009688', // teal
  advance: '#8bc34a', // light green
  debit: '#f44336', // red
  incentive: '#ffc107', // amber
  wagesApproval: '#673ab7', // deep purple
  default: '#9e9e9e' // grey
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
  const [alertNotifications, setAlertNotifications] = useState([]);
  const [updateNotifications, setUpdateNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [readNotifications, setReadNotifications] = useState(new Set());

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

  // Load read notifications from localStorage
  useEffect(() => {
    const savedReadNotifications = localStorage.getItem('readNotifications');
    if (savedReadNotifications) {
      setReadNotifications(new Set(JSON.parse(savedReadNotifications)));
    }
  }, []);

  // Save read notifications to localStorage
  const saveReadNotifications = (readSet) => {
    localStorage.setItem('readNotifications', JSON.stringify([...readSet]));
  };

  // Mark notification as read - UPDATE STATE IMMEDIATELY
  const markAsRead = (notificationId) => {
    const newReadSet = new Set(readNotifications);
    newReadSet.add(notificationId);
    setReadNotifications(newReadSet);
    saveReadNotifications(newReadSet);

    // Update the notification lists immediately to reflect read status
    setSiteTransferNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setAttendanceNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setAlertNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setUpdateNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setOtherNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Check if notification is read
  const isNotificationRead = (notificationId) => {
    return readNotifications.has(notificationId);
  };

  // Fetch site transfer notifications - SHOW ALL
  const fetchSiteTransferNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getnotification`);
      if (response.data.success) {
        const notifications = response.data.data.map(notif => {
          const notificationId = `site-${notif.currentSiteName}`;
          const isRead = isNotificationRead(notificationId);
          
          return {
            id: notificationId,
            type: 'siteTransfer',
            title: notif.currentSiteName,
            message: `Pending site transfer requests: ${notif.PendingCount}`,
            siteName: notif.currentSiteName,
            pendingCount: notif.PendingCount,
            isRead: isRead,
            timestamp: new Date().toISOString()
          };
        });
        
        setSiteTransferNotifications(notifications);
      }
    } catch (error) {
      console.error('Failed to fetch site transfer notifications:', error);
    }
  };

  // Fetch attendance approval notifications - SHOW ALL
  const fetchAttendanceNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getAllNotification`);
      if (response.data.success) {
        const notifications = response.data.data
          .filter(notif => notif.AttendanceId || notif.LabourId)
          .map(notif => {
            const notificationId = `attendance-${notif.AttendanceId || notif.id || Date.now()}`;
            const isRead = isNotificationRead(notificationId);
            
            return {
              id: notificationId,
              type: 'attendanceApproval',
              title: `Attendance for ${notif.name || notif.LabourId}`,
              AttendanceId: notif.AttendanceId,
              LabourId: notif.LabourId,
              FirstPunchManually: notif.FirstPunchManually,
              LastPunchManually: notif.LastPunchManually,
              RemarkManually: notif.RemarkManually,
              message: generateAttendanceMessage(notif),
              isRead: isRead,
              timestamp: notif.LastUpdatedDate || new Date().toISOString()
            };
          });
        
        setAttendanceNotifications(notifications);
      }
    } catch (error) {
      console.error('Failed to fetch attendance notifications:', error);
    }
  };

  // Fetch variable pay notifications - SHOW ALL
  const fetchAlertNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getNotificationVariablePay`);
      if (response.data.success) {
        const notifications = response.data.data.map(notif => {
          const notificationId = `variable-pay-${notif.VariablePayId}`;
          const isRead = isNotificationRead(notificationId);
          
          const message = `${notif.LabourID}: ${notif.name} (${notif.companyName}) - ${notif.businessUnit}, ${notif.departmentName}. ${notif.PayStructure} pay: ₹${notif.VariablepayAmount}. Status: ${notif.ApprovalStatusPay}`;
          
          let title = '';
          let type = 'alert';
          
          if (notif.AdvancePay) {
            title = `Advance Pay Request`;
            type = 'advance';
          } else if (notif.DebitPay) {
            title = `Debit Pay Request`;
            type = 'debit';
          } else if (notif.IncentivePay) {
            title = `Incentive Pay Request`;
            type = 'incentive';
          } else {
            title = `Variable Pay Request`;
          }
          
          return {
            id: notificationId,
            type: type,
            title: title,
            LabourID: notif.LabourID,
            name: notif.name,
            companyName: notif.companyName,
            businessUnit: notif.businessUnit,
            departmentName: notif.departmentName,
            PayStructure: notif.PayStructure,
            VariablepayAmount: notif.VariablepayAmount,
            ApprovalStatusPay: notif.ApprovalStatusPay,
            message: message,
            isRead: isRead,
            timestamp: notif.CreatedAt || new Date().toISOString()
          };
        });
        
        setAlertNotifications(notifications);
      }
    } catch (error) {
      console.error('Failed to fetch variable pay notifications:', error);
    }
  };

  // Fetch wages approval notifications - SHOW ALL
  const fetchUpdateNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getNotificationWagesApproval`);
      if (response.data.success) {
        const notifications = response.data.data.map(notif => {
          const notificationId = `wages-approval-${notif.ApprovalID}`;
          const isRead = isNotificationRead(notificationId);
          
          let wageValue = '';
          let wageType = '';
          
          if (notif.PayStructure === 'DAILY WAGES') {
            wageValue = notif.DailyWages ? `₹${notif.DailyWages}/day` : '';
            wageType = 'Daily';
          } else if (notif.PayStructure === 'FIXED MONTHLY WAGES') {
            wageValue = notif.FixedMonthlyWages ? `₹${notif.FixedMonthlyWages}/month` : '';
            wageType = 'Monthly';
          } else if (notif.PayStructure === 'MONTHLY WAGES') {
            wageValue = notif.MonthlyWages ? `₹${notif.MonthlyWages}/month` : '';
            wageType = 'Monthly';
          }
          
          const hourlyRate = notif.PerHourWages ? ` (₹${notif.PerHourWages}/hr)` : '';
          const message = `${notif.LabourID}: ${notif.name} - ${wageType} wage ${wageValue}${hourlyRate}. Status: ${notif.ApprovalStatus}`;
          
          return {
            id: notificationId,
            type: 'wagesApproval',
            title: `Wages Approval - ${notif.PayStructure}`,
            LabourID: notif.LabourID,
            name: notif.name,
            PayStructure: notif.PayStructure,
            PerHourWages: notif.PerHourWages,
            ApprovalStatus: notif.ApprovalStatus,
            DailyWages: notif.DailyWages,
            MonthlyWages: notif.MonthlyWages,
            FixedMonthlyWages: notif.FixedMonthlyWages,
            message: message,
            isRead: isRead,
            timestamp: notif.CreatedAt || new Date().toISOString()
          };
        });
        
        setUpdateNotifications(notifications);
      }
    } catch (error) {
      console.error('Failed to fetch wages approval notifications:', error);
    }
  };

  // Generate message specifically for attendance notifications
  const generateAttendanceMessage = (notif) => {
    const labourId = notif.LabourId ? `${notif.LabourId}` : '';
    const timeInfo = notif.FirstPunchManually && notif.LastPunchManually
      ? `${notif.FirstPunchManually} - ${notif.LastPunchManually}`
      : '';
    const remarkInfo = notif.RemarkManually
      ? `(${notif.RemarkManually})`
      : '';
    
    return `${labourId}: ${timeInfo} ${remarkInfo}`.trim();
  };

  // Generate appropriate message based on notification type
  const generateMessage = (notification) => {
    if (notification.message) return notification.message;
    
    if (notification.type === 'attendanceApproval') {
      return generateAttendanceMessage(notification);
    }
    
    switch(notification.type) {
      case 'warning':
        return `Warning: ${notification.title || 'Action required'}`;
      case 'error':
        return `Error: ${notification.title || 'Something went wrong'}`;
      case 'success':
        return `Success: ${notification.title || 'Operation completed'}`;
      case 'info':
        return `Info: ${notification.title || 'For your information'}`;
      case 'advance':
        return `Advance Pay: ${notification.LabourID || ''} - ₹${notification.VariablepayAmount || 0}`;
      case 'debit':
        return `Debit Pay: ${notification.LabourID || ''} - ₹${notification.VariablepayAmount || 0}`;
      case 'incentive':
        return `Incentive Pay: ${notification.LabourID || ''} - ₹${notification.VariablepayAmount || 0}`;
      case 'wagesApproval':
        return `Wages Approval: ${notification.LabourID || ''} - ${notification.PayStructure || ''}`;
      default:
        return notification.title || 'New notification';
    }
  };

  // Fetch all other notifications - SHOW ALL
  const fetchOtherNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/getAllNotification`);
      if (response.data.success) {
        const processedNotifications = response.data.data
          .filter(notif => 
            !notif.AttendanceId && 
            !notif.LabourId &&
            notif.type !== 'siteTransfer' &&
            notif.type !== 'attendanceApproval' &&
            notif.type !== 'alert' &&
            notif.type !== 'update' &&
                     notif.type !== 'wagesApproval'
          )
          .map(notif => {
            const notificationId = notif.id || `other-${Date.now()}-${Math.random()}`;
            const isRead = isNotificationRead(notificationId);
            
            const processedNotif = { 
              ...notif,
              id: notificationId,
              isRead: isRead
            };
            
            if (!processedNotif.message) {
              processedNotif.message = generateMessage(processedNotif);
            }
            
            if (!processedNotif.timestamp) {
              processedNotif.timestamp = new Date().toISOString();
            }
            
            return processedNotif;
          });
        
        setOtherNotifications(processedNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch other notifications:', error);
    }
  };

  // Calculate total unread count - ONLY COUNT UNREAD NOTIFICATIONS
  useEffect(() => {
    const siteTransferUnread = siteTransferNotifications.filter(notif => 
      !notif.isRead && notif.pendingCount > 0
    ).length;
    
    const attendanceUnread = attendanceNotifications.filter(notif => !notif.isRead).length;
    const alertUnread = alertNotifications.filter(notif => !notif.isRead).length;
    const updateUnread = updateNotifications.filter(notif => !notif.isRead).length;
    const otherUnread = otherNotifications.filter(notif => !notif.isRead).length;
    
    const totalUnread = siteTransferUnread + attendanceUnread + alertUnread + updateUnread + otherUnread;
    setUnreadCount(totalUnread);
  }, [siteTransferNotifications, attendanceNotifications, alertNotifications, updateNotifications, otherNotifications]);

  // Fetch notifications when popover opens - ONLY FETCH ONCE
  useEffect(() => {
    if (open) {
      fetchSiteTransferNotifications();
      fetchAttendanceNotifications();
      fetchAlertNotifications();
      fetchUpdateNotifications();
      fetchOtherNotifications();
    }
  }, [open]); // Removed readNotifications dependency to prevent refetching

  // MODIFIED: Handle notification click without closing popover immediately
  const handleNotificationClick = (notif) => {
    // Mark notification as read FIRST
    markAsRead(notif.id);
    
    // Small delay to allow UI to update before navigation
    setTimeout(() => {
      // Navigate based on notification type
      switch(notif.type) {
        case 'siteTransfer':
          navigate('/adminApproval/siteTransferApproval');
          break;
        case 'attendanceApproval':
          navigate('/adminApproval/adminAttendanceApproval');
          break;
        case 'advance':
        case 'debit':
        case 'incentive':
        case 'alert':
          navigate('/adminApproval/variableInputApproval');
          break;
        case 'wagesApproval':
          navigate('/adminApproval/wagesApproval');
          break;
        case 'update':
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
    }, 100); // 100ms delay to show the read state change
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('readNotifications');
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
      case 'alert': return '!';
      case 'update': return 'U';
      case 'advance': return 'A+';
      case 'debit': return 'D-';
      case 'incentive': return 'I+';
      case 'wagesApproval': return 'W$';
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

  // FIXED: Render notification list - ALWAYS SHOWS ALL NOTIFICATIONS
  const renderNotificationList = (notifications, emptyMessage) => {
    if (!notifications || notifications.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='body1' color='textSecondary'>{emptyMessage}</Typography>
        </Box>
      );
    }

    // Sort notifications: unread first, then by timestamp (newest first)
    const sortedNotifications = [...notifications].sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
    });

    return (
      <List sx={{ p: 0 }}>
        {sortedNotifications.map((notif, index) => (
          <React.Fragment key={`${notif.id}-${notif.isRead}`}>
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
                opacity: notif.isRead ? 0.8 : 1,
                transition: 'all 0.3s ease', // Smooth transition for state changes
              }}
            >
              <Box sx={{ display: 'flex', width: '100%' }}>
                <Avatar
                  sx={{
                    mr: 2,
                    bgcolor: getAvatarColor(notif.type),
                    width: 40,
                    height: 40,
                    opacity: notif.isRead ? 0.7 : 1,
                  }}
                >
                  {getAvatarLetter(notif)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant='subtitle2'
                    sx={{
                      fontWeight: notif.isRead ? 400 : 600,
                      color: notif.isRead ? '#666' : '#333',
                    }}
                  >
                    {notif.title || (
                      notif.type === 'attendanceApproval'
                        ? 'Attendance Approval'
                        : notif.type === 'siteTransfer'
                          ? 'Site Transfer'
                          : notif.type === 'alert'
                            ? 'Alert'
                            : notif.type === 'wagesApproval'
                              ? 'Wages Approval'
                              : notif.type === 'advance'
                                ? 'Advance Pay'
                                : notif.type === 'debit'
                                  ? 'Debit Pay'
                                  : notif.type === 'incentive'
                                    ? 'Incentive Pay'
                                    : 'Notification'
                    )}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='textSecondary'
                    sx={{
                      mt: 0.5,
                      opacity: notif.isRead ? 0.8 : 1,
                    }}
                  >
                    {notif.message || generateMessage(notif)}
                  </Typography>
                  <Typography
                    variant='caption'
                    color='textSecondary'
                    sx={{ 
                      display: 'block', 
                      mt: 0.5,
                      opacity: notif.isRead ? 0.6 : 0.8,
                    }}
                  >
                    {formatTimestamp(notif.timestamp)}
                  </Typography>
                </Box>
                {/* Unread indicator dot */}
                {!notif.isRead && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#1976d2',
                      alignSelf: 'center',
                      ml: 1
                    }}
                  />
                )}
              </Box>
            </ListItem>
            <Divider component='li' />
          </React.Fragment>
        ))}
      </List>
    );
  };

  // FIXED: Mark all notifications as read - UPDATE STATE IMMEDIATELY
  const markAllAsRead = () => {
    const allNotifications = [
      ...siteTransferNotifications,
      ...attendanceNotifications,
      ...alertNotifications,
      ...updateNotifications,
      ...otherNotifications
    ];
    
    const newReadSet = new Set(readNotifications);
    allNotifications.forEach(notif => {
      newReadSet.add(notif.id);
    });
    
    setReadNotifications(newReadSet);
    saveReadNotifications(newReadSet);

    // Update all notification lists immediately
    setSiteTransferNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setAttendanceNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setAlertNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUpdateNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setOtherNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  // Get unread count for each tab
  const getTabUnreadCount = (notifications) => {
    return notifications.filter(notif => !notif.isRead).length;
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
          <Badge
            badgeContent={unreadCount}
            color='error'
            overlap='circular'
            invisible={unreadCount === 0}
            max={99}
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
            width: '380px',
            maxHeight: '500px',
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
            All Notifications
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {unreadCount > 0 && (
              <>
                <Badge badgeContent={unreadCount} color='error'>
                  <Typography variant='body2' sx={{ color: '#666' }}>Unread</Typography>
                </Badge>
                <Button
                  size='small'
                  onClick={markAllAsRead}
                  sx={{
                    textTransform: 'none',
                    fontSize: '12px',
                    minWidth: 'auto',
                    p: 0.5
                  }}
                >
                  Mark all read
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">Site Transfer</Typography>
                {getTabUnreadCount(siteTransferNotifications.filter(n => n.pendingCount > 0)) > 0 && (
                  <Badge
                    badgeContent={getTabUnreadCount(siteTransferNotifications.filter(n => n.pendingCount > 0))}
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
                {getTabUnreadCount(attendanceNotifications) > 0 && (
                  <Badge
                    badgeContent={getTabUnreadCount(attendanceNotifications)}
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
                <Typography variant="body2">Variable Pay</Typography>
                {getTabUnreadCount(alertNotifications) > 0 && (
                  <Badge
                    badgeContent={getTabUnreadCount(alertNotifications)}
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
                <Typography variant="body2">Wages</Typography>
                {getTabUnreadCount(updateNotifications) > 0 && (
                  <Badge
                    badgeContent={getTabUnreadCount(updateNotifications)}
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
                {getTabUnreadCount(otherNotifications) > 0 && (
                  <Badge
                    badgeContent={getTabUnreadCount(otherNotifications)}
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
            alertNotifications,
            "No variable pay notifications"
          )}
          {tabValue === 3 && renderNotificationList(
            updateNotifications,
            "No wages approval notifications"
          )}
          {tabValue === 4 && renderNotificationList(
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
            onClick={() => {
              navigate('/notifications');
              handlePopoverClose();
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Popover>
    </header>
  );
}

export default Header;

