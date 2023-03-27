import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Avatar, Button, CircularProgress, InputBase, ListItemAvatar, Paper, Tooltip, useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import UploadModal from '../modals/UploadModal';
import ProfileCreation from '../modals/CreateProfileModal';
import UpdateProfile from '../modals/update-profile';
import { search } from '../../lensprotocol/search/search';
import { LensAuthContext } from '../../context/LensContext';
import CancelIcon from '@mui/icons-material/Cancel';
import { disableDispatFun, enableDispatFun } from '../../lensprotocol/dispatcher/disable-dispatcher';
import { toast } from 'react-toastify';
import CreateNftModal from '../modals/CreateNftModal';
const pages = [
    {
        name: 'Market Place',
        path: 'marketplace'
    },

    {
        name: 'Home',
        path: ''
    },
    // {
    //     name: 'Artists',
    //     path: 'memers'
    // }
]

export default function Header() {

    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login, disconnectWallet, setUpdate, update } = lensAuthContext;

    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState(null);


    const [open, setOpen] = React.useState(false);
    const [searchData, setSearchData] = React.useState([]);
    // const navigate = useRoutes();
    const [keyword, setKeyword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const theme = useTheme();

    const greaterThanMid = useMediaQuery(theme.breakpoints.up("md"));
    const smallToMid = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const lessThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const xsmall = useMediaQuery(theme.breakpoints.down("xs"));


    const drawerWidth = 240;

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };



    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleNavigate = (id) => {
        navigate(`/newprofile/${id}`)
        setSearchData("");
    }

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));


    const navigateToHome = () => {
        navigate('/');
    }

    const handleClickNavigate = (path) => {
        navigate(`/${path}`);
    }


    const handleSearch = async (e) => {
        setKeyword(e);
        const res = await search(e);
        setSearchData(res.search.items)
    }

    const handleClear = () => {
        setSearchData("");
        setKeyword("");
    }

    const handleEnableDispatcher = async (id) => {
        if (!profile) {
            toast.error("Please Login!");
            return;
        } else {
            setLoading(true);
            const res = await enableDispatFun(id);
            setLoading(false);
            toast.success("Successfully Enable Dispatcher!")
            setUpdate(!update);
        }
    }

    const handleDesableDispatcher = async (id) => {
        if (!profile) {
            toast.error("Please Login!");
            return;
        } else {
            setLoading(true);
            const res = await disableDispatFun(id);
            setLoading(false);
            toast.success("Successfully Disable Dispatcher!")
            setUpdate(!update);
        }
    }

    return (
        <div className='container p-0 '>
            <Box sx={{ flexGrow: 1 }} >
                <AppBar sx={{ padding: { xs: '0', md: '0 85px', lg: '0 4%', background: 'black' } }} color='primary' open={open}>
                    <Toolbar>
                        {
                            lessThanSmall && <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                                // display: { xs: 'block', sm: 'none' },
                                onClick={handleDrawerOpen}
                            >
                                <MenuIcon />

                            </IconButton>
                        }

                        <Drawer
                            sx={{
                                width: open && drawerWidth,
                                flexShrink: 0,
                                '& .MuiDrawer-paper': {
                                    width: drawerWidth,
                                    boxSizing: 'border-box',
                                },
                            }}
                            variant="persistent"
                            anchor="left"
                            open={open}
                        >
                            <DrawerHeader>
                                <img alt='' style={{ cursor: 'pointer' }} onClick={navigateToHome} src='https://superfun.infura-ipfs.io/ipfs/QmZ52Ugz1Z3yuXVvMNiDfFacWUdDofAQBLifvfDagdVJem' />
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                </IconButton>
                            </DrawerHeader>
                            <Divider />
                            <List>
                                {pages.map((text, index) => (
                                    <ListItem key={text.name} disablePadding>
                                        <ListItemButton onClick={() => handleClickNavigate(text.path)}>
                                            <ListItemIcon>
                                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                            </ListItemIcon>
                                            <ListItemText primary={text.name} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider />

                            {
                                !profile && <Button className='m-2' style={{ background: '#488E72', color: 'white', textTransform: 'capitalize' }} onClick={login}>
                                    Login
                                </Button>
                            }

                            {
                                lessThanSmall && <UploadModal />
                            }
                            {
                                lessThanSmall && <CreateNftModal />
                            }
                        </Drawer>

                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block', md: 'block', lg: 'block', xl: 'block' }, cursor: 'pointer' }}
                        >
                            <img alt='' onClick={navigateToHome} src='https://superfun.infura-ipfs.io/ipfs/QmZ52Ugz1Z3yuXVvMNiDfFacWUdDofAQBLifvfDagdVJem' />
                        </Typography>


                        <Paper
                            elevation={3}
                            component="form"
                            style={{ padding: '0', display: 'flex', alignItems: 'center', borderRadius: '24px', marginLeft: '20px' }}
                        >
                            <div className="input-group" style={{ background: 'white', borderRadius: '24px', padding: '2px 10px' }}>
                                <InputBase
                                    sx={{ ml: 1, flex: 1, color: 'black' }}
                                    placeholder="Search..."
                                    inputProps={{ 'aria-label': 'Search by Memers' }}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    value={keyword}
                                    endAdornment={keyword.length !== 0 && <CancelIcon position="end" sx={{ cursor: 'pointer' }} onClick={handleClear}>$</CancelIcon>}
                                >

                                </InputBase>
                            </div>
                            <List style={{ position: 'absolute', top: '60px', background: 'black', maxHeight: '400px', overflowY: 'scroll' }}>
                                {
                                    searchData && searchData.map((e, i) => {
                                        return (
                                            <ListItem button key={i} onClick={() => handleNavigate(e.profileId)} >
                                                <ListItemAvatar>
                                                    <Avatar src={e.picture == null ? 'assets/bg.png' : e.picture.original && e.picture.original.url}>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={e.handle} />
                                            </ListItem>
                                        )
                                    })
                                }

                            </List>
                        </Paper>

                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, marginLeft: 'auto' }}>
                            {pages.map((page) => (
                                <Link key={page.name} to={`/${page.path}`} underline="none" sx={{ my: 2, color: 'white', display: 'block', }}>{page.name}</Link>
                            ))}

                            {
                                !profile && <Button className='m-2' style={{ background: '#488E72', color: 'white', textTransform: 'capitalize' }} onClick={login}>
                                    Login
                                </Button>
                            }

                        </Box>
                        {
                            <UploadModal />
                        }
                        {
                            <CreateNftModal />
                        }
                        <Box sx={{ flexGrow: 0 }}>
                            {
                                profile &&
                                <Tooltip title={profile.name ? profile.name : profile.handle}>
                                    <div onClick={handleOpenUserMenu} style={{ cursor: 'pointer' }} className="d-flex">
                                        <img style={{ width: '34px', height: '34px', borderRadius: '50%' }} alt="" src={profile?.picture != null ? profile?.picture?.original?.url : "https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF"} />
                                        {/* {
                                     profile && <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                                         <p className='text-center m-1'>{profile.name != null ? profile.name : profile.handle}</p>
                                     </Box>
                                 } */}
                                    </div>
                                </Tooltip>
                            }
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {
                                    profile && <Box sx={{ my: 1.5, px: 2.5, cursor: 'pointer' }} onClick={() => handleNavigate(profile.id)} >

                                        <Typography variant="subtitle1" noWrap>
                                            {profile.name && profile.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                                            @{profile.handle}
                                        </Typography>
                                    </Box>
                                }
                                <Divider />
                                {/* <ProfileCreation /> */}
                                {
                                    profile && profile.dispatcher != null ? <MenuItem onClick={() => handleDesableDispatcher(profile.id)} className='m-2'> {loading ? <CircularProgress size={20} /> : "Disable Dispatcher"}  </MenuItem> : <MenuItem className='m-2' onClick={() => handleEnableDispatcher(profile.id)}  >{loading ? <CircularProgress size={20} /> : "Enable Dispatcher"}  </MenuItem>
                                }
                                {
                                    profile && <MenuItem className='m-2' onClick={disconnectWallet}> Logout </MenuItem>
                                }


                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar >
            </Box >
        </div >
    );

}