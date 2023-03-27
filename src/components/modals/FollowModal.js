import * as React from 'react';
import Button from '@mui/material/Button'; 
import Dialog from '@mui/material/Dialog'; 
import DialogContent from '@mui/material/DialogContent'; 
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Avatar, CircularProgress, Divider, IconButton, InputBase, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
 
import CloseIcon from '@mui/icons-material/Close';
 
 
import FollowButton from '../assets/FollowButton';
import { useNavigate } from 'react-router-dom';
import FollowingList from '../Lists/FollowingList';
import FollowerList from '../Lists/FollowerList';

 
export default function FollowModal(props) {   
  
    const navigate = useNavigate();   
    const handleNavigate = (id) => { 
        navigate(`/newprofile/${id}`)
        props.close();
    } 

    return (
        <div>
            {/* <Button className='m-2' style={{ background: '#F66A24', color: 'white', textTransform: 'capitalize' }} onClick={handleClickOpen}  >Edit Profile</ Button> */}
            <Dialog open={props.open} onClose={props.close} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }}>{props.title}

                    <IconButton
                        aria-label="close"
                        onClick={props.close}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                </DialogTitle>
                <Divider />
                <DialogContent sx={{height: {xs:'200px',sm:'250px',md:'350px',lg:'400px'}, overflow:'scroll'}}>
                    <List sx={{ pt: 0 }}>
                        {
                          props.title == "Following" &&   <FollowingList address={props.data.ownedBy} handleNavigate={handleNavigate}/>
                        }
                        {
                           props.title == "Followers" &&   <FollowerList id={props.data.id} handleNavigate={handleNavigate}/>
                        }
                       
                    </List>

                </DialogContent>
            </Dialog>
        </div>
    );
}