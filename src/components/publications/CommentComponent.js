import { Send } from '@mui/icons-material';
import { Avatar, CircularProgress, Divider, IconButton } from '@mui/material';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { LensAuthContext } from '../../context/LensContext';
import { createComment, createCommentByDis } from '../../lensprotocol/post/comments/create-comment';
import { getComments } from '../../lensprotocol/post/get-post';

function CommentComponent({ show, profile, data,  updateMirror,setUpdateMirror  }) {

    const [comment, setComments] = useState("");
    const [loading, setLoading] = useState(false);
    const [displayCmt, setDisplayCmt] = useState([]);

    const lensAuthContext = React.useContext(LensAuthContext);
    const { login, loginCreate } = lensAuthContext;
    const [update,setUpdate]= useState(false);


    useEffect(() => {
        getComm();
    }, [update])
 

    async function getComm() {
        let arr = [];
        const cmt = await getComments(data.id);
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

    const handleComment = async (data) => {
        if(!profile){
            toast.error("Please login First!");
            return;
        }
        var pId  ;
        if(data.__typename === "Comment"){
            pId = data?.mainPost?.id;
        } else if(data.__typename === "Mirror"){
            pId = data?.mirrorOf?.id;
        } else {
            pId = data?.id;
        }
        if(comment.length === 0){
            toast.error("Please Fill up this field!");
            return;
        }
        try {
            let arr = [...displayCmt];
            const id = window.localStorage.getItem("profileId");
            setLoading(true);

            const obj = {
                address: profile.ownedBy,
                comment: comment,
                login: profile?.dispatcher?.canUseRelay ? login : loginCreate,
                profileId: id,
                publishId: pId,
                user: profile.name ? profile.name : profile.handle
            }
            var result;

            if (profile?.dispatcher?.canUseRelay) {
                result = await createCommentByDis(obj);
            } else {
                result = await createComment(obj);
            }
            if (result) {
                let obj = {
                    typename: "Comment",
                    avtar: profile?.picture?.original?.url,
                    name: profile?.handle,
                    comment: comment
                }
                arr[arr.length] = obj;
                setComments("");
                setDisplayCmt(arr)
                // setCommUp(!commUp);
                setLoading(false);
                setUpdate(!update);
                setUpdateMirror(!updateMirror);

            }
            setUpdate(!update);
            setUpdateMirror(!updateMirror)
            setLoading(false);
        } catch (error) {
            toast.error(error);
            setUpdate(!update);
            setLoading(false);
            setUpdateMirror(!updateMirror)
        }
    }

    return (
        <div className='' style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            <div className="d-flex justify-content-around mt-2 p-2">
                <div className="p-0" style={{alignSelf:'center'}}>
                    <Avatar sx={{width:'24px',height:'24px'}} src={profile?.picture != null ? profile?.picture?.original?.url : "https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF"} />
                </div>
                 
                <input
                    onChange={(e) => setComments(e.target.value)}
                    style={{width:'100%', border: 'none',fontSize:'12px', borderRadius: '50px', outlineWidth: 0, padding: '0 10px',height:'24px',lineHeight:'28px', alignSelf:'center' }}
                    placeholder="Write a comment.."
                    value={comment}
                />
                {/* </div> */}
                <IconButton onClick={() => handleComment(data)} >
                    {loading ? <CircularProgress size={20} /> : <Send />}
                </IconButton>
                {/* </form> */}
            </div>

            {
                data !== undefined && displayCmt && displayCmt.map((e) => {
                    return (
                        <div style={{ margin: '10px' }} key={e.id}> 
                          <Divider flexItem orientation="horizontal"  />
                            <div className="p-0 d-flex " style={{ padding: '5px',marginTop:'5px' }}>
                                <Avatar sx={{width:'24px',height:'24px'}} src={e.avtar !== undefined ? e.avtar : 'https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF'} />
                                <p style={{margin:'0 5px',fontSize:'12px'}} className='mb-0 align-self-center'>{e.typename === "Comment" ? e.name : e.name}</p>
                            </div>
                            <p style={{
                                padding: '5px 10px',
                                background: '#000',
                                borderRadius: "3px 15px 15px 10px",
                                margin: '5px 0 0 30px',
                                fontSize:'10px',
                                width: 'fit-content'
                            }}>{e.typename === "Comment" && e.comment}</p>
                           
                        </div>
                    )
                })
            }

        </div>
    )
}

export default CommentComponent