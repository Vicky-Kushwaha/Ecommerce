import {useState} from "react";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DashboardIcon from "@mui/icons-material/Dashboard";
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import {logout} from "../../../actions/userAction";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function AccountMenu({user}) {

  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const open = Boolean(anchorEl);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const MyOrders = () => {
    handleClose();
    navigate("/myOrder")
  }

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/")
  }

  const handleProfile = () => {
    navigate("/account");
    handleClose();
  }

  const handleDashboard = () => {
    navigate("/admin/dashboard");
    handleClose();
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}><img style={{height: "32px", width:"32px" }} src={user.avatar.url ? user.avatar.url : "images/Profile.png"} alt="profile" /></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
          <Avatar sx={{ width: 32, height: 32 }}><img style={{height: "32px", width:"32px" }} src={user.avatar.url ? user.avatar.url : "images/Profile.png"} alt="profile" /></Avatar>
          </ListItemIcon>
               Profile
        </MenuItem>
        {
          (user.role === "admin") &&
       <MenuItem onClick={handleDashboard}>
        <ListItemIcon>
          <DashboardIcon />
         </ListItemIcon>
              Dashboard
        </MenuItem>
        }
        <MenuItem onClick={MyOrders}>
          <ListItemIcon>
            <Inventory2OutlinedIcon fontSize="small" />
          </ListItemIcon>
          My Orders
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small"/>
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}