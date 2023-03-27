import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Divider, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import React from 'react'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import SwapHorizSharpIcon from '@mui/icons-material/SwapHorizSharp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { LensAuthContext } from '../../context/LensContext';
import moment from 'moment';
import CommentComponent from '../publications/CommentComponent';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { addReaction, getReactions, removeReaction } from '../../lensprotocol/reactions/add-reaction';
import MirrorComponent from '../publications/MirrorComponent';
import CollectComponent from '../publications/CollectComponent';
import { useEffect } from 'react';
import { getpublicationById } from '../../lensprotocol/post/get-publicationById';
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { toast } from 'react-toastify';
import { deletePublicaton } from '../../lensprotocol/post/deletePublication';
import DeleteIcon from '@mui/icons-material/Delete';
import { reportPublication } from '../../lensprotocol/post/report-publication';
import ReportModal from '../modals/ReportModal';

function PostCard({ item }) {
    const params = useParams();
    const navigate = useNavigate();
    const [style, setStyle] = useState("");
    const [showComment, setShowComment] = useState(false);
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login } = lensAuthContext;
    const [count, setCount] = useState(0);
    const [likeUp, setLikeUp] = useState(0);
    const [pid, setPid] = useState(item?.id);
    const [update, setUpdate] = useState(false);
    const [updateMirror, setUpdateMirror] = useState(false);
    const [data, setData] = useState(item);
    const [fileType, setFileType] = useState("img")
    const [loading, setLoading]= useState(false);
    const [openReport, setOpenReport]= useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        getReact();
    }, [pid, update])


    useEffect(() => {
        getMirrorCount()
    }, [updateMirror, pid,loading,params.id])

    const handleNavigate = (id) => {
        navigate(`/newprofile/${id}`)
        setPid(id);
    }

    const handleNavigateDetails = (id) => {
        navigate(`/trendingDetails/${id}`);
    }

    const replaceUrl = (e) => {
        const str = e && e.startsWith("ipfs://");
        if (str) {
            const res = 'https://superfun.infura-ipfs.io/ipfs/' + e.slice(7);
            return res;
        }
        return e;
    }

    const handleShowComment = (id) => {
        setStyle(id);
        setShowComment(!showComment);
    };

    const addReactions = async (data) => {
        if(!profile){
            toast.error("Please Login first!")
            return;
        }
        const id = window.localStorage.getItem("profileId");
        const pId = data && data.__typename === "Comment" ? data?.mainPost?.id : data?.id;
        const dd = {
            id: id,
            address: profile.ownedBy,
            publishId: pId,
            login: login
        }
        let res;
        if (likeUp === false) {
            res = await addReaction(dd);
        } else {
            res = await removeReaction(dd);
        }

        if (res === undefined) {
            setUpdate(!update);
        }
    }

    const getReact = async () => {
        const res = await getReactions(pid)
        if (profile) {
            const like = res.items && res.items.filter((e) => e.profile.id === profile.id);
            if (like.length === 0) {
                setLikeUp(false)
            } else {
                setLikeUp(true)
            }
        }
        setCount(res.items.length);
    }

    const getMirrorCount = async () => {
        const res = await getpublicationById(pid)
        setData(res.data.publication);
        if (res.data.publication?.metadata?.media[0]?.original?.mimeType === 'image/jpeg') {
            setFileType("img");
        } else if (res.data.publication?.metadata?.media[0]?.original?.mimeType === 'video/mp4') {
            setFileType("video");
        } else {
            setFileType("text");
        }
    }

    const  handleDeletePublication=async(id)=>{
        setLoading(true);
        const dd = {
            id: id,
            address: profile.ownedBy, 
            login: login
        } 
      const res = await deletePublicaton(dd); 
      if(res.data.hidePublication === null){ 
        setLoading(false);
        handleClose();
        toast.success("Post successfully deleted!"); 
      }
      setLoading(false);
      handleClose();
    } 

    const handleOpenRepoert=()=>{
        setOpenReport(true);
    }
    const handleCloseReport=()=>{
        setOpenReport(false);
    }

    return (
        <Card >
            <ReportModal open={openReport} onClose={handleCloseReport} data={data}/>
            <CardHeader
                sx={{ padding: '10px' }}
                avatar={
                    <Avatar
                        onClick={() => handleNavigate(data?.profile?.id)}
                        src={`${data?.profile?.picture != null ? replaceUrl(data?.profile?.picture?.original?.url) : "https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF"} `}
                        alt={data?.mainPost ? data?.mainPost?.metadata?.name : data?.metadata?.name}
                        aria-label="recipe" />
                }
                title={<span onClick={() => handleNavigate(data?.profile?.id)}>{`@${data?.profile?.name !== null && data?.profile?.name !== "[NULL]" ? data?.profile?.name : data?.profile?.handle}`}</span>}
                subheader={<span>{moment(data.createdAt, "YYYYMMDD").fromNow()}</span>}

                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        />
                    </IconButton>
                }
            />
            <Divider flexItem orientation="horizontal" />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {
                    profile?.id === data?.profile?.id  && <MenuItem onClick={()=>handleDeletePublication(data.id)}><IconButton><DeleteIcon style={{ fontSize: "18px" }} /></IconButton><small>{ loading ? <CircularProgress size="24"/> : 'Delete' }</small></MenuItem>
                }
                <MenuItem onClick={ ()=>handleOpenRepoert()}><IconButton><OutlinedFlagOutlinedIcon style={{ fontSize: "18px" }} /></IconButton><small>Report Post</small></MenuItem>
                <MenuItem onClick={handleClose}><IconButton><CodeOutlinedIcon style={{ fontSize: "18px" }} /></IconButton><small>Embed</small></MenuItem>
            </Menu>
            {
                fileType !== 'text' && <CardMedia
                    component={fileType}
                    image={`${data.mainPost ? replaceUrl(data?.mainPost?.metadata?.media[0]?.original?.url) : replaceUrl(data?.metadata?.media[0]?.original?.url)} `}
                    alt="sfs" 
                    controls
                    onClick={() => handleNavigateDetails(data.id)}
                />
            }

            <CardContent onClick={() => handleNavigateDetails(data.id)} >
                <span style={{ fontSize: '16px', textTransform: 'capitalize' }}  >
                    {data.mainPost ? data?.mainPost?.metadata?.content : data?.metadata?.content}
                </span>
                <div>
                    {
                        fileType === 'text' && <span style={{ fontSize: '14px' }} className='post-tags text-secondary'   >
                            {data.mainPost ? data?.mainPost?.metadata?.description : data?.metadata?.description}
                        </span>
                    }
                </div>
                <Stack direction="row" spacing={1}>
                    <div style={{ width: '100%' }}>
                        {data.mainPost?.tags != [] && data?.mainPost?.metadata?.tags.map((tag, index) => (
                            <span
                                className='m-1 post-tags'
                                key={index}
                            > {`#${tag}`}</span>

                        ))}
                        {data?.metadata?.tags != [] && data?.metadata?.tags.map((tag, index) => (
                            <span
                                className='m-1 post-tags'
                                key={index}
                            > {`#${tag}`}</span>

                        ))}
                    </div>
                </Stack>
            </CardContent>
            <Divider flexItem orientation="horizontal" />
            <CardActions disableSpacing className="d-flex justify-content-around">
                <div
                    className="d-flex align-items-center"
                    style={{ color: 'white', margin: '0 5px', cursor: 'pointer', fontSize: '15px' }}
                    onClick={() => addReactions(data)}
                >
                    {
                        likeUp == 0 ? <FavoriteBorderIcon style={{ fontSize: '15px' }} /> : <FavoriteIcon style={{ fontSize: '15px' }} />
                    }
                    {count}
                    {/* <span className="d-none-xss m-1">Likes</span> */}
                </div>

                <div
                    onClick={() => handleShowComment(data.id)}
                    className="d-flex align-items-center"
                    style={{ color: 'white', margin: '0 5px', cursor: 'pointer', fontSize: '15px' }}
                >
                    < ModeCommentOutlinedIcon style={{ fontSize: '15px' }} />  {data && data.stats.totalAmountOfComments}

                    {/* <span className="d-none-xss m-1">Comment</span> */}
                </div>
                <MirrorComponent data={data} updateMirror={updateMirror} setUpdateMirror={setUpdateMirror} />
                <CollectComponent data={data} updateMirror={updateMirror} setUpdateMirror={setUpdateMirror} />
            </CardActions>

            <Divider flexItem orientation="horizontal" style={{ border: '1px solid white' }} />
            {
                showComment && style === data.id && <CommentComponent show={showComment} profile={profile} data={data} updateMirror={updateMirror} setUpdateMirror={setUpdateMirror} />
            }
        </Card>
    )
}

export default PostCard