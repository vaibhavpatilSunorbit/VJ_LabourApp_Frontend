import React from "react";
import { Snackbar, SnackbarContent, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const PREFIX = 'CustomPopup';

const classes = {
  success: `${PREFIX}-success`,
  error: `${PREFIX}-error`,
  message: `${PREFIX}-message`,
  icon: `${PREFIX}-icon`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.success}`]: {
    backgroundColor: theme.palette.success.main,
  },
  [`& .${classes.error}`]: {
    backgroundColor: theme.palette.error.main,
  },
  [`& .${classes.message}`]: {
    display: "flex",
    alignItems: "center",
  },
  [`& .${classes.icon}`]: {
    marginRight: theme.spacing(1),
  },
}));

const CustomPopup = ({ open, onClose, message, severity }) => {
  return (
    <Root>
      <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
        <SnackbarContent
          className={severity === "success" ? classes.success : classes.error}
          message={
            <span className={classes.message}>
              {severity === "success" ? (
                <CheckCircleIcon className={classes.icon} />
              ) : (
                <ErrorIcon className={classes.icon} />
              )}
              {message}
            </span>
          }
          action={
            <IconButton size="small" color="inherit" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </Root>
  );
};

export default CustomPopup;
