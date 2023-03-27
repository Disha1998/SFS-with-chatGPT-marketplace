import { Button, CircularProgress, Divider } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LensAuthContext } from '../../context/LensContext';
import { proxyActionFreeFollow } from '../../lensprotocol/follow/create-follow-typed-data';
import { follow } from '../../lensprotocol/follow/follow';

function UserListView({ e ,index,update,setUpdate}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  
    const lensAuthContext = React.useContext(LensAuthContext);
    const { login,profile,setUpdatePro,updatePro} = lensAuthContext;


    const handleNavigate = (id) => {
        navigate(`/newprofile/${id}`)
    }

    const handleFollow = async (id) => {
        const fId = window.localStorage.getItem("profileId");
        if(!profile){
            toast.error("Please login First!");
            return;
        }
        try {
            if (fId != undefined) {
                setLoading(true);
                const data = {
                    id: id,
                    login: login,
                    followId: fId
                }
                // const res = await follow(data);
                const res= await proxyActionFreeFollow(data)
                console.log(res,"resp");
                if (res) {
                    setLoading(false);
                    setUpdate(!update);
                    setUpdatePro(!updatePro);
                    toast.success("Followed!");
                }
                setLoading(false);

            } else {
                toast.error("Please Login First!")
            }

        } catch (error) {
            toast.error(error)
            console.log(error);
            setLoading(false);
        }
    }

    const replaceUrl = (e) => {
        const str = e && e.startsWith("ipfs://");
        if (str) {
            const res = 'https://superfun.infura-ipfs.io/ipfs/' + e.slice(7);
            return res;
        }
        return e;
    }


       // #ef6a37, #f7b643, #468f72, #2679c1, #9a73c3

    return (
        <div className=' row mt-2  '>
            <div className='col-8'>
                <div className='d-flex'>
                    <img alt="" src={`${e?.picture != null ? replaceUrl(e?.picture?.original?.url) : "https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF"}`} style={{ width: '40px', height: '40px', borderRadius: '6px' }} loading="eager" />
                    <div className='user-info' onClick={() => handleNavigate(e.id)} style={{ cursor: 'pointer' }}>
                        <p>{e.name !== null && e.name !== "[NULL]" ? e.name : e.handle}</p>
                        <div> {e.bio}</div>
                    </div>
                </div>
            </div>
            <div className='col-4'>
                <Button onClick={() => handleFollow(e.id)}
                 className='' variant="contained"
                 style={{ background: '#468f72' , color: 'white', textTransform: 'capitalize' }}
                  size="small">{loading ? <CircularProgress size={20} /> : "Follow"}</Button>
            </div>
            <Divider sx={{ marginTop: '10px' }} />
        </div>
    )
}

export default UserListView