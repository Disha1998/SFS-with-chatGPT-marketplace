import { Avatar, Divider } from '@mui/material';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { getComments } from '../../lensprotocol/post/get-post';

function GetCommentByUser({ id }) {
    const pId = window.localStorage.getItem("profileId");
    const [data, setData] = useState([]); 

    useEffect(() => {
        getcomm()
    }, [id])
    const getcomm = async () => {
        var a=[]
        const res = await getComments(id); 
        res && res.map((e) => {
            if (e.profile.id === pId) {
                a.push(e);
            }
        })
        setData(a);
    } 
    return (
        <div style={{ maxHeight: '300px', overflowY: 'scroll' ,margin:'10px'}} > 
            {
                data && data.map((item) => {
                    return (
                        <>
                            <div className="p-0 d-flex " style={{ padding: '5px', marginTop: '5px' }}>
                                <Avatar sx={{ width: '24px', height: '24px' }} src={item?.profile?.picture !== null ? item.profile?.picture?.original?.url : 'https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF'} />
                                <p style={{ margin: '0 5px', fontSize: '12px' }} className='mb-0 align-self-center'>{item.typename === "Comment" ? item.profile?.handle : item.profile?.handle}</p>
                            </div>
                            <p style={{
                                padding: '5px 10px',
                                background: '#000',
                                borderRadius: "3px 15px 15px 10px",
                                margin: '5px 0 0 30px',
                                fontSize: '10px',
                                width: 'fit-content'
                            }}>{item && item?.metadata?.content}</p>
                             <Divider sx={{padding:'5px 0'}} flexItem orientation="horizontal" />
                        </>
                    )
                })
            }


        </div>
    )
}

export default GetCommentByUser