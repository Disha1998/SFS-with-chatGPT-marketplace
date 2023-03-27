import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Divider, IconButton, Menu, MenuItem, Skeleton } from "@mui/material";
import { Box, Stack } from "@mui/system";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from "react";
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import RightNav from "../../RightNav";
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { useParams } from "react-router-dom";
import { getpublicationById } from "../../../lensprotocol/post/get-publicationById";
import moment from 'moment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { addReactionNft, getReactionsNft, removeReactionNft } from "../../../lensprotocol/MarketPlace/Reaction/addReactionNft";
import { LensAuthContext } from "../../../context/LensContext";
import ChatIcon from '@mui/icons-material/Chat';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

import { createMirrorNft, gaslessMirrorNft } from "../../../lensprotocol/MarketPlace/Mirror/Mirror";
import { CollectItem } from "../../../lensprotocol/MarketPlace/Collect/collect";
import { whoCollected } from "../../../lensprotocol/post/collect/collect";
import CustomizedTables from "./WhoCollectedTable";
import { deletePublicaton } from "../../../lensprotocol/MarketPlace/deletePost/delete-publication-type-data";
import CommentComponentNFT from "../../publications/CommentComponent-NFT";
import { getNFTCommentsByLatest } from "../../../lensprotocol/MarketPlace/getNftPost/GetNftPost";
function NftDetailPage() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [pubData, setPubData] = React.useState(null);
    const [likeUp, setLikeUp] = useState(0);
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login, update, setUpdate } = lensAuthContext;
    const [loading, setLoading] = React.useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [whoCollectData, setWhoCollectData] = useState();
    const [pid, setPid] = useState(pubData?.id);
    const param = useParams();
    const [showComment, setShowComment] = useState(false);
    const [style, setStyle] = useState("");
    const [updateMirror, setUpdateMirror] = useState(false);

    useEffect(() => {

        if (param.id !== null && pubData == null) {
            console.log('in param');
            getPubData(param.id);
        }
        async function getPubData(id) {
            console.log('geting pub data');
            console.log(id);
            let data = await getpublicationById(id);
            console.log(data);

            setPubData(data.data.publication);
            await getReact(id);
            const whoCollecte = await whoCollected(id);
            // console.log(whoCollecte);
            setWhoCollectData(whoCollecte);

            const nftComment = await getNFTCommentsByLatest(id);
            console.log(nftComment, 'nft cmts');

        }

    }, [pid, update])


    const open = Boolean(anchorEl);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const Collect = async () => {
        const profileId = window.localStorage.getItem("profileId");

        const collectData = {
            proId: profileId,
            pubId: pubData.id,
            login: login,
            value: pubData.collectModule.amount.value
        }
        setLoading(true);
        const res = await CollectItem(collectData);
        setUpdate(!update);
        setLoading(false);

        if (res) {
            console.log(res, 'res from collect mod');
        }
    }
    const Mirror = async () => {
        const profileId = window.localStorage.getItem("profileId");
        if (profileId === undefined) {
            console.log('Please Login First!');
            return;
        }

        const mirrorData = {
            login: login,
            proId: profileId,
            pubId: pubData.id,
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
    const getReact = async (id) => {
        // console.log('in react');
        const res = await getReactionsNft(id);

        if (profile) {
            const like = res.items && res.items.filter((e) => e?.profile.id === profile.id);
            if (like.length === 0) {
                setLikeUp(false)
            } else {
                setLikeUp(true)
            }
        }
        setLikeCount(res.items.length);
    }
    const addReactions = async (data) => {
        if (!profile) {
            alert("Please Login First!");
            return;
        }
        const id = window.localStorage.getItem("profileId");
        const pId = data?.id;
        // console.log(pId, 'publish id');
        const dd = {
            id: id,
            address: profile.ownedBy,
            publishId: pId,
            login: login
        }
        let res;
        if (likeUp === false) {
            res = await addReactionNft(dd);
        }
        else {
            res = await removeReactionNft(dd);
        }
        if (res === undefined) {
            setUpdate(!update);
        }
    }

    const handleDeletePublication = async (id) => {
        const dd = {
            id: id,
            address: profile.ownedBy,
            login: login
        }
        const res = await deletePublicaton(dd);
        if (res.data.hidePublication === null) {
            handleClose();
            alert("Post successfully deleted!");
        }
        setUpdate(!update);
        handleClose();
    }
    const handleShowComment = (id) => {
        setStyle(id);
        setShowComment(!showComment);
    };
    return (
        <>
            <Box className='footer-position' sx={{ marginTop: { sx: '20px', sm: '50px', md: '100px' }, marginBottom: { sx: '20px', sm: '50px', md: '100px' } }}>
                <div className='container'>
                    <div className='row mt-5'>

                        <div className='col-12 col-sm-8 col-md-8 col-lg-8' style={{ margin: '10px 0' }}>
                            <Card>
                                <CardHeader
                                    sx={{ padding: '10px' }}
                                    avatar={
                                        <Avatar
                                            src={pubData?.profile?.picture?.original?.url}
                                            // 'https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF'
                                            aria-label="recipe">
                                        </Avatar>
                                    }

                                    title={pubData?.profile?.handle}
                                    subheader=
                                    {<span>{moment(pubData?.createdAt, "YYYYMMDD").fromNow()}</span>}
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
                                    <MenuItem onClick={handleClose}><IconButton><OutlinedFlagOutlinedIcon style={{ fontSize: "18px" }} /></IconButton><small>Report Asset</small></MenuItem>
                                    <MenuItem onClick={handleClose}><IconButton><CodeOutlinedIcon style={{ fontSize: "18px" }} /></IconButton><small>Embed</small></MenuItem>

                                    {
                                        profile?.id === pubData?.profile?.id && <MenuItem onClick={() => handleDeletePublication(pubData.id)}><IconButton><DeleteIcon style={{ fontSize: "18px" }} /></IconButton><small>Delete</small></MenuItem>
                                    }
                                </Menu>

                                <img
                                    style={{ height: "500px", width: "735px" }}
                                    src={pubData?.metadata?.media[0]?.original?.url}>

                                </img>

                                <CardContent >
                                    <span style={{ fontSize: '20px', textTransform: 'capitalize' }}  >
                                        {pubData?.metadata?.content}
                                    </span>
                                    <div>
                                        {
                                            <span style={{ fontSize: '14px' }} className='post-tags text-secondary'   >
                                                {pubData?.metadata?.description}
                                            </span>
                                        }
                                    </div>

                                </CardContent>
                                <Divider flexItem orientation="horizontal" />

                                <div
                                    // style={{marginTop:"-40px"}}
                                    className='d-flex justify-content-around test-class'>

                                    <div>
                                        <p>
                                            {pubData?.stats.totalAmountOfCollects} / {pubData?.collectModule.collectLimit}
                                        </p>
                                        <span>minted</span>
                                    </div>
                                    <Divider orientation="vertical" color="white" flexItem />
                                    <div>
                                        <p>
                                            {pubData?.collectModule?.amount.value}
                                        </p>
                                        <span>Price</span>
                                    </div>
                                    <Divider orientation="vertical" color="white" flexItem />
                                    <div>
                                        <p>
                                            {pubData?.stats?.totalAmountOfCollects}
                                        </p>
                                        <span>Collectors</span>
                                    </div>

                                </div>

                                <CardActions disableSpacing className="justify-content-around mt-3">
                                    <IconButton aria-label="add to favorites"
                                        onClick={() => addReactions(pubData)}
                                    >                                        {
                                            likeUp === 0 ? <FavoriteIcon  style={{fontSize:"20px"}} /> : <FavoriteIcon  style={{fontSize:"20px"}}/>}
                                       <sapn style={{fontSize:"20px"}}>{likeCount}</sapn> 
                                    </IconButton>
                                    <div
                                        onClick={() => handleShowComment(pubData.id)}
                                        className="d-flex align-items-center"
                                        style={{ color: 'white', margin: '0 5px', cursor: 'pointer', fontSize: '15px' }}
                                    >
                                        < ModeCommentOutlinedIcon style={{ fontSize: '20px' }} />
                                        <span style={{ fontSize: '20px' }}>
                                            {pubData && pubData?.stats?.totalAmountOfComments}
                                        </span>
                                    </div>
                                    <IconButton onClick={Mirror}>
                                        {likeUp === 0 ? <SwapHorizIcon  style={{fontSize:"20px"}} /> : <SwapHorizIcon  style={{fontSize:"20px"}} />}{pubData?.stats?.totalAmountOfMirrors}
                                    </IconButton>

                                    <IconButton onClick={Collect}>
                                        {likeUp === 0 ? <img
                                            src='https://superfun.infura-ipfs.io/ipfs/QmWimuRCtxvPhruxxZRBpbWoTXK6HDvLZkrcEPvaqyqegy' alt='bg' width="22" />
                                            : <img src='https://superfun.infura-ipfs.io/ipfs/QmWimuRCtxvPhruxxZRBpbWoTXK6HDvLZkrcEPvaqyqegy'
                                                alt='bg' width="22" />}
                                       <sapn style={{fontSize:"20px"}}> {pubData?.stats?.totalAmountOfCollects}</sapn>  
                                    </IconButton>

                                </CardActions>

                                <Divider flexItem orientation="horizontal"
                                    style={{ border: '1px solid white' }} />
                                <div>
                                    {
                                        showComment &&
                                        <CommentComponentNFT
                                            show={showComment}
                                            profile={profile}
                                            data={pubData}
                                            updateMirror={updateMirror}
                                            setUpdateMirror={setUpdateMirror} />}
                                </div>

                            </Card>

                            <Box sx={{ width: '100%', height: 'auto', overflowY: 'scroll', marginTop: '4%' }}>
                            </Box>

                        </div>

                        <div className='col-12 col-sm-4 col-md-4 col-lg-4' >
                            <div style={{ maxWidth: "100%", marginBottom: "32px" }}>
                                <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-1vyqpux"
                                    style={{ borderRadius: "10px 10px 0px 0px", borderStyle: "solid", borderColor: "rgb(85, 85, 85)", borderWidth: "1px", width: "300px", maxWidth: "100%", marginLeft: "20px", marginRight: "20px", marginTop: "20px", padding: "10px" }}
                                >
                                    <div className="row MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2 css-isbt42">
                                        <div className=" col-8 MuiGrid-root MuiGrid-item MuiGrid-grid-xs-8 css-45ujxc">
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <div>
                                                    <p style={{ margin: "10px", fontSize: "14px", fontWeight: "bold", color: "rgb(119, 119, 119)" }}>
                                                        Collect Type:
                                                    </p>
                                                    <p style={{ margin: "0px 10px 10px", paddingTop: "0px", fontSize: "14px", color: "rgb(255, 255, 255)", fontWeight: "bold" }}>
                                                        Limited Fee Collect
                                                    </p>
                                                    <p style={{ margin: "20px 10px 10px", fontSize: "14px", fontWeight: "bold" }}>
                                                        <span style={{ color: "rgb(119, 119, 119)" }}>
                                                            Price :
                                                        </span> {pubData?.collectModule.amount.value}  WMATIC

                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-4 MuiGrid-root MuiGrid-item MuiGrid-grid-xs-4 css-1udb513"
                                            style={{ display: "flex", justifyContent: "left", alignItems: "center" }}
                                        >

                                            {loading ?
                                                <button
                                                    onClick={Collect}
                                                    className="MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeMedium MuiButton-outlinedSizeMedium MuiButtonBase-root  css-10n5c4h"
                                                    tabIndex="0"
                                                    type="button"
                                                    style={{ textTransform: "none", height: "40px", backgroundColor: "rgb(22, 178, 26)", borderColor: "rgb(22, 178, 26)", color: "rgb(255, 255, 255)", fontWeight: "bold", borderRadius: "10px", borderStyle: "none", width: "65px", boxShadow: "rgb(68, 68, 68) 0px 1px 10px" }}
                                                >
                                                    <CircularProgress style={{ color: 'white', fontSize: "11px" }} />

                                                    <span className="MuiTouchRipple-root css-w0pj6f"></span>
                                                </button> :
                                                <button
                                                    onClick={Collect}
                                                    className="MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeMedium MuiButton-outlinedSizeMedium MuiButtonBase-root  css-10n5c4h"
                                                    tabIndex="0"
                                                    type="button"
                                                    style={{ textTransform: "none", height: "40px", backgroundColor: "rgb(22, 178, 26)", borderColor: "rgb(22, 178, 26)", color: "rgb(255, 255, 255)", fontWeight: "bold", borderRadius: "10px", borderStyle: "none", boxShadow: "rgb(68, 68, 68) 0px 1px 10px" }}
                                                >
                                                    Collect
                                                    <span className="MuiTouchRipple-root css-w0pj6f"></span>
                                                </button>
                                            }

                                        </div>
                                    </div>
                                </div>
                                <div className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-1vyqpux"
                                    style={{ borderRadius: "0px 0px 10px 10px", borderStyle: "none solid solid", borderColor: "rgb(85, 85, 85)", borderWidth: "1px", width: "300px", maxWidth: "90%", marginLeft: "20px", marginRight: "20px", marginTop: "0px", padding: "10px" }}
                                >
                                    <div className="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2 css-isbt42">
                                        <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 css-15j76c0">
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <div>
                                                    <p style={{ margin: "10px", fontSize: "14px", fontWeight: "bold", color: "rgb(119, 119, 119)" }}>
                                                        Creator Royalty
                                                    </p>
                                                    <p style={{ margin: "10px", fontSize: "14px", fontWeight: "bold" }}>
                                                        10% of trading sales


                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <RightNav />
                        </div>


                        <div className="col-12 col-sm-8 col-md-8 col-lg-8">
                            <h3 style={{ marginBottom: "22px", marginTop: "22px" }}>Post Activity</h3>
                            <CustomizedTables data={whoCollectData?.whoCollectedPublication?.items} price={pubData?.collectModule.amount.value} />
                        </div>

                    </div>
                </div>
            </Box>

        </ >
    )
}

export default NftDetailPage;