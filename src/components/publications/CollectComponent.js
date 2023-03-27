import { CircularProgress } from '@mui/material';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { LensAuthContext } from '../../context/LensContext';
import { collect } from '../../lensprotocol/post/collect/create-collect';
import { proxyActionFreeCollect } from '../../lensprotocol/post/collect/create-collect-typed-data';

function CollectComponent(props) {
  const lensAuthContext = React.useContext(LensAuthContext);
  const { profile, login } = lensAuthContext;

  const [loading, setLoading] = useState(false);

  const handleCollect = async (id) => {
    if (!profile) {
      toast.error("Please Login first!");
      return;
    }
    setLoading(true);

    const obj = {
      id: props.data.id,
      login: login,
      address: profile.ownedBy
    }

    const res = await collect(obj);
    // const res = await proxyActionFreeCollect(obj); 
    setLoading(false);
    props.setUpdateMirror(!props.updateMirror);
  }

  return (
    <div
      onClick={handleCollect}
      className="d-flex align-items-center"
      style={{ color: 'white', padding: '5px', margin: '0 5px', cursor: 'pointer', fontSize: '15px' }}
    >
      {loading ? <CircularProgress size={20} /> : ""}
      <img src='https://superfun.infura-ipfs.io/ipfs/QmWimuRCtxvPhruxxZRBpbWoTXK6HDvLZkrcEPvaqyqegy' alt='bg' width="15" />  {props.data && props.data?.stats?.totalAmountOfCollects}
      {/* <span className="d-none-xss m-1">Collects</span> */}
    </div>
  )
}

export default CollectComponent