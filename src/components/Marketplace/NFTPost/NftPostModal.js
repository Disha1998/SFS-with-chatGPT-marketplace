import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LensAuthContext } from '../../../context/LensContext';
import { addReactionNft, getReactionsNft, removeReactionNft } from '../../../lensprotocol/MarketPlace/Reaction/addReactionNft';
import { DoCommentNft, commentGaslessNft } from '../../../lensprotocol/MarketPlace/Comment/DoComment';
import DeleteIcon from '@mui/icons-material/Delete';
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';

import { Button, CardContent, Dialog, DialogActions, DialogContent, TextField, Card, CardHeader, CardActions, IconButton, Typography, Grid, Box, Accordion, AccordionSummary, AccordionDetails, Menu, MenuItem, Avatar, Divider, CircularProgress, CardMedia } from '@mui/material';
import DisplayComments from '../comment/DisplayComment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { createMirrorNft, gaslessMirrorNft } from '../../../lensprotocol/MarketPlace/Mirror/Mirror';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ReporrtModal from '../ReportPost/report-modal';
import { deletePublicaton } from '../../../lensprotocol/MarketPlace/deletePost/delete-publication-type-data';
import { CollectItem } from '../../../lensprotocol/MarketPlace/Collect/collect';
import ReportModal from '../ReportPost/report-modal';
import { Stack } from 'react-bootstrap';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import MirrorComponent from '../../../components/publications/MirrorComponent';
import CollectComponent from '../../../components/publications/CollectComponent';
import CommentComponent from '../../publications/CommentComponent';
import SwapHorizSharpIcon from '@mui/icons-material/SwapHorizSharp';
import CommentComponentNFT from '../../publications/CommentComponent-NFT';


