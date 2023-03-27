import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress,  MenuItem } from '@mui/material'; 
import { LensAuthContext } from '../../context/LensContext';
import { Buffer } from 'buffer';   
  
import { create } from 'ipfs-http-client';  
import { setProfileMetadata } from '../../lensprotocol/profile/update-profile/set-update-profile-metadata';
import { toast } from 'react-toastify';

const auth =
  "Basic " +
  Buffer.from(
    process.env.REACT_APP_INFURA_PID + ":" + process.env.REACT_APP_INFURA_SECRET
  ).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});  

const ColorButton = styled(Button)(({ theme }) => ({
    color: 'white',
    background: 'linear-gradient(to right top, #ff0f7b, #ff3d61, #ff6049, #ff7f36, #f89b29);',
    '&:hover': {
        background: 'linear-gradient(to left top, #ff0f7b, #ff3d61, #ff6049, #ff7f36, #f89b29);',
    },
}));

export default function UpdateProfile({open, onClose}) {
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, loginCreate,  update, setUpdate,userAdd } = lensAuthContext; 
    const [name, setName] = React.useState("");
    const [bio, setBio] = React.useState("");
    const [file, setFile] = React.useState("");
    const [loading, setLoading] = React.useState(false);

 
     
 
    const handleUpload = async () => { 
        setLoading(true);
        const updateData = {
            bio: bio,
            photo: file, 
            login: loginCreate,
            name: name,
            profileId: profile.id,
            address: userAdd
        } 
         await setProfileMetadata(updateData); 
        toast.success("Profile is Updated!");
        setUpdate(!update);
        setLoading(false);
        onClose();
    }
 

   

    const handleUploadImage = async (e) => { 
        const file = e.target.files[0]; 
        const ipfsResult = await client.add(file); 
        const imageURI =`https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`;
        setFile(imageURI);  
    }
   

    return ( 
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    <TextField  onKeyDown={(e)=>e.stopPropagation()}  onChange={(e) => setName(e.target.value)} className='mt-2' id="outlined-basic" placeholder="Name" variant="outlined" fullWidth />
                    </DialogContentText>

                    <TextField  onKeyDown={(e)=>e.stopPropagation()}  onChange={(e) => setBio(e.target.value)} className='mt-2'  placeholder="Bio" variant="outlined" fullWidth />

                    <div className="flex items-center mt-2" style={{ border: '1px solid white', borderRadius: '6px' }}>
                        <input
                            onChange={(e) => handleUploadImage(e)}
                            type="file"
                            name="file"
                            id="file"
                            className="input-file d-none" />
                        <label
                            htmlFor="file"
                            style={{ width: '100%', cursor: 'pointer' }}
                            className="rounded-3 text-center    js-labelFile p-2 my-2 w-20  "
                        >
                            <CloudUploadIcon />
                            <p className="js-fileName">
                                Upload Cover Photo(PNG, JPG, GIF)
                            </p>
                        </label>
                    </div> 
                </DialogContent>
                <DialogActions>
                    <ColorButton onClick={onClose}>Cancel</ColorButton>
                    <ColorButton onClick={handleUpload}>{loading ?  <CircularProgress size={20}/> : "Upload"}</ColorButton>
                </DialogActions>
            </Dialog> 
    );
}
