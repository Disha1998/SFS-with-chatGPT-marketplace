import React, { useEffect, useState } from 'react'
import SwapHorizSharpIcon from '@mui/icons-material/SwapHorizSharp';
import { LensAuthContext } from '../../context/LensContext';
import { createMirror,createMirrorByDis } from '../../lensprotocol/post/mirror/mirror';
import { CircularProgress, IconButton } from '@mui/material';
import { hasMirrored } from '../../lensprotocol/post/mirror/has-mirror-publications';
import { toast } from 'react-toastify';


function MirrorComponent(props) {
  const lensAuthContext = React.useContext(LensAuthContext);
  const { profile,login } = lensAuthContext;
 

  const [loading, setLoading] = useState(false);

  const handleCreateMirror = async () => {
    if(!profile){
      toast.error("Please Login First!");
      return;
    }
    setLoading(true)
    const id = window.localStorage.getItem("profileId");
    const obj = {
      profileId: id,
      address: profile.ownedBy,
      login: login,
      publishId: props.data?.id,
    }
    var result;

    if (profile?.dispatcher?.canUseRelay) {
      result = await createMirrorByDis(obj);
    } else {
      result = await createMirror(obj);
    }   
    toast.success("Post has been Mirrored!")
    props.setUpdateMirror(!props.updateMirror);
    setLoading(false);
  } 
 

  return (
    <div
      onClick={handleCreateMirror}
      className="d-flex align-items-center"
      style={{ color: 'white', padding: '5px', margin: '0 15px', cursor: 'pointer',fontSize:'15px' }}
    > 
      {loading ? <CircularProgress size={20} /> : ""}
      < SwapHorizSharpIcon style={{fontSize:'15px'}} /> {props.data && props.data?.stats?.totalAmountOfMirrors}
      {/* <span className="d-none-xss m-1">Mirrors</span> */}
    </div>
  )
}

export default MirrorComponent