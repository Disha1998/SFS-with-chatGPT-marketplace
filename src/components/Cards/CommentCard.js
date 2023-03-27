import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, Divider, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import React from 'react'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import SwapHorizSharpIcon from '@mui/icons-material/SwapHorizSharp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import { useNavigate } from 'react-router-dom';
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
import { getComments } from '../../lensprotocol/post/get-post';
import GetCommentByUser from './GetCommentByUser';
import { toast } from 'react-toastify';

function CommentCard({ item }) {
    const navigate = useNavigate();
    const [style, setStyle] = useState("");
    const [showComment, setShowComment] = useState(false);
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login } = lensAuthContext;
    const [count, setCount] = useState(0);
    const [likeUp, setLikeUp] = useState(0);
    const [pid, setPid] = useState(item?.mainPost?.id);
    const [update, setUpdate] = useState(false);
    const [updateMirror, setUpdateMirror] = useState(false);
    const [data, setData] = useState(item);
    const [fileType, setFileType] = useState("img")

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
    }, [updateMirror, pid])

    const handleNavigate = (id) => {
        navigate(`/newprofile/${id}`)
        setPid(id);
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
            toast.error("Please Login First!");
            return;
        }
        const id = window.localStorage.getItem("profileId");
        const pId = data && data?.mainPost?.id;
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
        if(profile){
            const like = res.items && res.items.filter((e) => e?.profile.id === profile.id);
            if (like.length === 0) {
                setLikeUp(false)
            } else {
                setLikeUp(true)
            }
        } 
        setCount(res.items.length);
    }

    const getMirrorCount = async () => {
        if (item?.mainPost?.metadata?.media[0]?.original?.mimeType === 'image/jpeg') {
            setFileType("img");
        } else if (item?.mainPost?.metadata?.media[0]?.original?.mimeType === 'video/mp4') {
            setFileType("video");
        } else {
            setFileType("text");
        }

    }
    return (
        <Card >
            <CardHeader
                sx={{ padding: '10px' }}
                avatar={
                    <Avatar
                        onClick={() => handleNavigate(item?.mainPost?.profile?.id)}
                        src={item?.mainPost?.profile?.picture != null ?
                            replaceUrl(item?.mainPost?.profile?.picture?.original?.url) : 'https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF'}
                        aria-label="recipe" />
                }
                title={<span onClick={() => handleNavigate(item?.mainPost?.profile?.id)}>{`@${item?.mainPost?.profile?.name !== null && item?.mainPost?.profile?.name !== "[NULL]" ? item?.mainPost?.profile?.name : item?.mainPost?.profile?.handle}`}</span>}
                subheader={<span>{moment(item?.mainPost?.createdAt, "YYYYMMDD").fromNow()}</span>}

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
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}><IconButton><OutlinedFlagOutlinedIcon style={{ fontSize: "18px" }} /></IconButton><small>Report Post</small></MenuItem>
                <MenuItem onClick={handleClose}><IconButton><CodeOutlinedIcon style={{ fontSize: "18px" }} /></IconButton><small>Embed</small></MenuItem>
            </Menu>
            {
                fileType !== 'text' && <CardMedia
                    component={fileType}
                    image={`${item?.mainPost && replaceUrl(item?.mainPost?.metadata?.media[0]?.original?.url)} `}
                    alt="sfs"
                    autoPlay
                    controls
                />
            }

            <CardContent>
                <Typography variant="body" color="text.secondary">
                    {item?.mainPost && item?.mainPost?.metadata?.content}
                </Typography>
                {
                    fileType === 'text' && <Typography variant="body1" color="text.secondary">
                        {item?.mainPost && item?.mainPost?.metadata?.description}
                    </Typography>
                }
                <Stack direction="row" spacing={1}>
                    <div style={{ width: '100%' }}>
                        {item.mainPost?.tags != [] && item?.mainPost?.metadata?.tags.map((tag, index) => (
                            <span
                                className='m-1 post-tags'
                                key={index}
                            > {`#${tag}`}</span>

                        ))}
                    </div>
                </Stack>
            </CardContent>

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
                </div>

                <div
                    onClick={() => handleShowComment(item?.mainPost.id)}
                    className="d-flex align-items-center"
                    style={{ color: 'white', margin: '0 5px', cursor: 'pointer', fontSize: '15px' }}
                >
                    < ModeCommentOutlinedIcon style={{ fontSize: '15px' }} />  {item && item?.mainPost?.stats?.totalAmountOfComments}
 
                </div>
                <MirrorComponent data={item?.mainPost} updateMirror={updateMirror} setUpdateMirror={setUpdateMirror} />
                <CollectComponent data={item?.mainPost} updateMirror={updateMirror} setUpdateMirror={setUpdateMirror} />
            </CardActions>

            <Divider flexItem orientation="horizontal" style={{ border: '1px solid white' }} />
            <GetCommentByUser id={item.mainPost.id} /> 
        </Card>
    )
}

export default CommentCard

 