import { Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LensAuthContext } from '../../context/LensContext';
import { follow } from '../../lensprotocol/follow/follow';

function UserCard(props) {
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(false);
    const lensAuthContext = React.useContext(LensAuthContext);
    const { login,profile,updatePro,setUpdatePro} = lensAuthContext;

    const navigate = useNavigate();

    const replaceUrl = (e) => {
        const str = e && e.startsWith("ipfs://");
        if (str) {
            const res = 'https://superfun.infura-ipfs.io/ipfs/' + e.slice(7);
            return res;
        }
        return e;
    }

    const isPrime = num => {
        for (let i = 2; i < num; i++)
            if (num % i === 0) return false;
        return num > 1;
    }
    const isOdd = (num) => { return num % 2; }
    const getBackGroundColor = (num) => {
        let color = '#9a73c3';
        if (num === 0) {
            color = '#2679c1';
        }
        if (isOdd(num)) {
            color = '#ef6a37';
        } else {
            color = '#468f72';
        }
        if (isPrime(num)) {
            color = '#f7b643'
        }
        return color;
    }

    const handleNavigate = (id) => {
        navigate(`/newprofile/${id}`)
    }

    const handleFollow = async (id) => {
        if(!profile){
            toast.error("Please login First!");
            return;
        }
        const fId = window.localStorage.getItem("profileId");
        try {
            if (fId != undefined) {
                setLoading(true);
                const data = {
                    id: id,
                    login: login,
                    followId: fId
                }
                const res = await follow(data);
                // const res= await proxyActionFreeFollow(data)
                if (res) {
                    setLoading(false);
                    setUpdate(!update);
                    toast.success("Followed!");
                    setUpdatePro(!updatePro)
                }
                setLoading(false);
            } else {
                toast.error("Please Login First!")
            }

        } catch (error) {
            toast.error(error)
            console.log(error,"errr");
            setLoading(false);
        }
    }
    return (
        <div >
            <div className="story" style={{ backgroundColor: getBackGroundColor(props.index) }} >
                <span onClick={() => handleNavigate(props.data?.id)}>
                    <p>@{props.data.name !== null && props.data.name !== "[NULL]" ? props.data.name : props.data.handle}</p>
                    <div className='image'
                        style={{
                            backgroundImage: `linear-gradient(360deg, rgba(0,0,0,0.1) 100%, rgba(0,0,0,0.1) 100%), url(${props.data?.picture != null ? replaceUrl(props.data?.picture?.original?.url) : "https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF"} )`,
                            height: "100px", margin: "7px",
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            borderRadius: '6px'
                        }}
                    ></div>
                </span>
                <Button
                    variant="contained"
                    size="small"
                    style={{ backgroundColor: 'black', color: getBackGroundColor(props.index), fontWeight: "bold" }}
                    onClick={() => handleFollow(props.data.id)}
                >{loading ? <CircularProgress size={20} /> : "Follow"}
                </Button>

            </div>
        </div>
    )
}

export default UserCard