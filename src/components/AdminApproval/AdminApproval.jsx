import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchBar from '../SarchBar/SearchBar';
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../Data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircleIcon from '@mui/icons-material/Circle';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useUser } from '../../UserContext/UserContext';
import dayjs from 'dayjs';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// toast.configure();

const AdminApproval = () => {



    return (
        <Grid container spacing={11} sx={{ mt: 0, px: 8}}>
        <Grid item xs={12} sm={6} md={4}>
          <Link to={'/adminApproval/adminAttendanceApproval'} style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                backgroundColor: '#e6eefa',
                boxShadow: 'none',
                minHeight: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  transform: 'scale(1.03)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
                  Attendance Approval
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '25px', md: '45px' },
                    color: '#10294c',
                  }}
                >
                  562
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
  
        <Grid item xs={12} sm={6} md={4}>
          <Link to={'/admin/signupCustomers'} style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                backgroundColor: '#e6eefa',
                boxShadow: 'none',
                minHeight: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  transform: 'scale(1.03)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
                  Site Transfer Approval
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '25px', md: '45px' },
                    color: '#10294c',
                  }}
                >
                  562
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
  
        <Grid item xs={12} sm={6} md={4}>
          <Link to={'/admin/signupCustomers'} style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                backgroundColor: '#e6eefa',
                boxShadow: 'none',
                minHeight: '220px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  transform: 'scale(1.03)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" component="div" sx={{ color: '#10294c' }}>
                  Wages Approval
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '25px', md: '45px' },
                    color: '#10294c',
                  }}
                >
                  562
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>
    );
};

export default AdminApproval;










