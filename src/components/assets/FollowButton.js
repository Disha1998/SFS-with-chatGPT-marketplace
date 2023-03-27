import { Button, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LensAuthContext } from '../../context/LensContext';
import { follow, unfollow } from '../../lensprotocol/follow/follow';
import { isFollowProfile } from '../../lensprotocol/follow/FreeFollow';

function FollowButton({id}) {
    const [loading, setLoading] = useState(false);
    const [isFl, setIsFl] = React.useState(false);
    const lensAuthContext = React.useContext(LensAuthContext);
    const { login, profile ,updatePro,
        setUpdatePro} = lensAuthContext;


        

    useEffect(()=>{
        getIsFollow()
    },[id,updatePro])

    async function getIsFollow() {
        const req = [
            {
                followerAddress: profile.ownedBy,
                profileId: id
            }
        ]; 
        const followData = await isFollowProfile(req);   
        setIsFl(followData?.data?.doesFollow[0]?.follows);
    }

    const handleFollow = async (id) => {
        const fId = window.localStorage.getItem("profileId");
        if (!profile) {
            toast.error("Please Login First!");
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
                var res;
                if (isFl) { 
                    res = await unfollow(data);
                } else { 
                    res = await follow(data);
                }   
                if (res) {
                    setLoading(false);
                    // setUpdate(!update); 
                    setUpdatePro(!updatePro);
                }
                // await getProfile();
                setLoading(false);
            } else {
                toast.error("Please Login First!")
            }

        } catch (error) {
            toast.error("Error: Something went wrong!")
            setLoading(false);
        }
    }

    return (
        <Button sx={{ margin: '20px 10px 0 0' }}
            style={{ background: '#468f72', color: 'white', textTransform: 'capitalize' }}
            onClick={() => handleFollow(id)}
        >{loading ? <CircularProgress size={20} /> : isFl ? "Unfollow" : "Follow"}
        </Button>
    )
}

export default FollowButton