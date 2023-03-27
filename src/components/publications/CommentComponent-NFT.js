import { Send } from '@mui/icons-material';
import { Avatar, CircularProgress, Divider, IconButton } from '@mui/material';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { LensAuthContext } from '../../context/LensContext';
import { commentGaslessNft, DoCommentNft } from '../../lensprotocol/MarketPlace/Comment/DoComment';
import { getNFTCommentsByLatest } from '../../lensprotocol/MarketPlace/getNftPost/GetNftPost';

function CommentComponentNFT({ show, profile, data, updateMirror, setUpdateMirror }) {
    console.log('data-----', data);
    const [comment, setComments] = useState("");
    const [loading, setLoading] = useState(false);
    const [displayCmt, setDisplayCmt] = useState([]);

    const lensAuthContext = React.useContext(LensAuthContext);
    const { login, loginCreate } = lensAuthContext;
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        getComm();
    }, [update])


    async function getComm() {
        let arr = [];
        const cmt = await getNFTCommentsByLatest(data.id);
        console.log(cmt, 'cmt in detail');
        cmt && cmt.map((com) => {
            let obj = {
                typename: com?.__typename,
                avtar: com?.profile?.picture?.original?.url,
                name: com?.profile?.handle,
                comment: com?.metadata?.content
            }
            arr.push(obj);
        })
        setDisplayCmt(arr);
    }


    const commentUpload = async () => {
        const profileId = window.localStorage.getItem("profileId");
        if (comment.length !== 0) {
            if (profileId === undefined) {
                console.log('Please Login First!');
                return;
            }
            setLoading(true);
            const commentData = {
                comment: comment,
                login: login,
                profile: profile,
                proId: profileId,
                pubId: data.id,
                user: profile.name ? profile.name : profile.handle
            }
            console.log(commentData, 'cmt data');
            let res;
            if (profile?.dispatcher?.canUseRelay) {
                console.log('gasless');
                res = await commentGaslessNft(commentData);
                setUpdate(!update)
            } else {
                res = await DoCommentNft(commentData)
                setUpdate(!update)
            }
        }
    }
    return (
        <div className='' style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            <div className="d-flex justify-content-around mt-2 p-2">
                <div className="p-0" style={{ alignSelf: 'center' }}>
                    <Avatar sx={{ width: '24px', height: '24px' }} src={profile?.picture != null ? profile?.picture?.original?.url : "https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF"} />
                </div>

                <input
                    onChange={(e) => setComments(e.target.value)}
                    style={{ width: '100%', border: 'none', fontSize: '12px', borderRadius: '50px', outlineWidth: 0, padding: '0 10px', height: '24px', lineHeight: '28px', alignSelf: 'center' }}
                    placeholder="Write a comment.."
                    value={comment}
                />
                <IconButton onClick={commentUpload} >
                    {loading ? <CircularProgress size={20} /> : <Send />}
                </IconButton>
            </div>

            {
                data !== undefined && displayCmt && displayCmt.map((e) => {
                    return (
                        <div style={{ margin: '10px' }} key={e.id}>
                            <Divider flexItem orientation="horizontal" />
                            <div className="p-0 d-flex " style={{ padding: '5px', marginTop: '5px' }}>
                                <Avatar sx={{ width: '24px', height: '24px' }} src={e.avtar !== undefined ? e.avtar : 'https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF'} />
                                <p style={{ margin: '0 5px', fontSize: '13px' }} className='mb-0 align-self-center'>{e.typename === "Comment" ? e.name : e.name}</p>
                            </div>
                            <p style={{
                                padding: '5px 10px',
                                background: '#000',
                                borderRadius: "3px 15px 15px 10px",
                                margin: '5px 0 0 30px',
                                fontSize: '15px',
                                width: 'fit-content'
                            }}>{e.typename === "Comment" && e.comment}</p>

                        </div>
                    )
                })
            }

        </div>
    )
}

export default CommentComponentNFT