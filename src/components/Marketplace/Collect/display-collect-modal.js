import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
impotr lensAuthContext
import { addReactionNft,getReactionsNft,removeReactionNft } from '../../../lensprotocol/MarketPlace/Reaction/addReactionNft';
import { commentGaslessNft,DoCommentNft } from '../../../lensprotocol/MarketPlace/Comment/DoComment';
import { Button, CardContent, Dialog, DialogActions, DialogContent, TextField, Card, CardHeader, CardActions, IconButton, Typography, Grid, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import DisplayComments from '../comment/DisplayComment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { createMirrorNft,gaslessMirrorNft } from '../../../lensprotocol/MarketPlace/Mirror/Mirror';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CollectItem } from '../../../lensprotocol/MarketPlace/Collect/collect';

export default function CollectModal({ pub }) {
    const [update, setUpdate] = useState(false);
    const [pid, setPid] = useState(pub?.id);
    const [comment, setComment] = useState("");
    const [likeCount, setLikeCount] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [likeUp, setLikeUp] = useState(0);
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login } = lensAuthContext;

    useEffect(() => {
        getReact();
    }, [pid, update])

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const Collect = async ()=> {
        const profileId = window.localStorage.getItem("profileId");

        const collectData = {
            proId: profileId,
            pubId: pub.id,
            login: login,
        }
        const res = await CollectItem(collectData);
        setUpdate(!update);
        if(res){
            console.log(res,'res from collect mod');
        }
    }

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
            pubId: pub.id
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
                pubId: pub.id
            }
            let res;
            if(profile?.dispatcher?.canUseRelay) {
                console.log('gasless');
                res = await commentGasless(commentData);
                setUpdate(!update)
                handleClose();
            }else{
                res = await DoComment(commentData)
                setUpdate(!update)
                handleClose();
            }
        }
    }


    const addReactions = async (data) => {
        if (!profile) {
            alert("Please Login First!");
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
        let res;
        if (likeUp === false) {
            res = await addReactionNft(dd);
        }
        else {
            res = await removeReactionNft(dd);
            console.log('res--removeReaction', res);
        }
        if (res === undefined) {
            setUpdate(!update);
        }
    }
    const getReact = async () => {
        const res = await getReactionsNft(pid);

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
    return (
        <>
            <Box >
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                    <div >
                        <Grid item xs={2} sm={4} md={4}>
                            <Card style={{ marginTop: "120%", width: "20vw", height: "100%", margin: "30px" }}  >
                                <CardHeader

                                    avatar={
                                        <img style={{ height: "70px", width: "70px", borderRadius: "50%" }}
                                            src={pub?.profile?.picture?.original?.url}
                                            alt="new"
                                        />}
                                    action={
                                        <IconButton aria-label="settings">

                                            <MoreVertIcon />
                                        </IconButton>}
                                    title={pub?.profile?.handle}
                                    subheader={pub?.profile?.ownedBy?.slice(1, 10)}
                                />                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        <h2>{pub?.metadata?.content}</h2>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <h2>{pub?.metadata?.description}</h2>
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to favorites"
                                        onClick={() => addReactions(pub)}
                                    >                                        {
                                            likeUp === 0 ? <FavoriteIcon /> : <FavoriteIcon />}
                                        {pub?.stats?.totalUpvotes}
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <div>
                                            <IconButton onClick={handleClickOpen}>
                                                {
                                                    likeUp === 0 ? <ChatIcon /> : <ChatIcon />}{pub?.stats?.totalAmountOfComments}
                                            </IconButton>
                                            <Dialog open={open} onClose={handleClose}>
                                                <DialogContent>
                                                    <TextField
                                                        onChange={(e) => setComment(e.target.value)}
                                                        autoFocus
                                                        margin="dense"
                                                        id="name"
                                                        label="Write a comment"
                                                        type="text"
                                                        fullWidth
                                                    />
                                                </DialogContent>
                                                <DialogActions>

                                                    <Button onClick={commentUpload}>Send
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </div>
                                    </IconButton>
                                    <IconButton onClick={Mirror}>
                                        {
                                            likeUp === 0 ? <SwapHorizIcon /> : <SwapHorizIcon />}{pub?.stats?.totalAmountOfMirrors}
                                    </IconButton>
                                    <IconButton onClick={Collect}>
                                    {likeUp === 0 ? <AddCircleOutlineIcon /> : <AddCircleOutlineIcon />}{pub?.stats?.totalAmountOfCollects}
                                    </IconButton>
                                </CardActions>
                                <DisplayComments pubId={pub.id} />
                            </Card>
                        </Grid>
                    </div>
                </Grid>
            </Box>
        </>
    );
}