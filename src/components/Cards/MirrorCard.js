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
import { toast } from 'react-toastify';

function MirrorCard({ item }) {
    const navigate = useNavigate();
    const [style, setStyle] = useState("");
    const [showComment, setShowComment] = useState(false);
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login } = lensAuthContext;
    const [count, setCount] = useState(0);
    const [likeUp, setLikeUp] = useState(0);
    const [pid, setPid] = useState(item?.mirrorOf.id);
    const [update, setUpdate] = useState(false);
    const [updateMirror, setUpdateMirror] = useState(false);
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
        if (!profile) {
            toast.error("Please Login first!");
            return;
        }
        const id = window.localStorage.getItem("profileId");
        const pId = data && data?.mirrorOf?.id;
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
            const like = res.items && res.items.filter((e) => e?.profile?.id === profile?.id);
            if (like.length === 0) {
                setLikeUp(false)
            } else {
                setLikeUp(true)
            }
        }
        setCount(res.items.length);
    }

    const getMirrorCount = async () => {
        if (item.publication?.mirrorOf?.media[0]?.original?.mimeType === 'image/jpeg') {
            setFileType("img");
        } else if (item.publication?.mirrorOf?.media[0]?.original?.mimeType === 'video/mp4') {
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
                        onClick={() => handleNavigate(item?.profile?.id)}
                        src={`${item?.mirrorOf?.profile?.picture != null ? replaceUrl(item?.mirrorOf?.profile?.picture?.original?.url) : "https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF"} `}
                        alt={item?.mirrorOf ? item?.mirrorOf?.metadata?.name : item?.metadata?.name}
                        aria-label="recipe" />
                }
                title={<span onClick={() => handleNavigate(item?.mirrorOf?.profile?.id)}>{`@${item?.mirrorOf?.profile?.name !== null && item?.mirrorOf?.profile?.name !== "[NULL]" ? item?.mirrorOf?.profile?.name : item?.mirrorOf?.profile?.handle}`}</span>}
                subheader={<span>{moment(item?.mirrorOf?.createdAt, "YYYYMMDD").fromNow()}</span>}

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
                    image={`${item.mirrorOf ? replaceUrl(item?.mirrorOf?.metadata?.media[0]?.original?.url) : replaceUrl(item?.metadata?.media[0]?.original?.url)} `}
                    alt="sfs"
                    autoPlay
                    controls
                />
            }

            <CardContent>
                <span style={{ fontSize: '20px', textTransform: 'capitalize' }}  >
                    {item.mirrorOf ? item?.mirrorOf?.metadata?.content : item?.metadata?.content}
                </span>
                <div>
                    {
                        fileType === 'text' && <span style={{ fontSize: '14px' }} className='post-tags text-secondary'   >
                            {item.mirrorOf ? item?.mirrorOf?.metadata?.description : item?.metadata?.description}
                        </span>
                    }
                </div>
                <Stack direction="row" spacing={1}>
                    <div style={{ width: '100%' }}>
                        {item.mirrorOf?.tags != [] && item?.mirrorOf?.metadata?.tags.map((tag, index) => (
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
                    onClick={() => addReactions(item)}
                >
                    {
                        likeUp == 0 ? <FavoriteBorderIcon style={{ fontSize: '15px' }} /> : <FavoriteIcon style={{ fontSize: '15px' }} />
                    }
                    {count}
                    {/* <span className="d-none-xss m-1">Likes</span> */}
                </div>

                <div
                    onClick={() => handleShowComment(item.id)}
                    className="d-flex align-items-center"
                    style={{ color: 'white', margin: '0 5px', cursor: 'pointer', fontSize: '15px' }}
                >
                    < ModeCommentOutlinedIcon style={{ fontSize: '15px' }} />  {item && item?.mirrorOf?.stats.totalAmountOfComments}

                    {/* <span className="d-none-xss m-1">Comment</span> */}
                </div>
                <MirrorComponent data={item.mirrorOf} updateMirror={updateMirror} setUpdateMirror={setUpdateMirror} />
                <CollectComponent data={item.mirrorOf} updateMirror={updateMirror} setUpdateMirror={setUpdateMirror} />
            </CardActions>

            <Divider flexItem orientation="horizontal" style={{ border: '1px solid white' }} />
            {
                showComment && style === item.id && <CommentComponent show={showComment} profile={profile} data={item.mirrorOf} updateMirror={updateMirror} setUpdateMirror={setUpdateMirror} />
            }
        </Card>
    )
}

export default MirrorCard