export default function DisplayPublications({ pub }) {
    const [pid, setPid] = useState(pub?.id);
    const [likeCount, setLikeCount] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [likeUp, setLikeUp] = useState(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openReport, setOpenReport] = useState(false);
    const [fileType, setFileType] = useState("img")
    const [count, setCount] = useState(0);
    const [style, setStyle] = useState("");
    const [showComment, setShowComment] = useState(false);
    const [updateMirror, setUpdateMirror] = useState(false);
    const [comment, setComments] = useState("");
    const [displayCmt, setDisplayCmt] = useState([]);
    const [updateLike, setUpdateLike] = useState(false);




    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login, update, setUpdate } = lensAuthContext;
    useEffect(() => {
        getReact(pid);
    }, [pid, update])

    const oppen = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCllose = () => {
        setAnchorEl(null);
    };



    const Mirror = async () => {
        const profileId = window.localStorage.getItem("profileId");
        if (profileId === undefined) {
            console.log('Please Login First!');
            return;
        }
        setLoading(true);

        const mirrorData = {
            login: login,
            proId: profileId,
            pubId: pub.id,
        }
        let res;
        if (profile?.dispatcher?.canUseRelay) {
            res = await gaslessMirrorNft(mirrorData);
        } else {
            res = await createMirrorNft(mirrorData);
        }
        if (res) {
            console.log(res, 'cmnt response');
        }
        setUpdate(!update);

    }


    const Collect = async () => {
        const profileId = window.localStorage.getItem("profileId");

        const collectData = {
            proId: profileId,
            pubId: pub.id,
            login: login,
            value: pub.collectModule.amount.value
        }
        const res = await CollectItem(collectData);
        setUpdate(!update);
        if (res) {
            console.log(res, 'res from collect mod');
        }
    }

    const addReactions = async (data) => {
        if (!profile) {
            return;
        }
        const id = window.localStorage.getItem("profileId");
        const pId = data?.id;
        console.log(pId, 'publish id');
        const dd = {
            id: id,
            address: profile.ownedBy,
            publishId: pId,
            login: login
        }

        let response = await getReactionsNft(pId);
        console.log(response?.items);
        let isLiked = response?.items.filter((e) => e.profile?.id === profile.id)
        console.log(isLiked, 'is it');

        let res;
        if (isLiked.length === 0) {
            res = await addReactionNft(dd);
            console.log('---add like---');
        } else {
            res = await removeReactionNft(dd);
            console.log('---remove like---');
        }
        // setPid(pId);
        // setUpdateLike(!updateLike)
                await getReact(pId);

    }
    const getReact = async (dip) => {
        const res = await getReactionsNft(dip);
console.log('pid in get react',dip);
        if (profile) {
            const like = res.items && res.items.filter((e) => e?.profile.id === profile.id);
            if (like.length === 0) {
                setLikeUp(false)
            } else {
                setLikeUp(true)
            }
        }
        console.log(res.items.length);
        setLikeCount(res.items.length);
    }



    const handleShowComment = (id) => {
        setStyle(id);
        setShowComment(!showComment);
    };


    return (
        <>

            <div className='container' style={{ position: "unset" }}>
                <Card style={{ borderRadius: "16px" }} className='mainCard mt-4' key={pub.id}>

                    <CardHeader

                        avatar={
                            <img style={{ height: "55px", width: "55px", borderRadius: "50%" }}
                                src={pub?.profile?.picture?.original?.url}
                                alt="new"
                            />}
                        action={
                            <IconButton aria-label="settings"
                                id="basic-button"
                                aria-controls={oppen ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={oppen ? 'true' : undefined}
                                onClick={handleClick}
                            >

                                {/* <MoreVertIcon /> */}
                            </IconButton>

                        }
                        title={pub?.profile?.handle}
                        subheader={pub?.profile?.ownedBy?.slice(1, 10)}
                    />
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={oppen}
                        onClose={handleCllose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <ReporrtModal pubId={pub.id}
                            data={pub}
                        />
                    </Menu>
                    <img style={{ height: "auto", width: '100%', padding: "0px 10px 10px 10px", borderRadius: "25px" }} src={pub?.metadata?.media[0]?.original?.url} ></img>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            <span style={{
                                fontSize: '16px',
                                textTransform: 'capitalize'
                            }}><b>{pub?.metadata?.content}</b></span>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <p>{pub?.metadata?.description}</p>
                        </Typography>
                    </CardContent>

                    <Link to={`/detail/${pub.id}`} >

                        <div
                            style={{ marginTop: "-40px" }}
                            className='d-flex justify-content-around test-class'>

                            <div>
                                <p>{pub.stats.totalAmountOfCollects} / {pub.collectModule.collectLimit}</p>
                                <span>minted</span>
                            </div>
                            <Divider orientation="vertical" color="white" flexItem />
                            <div>
                                <p>{pub.collectModule.amount.value}</p>
                                <span>Price</span>
                            </div>
                            <Divider orientation="vertical" color="white" flexItem />
                            <div>
                                <p>{pub.stats.totalAmountOfCollects}</p>
                                <span>Collectors</span>
                            </div>

                        </div>
                    </Link>


                    <CardActions disableSpacing className="d-flex justify-content-around mb-3">
                        <div
                            className="d-flex align-items-center"
                            style={{ color: 'white', margin: '0 5px', cursor: 'pointer', fontSize: '15px' }}
                            onClick={() => addReactions(pub)}
                        >
                            {
                                likeUp === 0 ? <FavoriteBorderIcon style={{ fontSize: '15px' }} /> : <FavoriteIcon style={{ fontSize: '15px' }} />
                            }
                            {likeCount}
                        </div>

                        <div
                            onClick={() => handleShowComment(pub.id)}
                            className="d-flex align-items-center"
                            style={{ color: 'white', margin: '0 5px', cursor: 'pointer', fontSize: '15px' }}
                        >
                            < ModeCommentOutlinedIcon style={{ fontSize: '15px' }} />  {pub && pub.stats.totalAmountOfComments}

                        </div>


                        <IconButton onClick={Mirror}
                            style={{ color: 'white', margin: '0 5px', cursor: 'pointer', fontSize: '15px' }}

                        >
                            {likeUp === 0 ? <SwapHorizSharpIcon /> : <SwapHorizSharpIcon />}
                            {pub?.stats?.totalAmountOfMirrors}
                        </IconButton>

                        <IconButton onClick={Collect}
                            style={{ color: 'white', margin: '0 5px', cursor: 'pointer', fontSize: '15px' }}

                        >
                            {likeUp === 0 ? <img src='https://superfun.infura-ipfs.io/ipfs/QmWimuRCtxvPhruxxZRBpbWoTXK6HDvLZkrcEPvaqyqegy' alt='bg' width="15" /> : <img src='https://superfun.infura-ipfs.io/ipfs/QmWimuRCtxvPhruxxZRBpbWoTXK6HDvLZkrcEPvaqyqegy' alt='bg' width="15" />}
                            {pub?.stats?.totalAmountOfCollects}
                        </IconButton>

                    </CardActions>
                    <Divider flexItem orientation="horizontal" style={{ border: '1px solid gray', marginBottom: "-15px" }} />
                    {
                        showComment && style === pub.id && <CommentComponentNFT show={showComment} profile={profile} data={pub} updateMirror={updateMirror} setUpdateMirror={setUpdateMirror} />
                    }
                </Card>
            </div>

        </>
    );
}