import React, { useEffect, useState } from 'react'
import Header from '../header/Header'
import { toast } from 'react-toastify';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Divider, IconButton, InputBase, Skeleton, Typography } from '@mui/material';
import FollowModal from '../modals/FollowModal';
import { follow, unfollow } from '../../lensprotocol/follow/follow';
import { useParams } from 'react-router-dom';
import { profileById } from '../../context/query';
import { LensAuthContext } from '../../context/LensContext';
import ProfileTabs from './ProfileTabs';
import RightNav from '../RightNav';
import UploadModal from '../modals/UploadModal';
import { getComments, posts } from '../../lensprotocol/post/get-post';
import { isFollowProfile } from '../../lensprotocol/follow/FreeFollow';
import UpdateProfile from '../modals/update-profile';
import { profile } from '../../lensprotocol/profile/get-profile';
import { createUnfollowTypdeData } from '../../lensprotocol/follow/create-follow-typed-data';
import { following } from '../../lensprotocol/follow/following';
import { followers } from '../../lensprotocol/follow/follower';



function NewProfile() {
    // const openAndSetOpen = React.useContext(LensAuthContext);
    // const { open, setOpen } = openAndSetOpen;

    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(false);
    const [title, setTitle] = useState("");
    const [data, setData] = useState();
    const [isFl, setIsFl] = React.useState(false);
    const [detail, setDetail] = useState();
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = React.useState(0);
    const [post, setPosts] = useState([]);
    const [displayCmt, setDisplayCmt] = useState([]);
    const [likeUp, setLikeUp] = useState(false);

    const [open, setOpen] = useState(false);
    const lensAuthContext = React.useContext(LensAuthContext);
    const { login, profile, updatePro,
        setUpdatePro } = lensAuthContext;
    const [updateProfile, setUpdateProfile] = useState(false);



    useEffect(() => {
        const getUserData = async () => {
            const dd = await posts(params.id);
            setPosts(dd.data.publications.items);
            const ids = detail != undefined && detail.id;
            const cmt = await getComments(ids);
            setDisplayCmt(cmt);
        }
        getUserData();
    }, [params.id, update])


    useEffect(() => {
        getProfile();
    }, [update, likeUp, params.id, updatePro])


    useEffect(() => {
        getIsFollow();
    }, [data, params.id, update, updatePro])



    async function getIsFollow() {
        if(data){
            const req = [
                {
                    followerAddress: profile.ownedBy,
                    profileId:  data.id
                }
            ];
          const followData = await isFollowProfile(req);
            setIsFl(followData?.data?.doesFollow[0]?.follows);
        }
    }



    async function getProfile() {
        if (params.id) {
            const user = await profileById(params.id); 
            setData(user);
            setFollowingCount(user.stats.totalFollowing);
            setFollowerCount(user.stats.totalFollowers);
        }
    };

    const handleFollow = async (id) => {
        const fId = window.localStorage.getItem("profileId");
        if (!profile) {
            toast.error("Please Login First!");
            return;
        }
        try {
            if (fId != undefined) {
                setLoading(true);
                const data = {
                    id: id,
                    login: login,
                    followId: fId
                }
                var res;
                if (isFl) {
                    res = await unfollow(data);
                } else {
                    res = await follow(data);
                } 
                if (res) {
                    setLoading(false);
                    setUpdate(!update);
                    setUpdatePro(!updatePro);
                }
                await getProfile();
                setLoading(false);
            } else {
                toast.error("Please Login First!")
            }

        } catch (error) {
            toast.error("Error: Something went wrong!")
            setLoading(false);
        }
    }
    const handleClickOpen = (text) => {
        setTitle(text)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
 

    const replaceUrl = (e) => {
        const str = e && e.startsWith("ipfs://");
        if (str) {
            const res = 'https://superfun.infura-ipfs.io/ipfs/' + e.slice(7);
            return res;
        }
        return e;
    }

    const handleUpdateProfile = () => {
        setUpdateProfile(true)
    }

    const handleCloseUpdateProfile = () => {
        setUpdateProfile(false)
    }



    return (
        <>
            {/* <Header />   */}
            <div className='container footer-position' style={{ marginTop: '5%' }}>
                <div className='row'>
                    <div className='col-lg-9 col-md-12 col-sm-12 mt-5 '>
                        {/* {
                            data == undefined && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        } */}

                        {
                            data === undefined && <Box style={{ margin: '10px  ', background: 'rgba(255,255,255,0.1)', padding: '20px' }}>
                                <Skeleton variant="rectangular" width="100%"  sx={{height:'100px'}}/>

                                <div className='text-left' style={{ marginLeft: '5%' }}>
                                    <div className='profile-edit-space'>
                                        <Skeleton variant="rectangular" width="19%"  sx={{border:'3px solid rgba(255,255,255,0.1)',height:'130px',marginTop:' 10px'}} />
                                        <div className=''>
                                        <Skeleton animation="wave"  width="100px" /> 
                                        <Skeleton animation="wave"  width="100px" />  
                                        <Skeleton animation="wave"  width="100px" /> 
                                        </div>
                                    </div>
                                    <h2 className='pt-4' style={{ fontWeight: '500' }}></h2>
                                        <Skeleton animation="wave" /> 
                                        <Skeleton animation="wave" />  
                                        <Skeleton animation="wave" />  

                                </div> 
                            </Box>
                        }
                        <UpdateProfile open={updateProfile} onClose={handleCloseUpdateProfile} />
                        {
                            data && <Box style={{ margin: '10px  ', background: 'rgba(255,255,255,0.1)', padding: '20px' }}>
                                <img className='bg-img' src={data.coverPicture != null ? replaceUrl(data?.coverPicture?.original?.url) : '/assets/bg.png'} width="100" height="100" alt="" />

                                <div className='text-left' style={{ marginLeft: '5%' }}>
                                    <div className='profile-edit-space'>
                                        {
                                            data == undefined ? <Skeleton variant="rectangular" width="29%" height="70" /> :
                                                <img className='profile-picture' src={
                                                    data.picture != null ? replaceUrl(data?.picture?.original?.url) :
                                                        '/assets/bg.png'} style={{ borderRadius: '3%' }} alt="" />
                                        }


                                        <div className='d-sm-block d-xs-block d-flex'>
                                            {
                                                profile.id === data.id && <Button sx={{ margin: '20px 10px 0 0' }}
                                                    onClick={handleUpdateProfile}
                                                    style={{ background: '#9a73c3', color: 'white', textTransform: 'capitalize' }}
                                                > Edit Profile
                                                </Button>
                                            }

                                            <UpdateProfile />
                                            <Button sx={{ margin: '20px 10px 0 0' }}
                                                style={{ background: '#468f72', color: 'white', textTransform: 'capitalize' }}
                                                onClick={() => handleFollow(data.id)}
                                            >{loading ? <CircularProgress size={20} /> : isFl ? "Unfollow" : "Follow"}
                                            </Button>
                                        </div>
                                    </div>
                                    <h2 className='pt-4' style={{ fontWeight: '500' }}>
                                        {data.name ? data.name : data.handle} </h2>
                                    <h6>
                                        {`@${data.handle.trim().toLowerCase()}`} </h6>
                                    <p><small> {data.bio}</small></p>

                                    <div className='d-flex justify-content-start text-left mt-4 mb-4'>
                                        <div className='p-0 m-0' onClick={() => handleClickOpen("Followers")}>
                                            <h4 className='p-0 m-0 '>
                                                {followerCount}
                                            </h4>
                                            <p className='p-0 m-0'>Followers</p>
                                        </div>
                                        <div className='p-0' style={{ marginLeft: '20px' }} onClick={() => handleClickOpen("Following")}>
                                            <h4 className='p-0 m-0 '>
                                                {followingCount} </h4>
                                            <p className='p-0 m-0'>Following</p>
                                        </div>
                                    </div>
                                    {/* <div className='row'>
                                        <div className='col-3'>
                                            <Button
                                                sx={{ margin: '20px 0' }}
                                                variant='outlined'
                                                onClick={() => handleFollow(data.id)}
                                            >{loading ? <CircularProgress /> : isFl == true ? "Follow" : "Followed"}
                                            </Button>
                                        </div> 
                                    </div> */}

                                </div>
                                <FollowModal
                                    data={data} open={open} close={handleClose}
                                    title={title} 
                                />
                                <ProfileTabs state={data.stats} id={params.id} />
                            </Box>
                        }

                    </div>
                    <div className='col-lg-3' style={{ marginTop: "3%" }}>
                        <div className='container'>
                            <RightNav />
                        </div>
                    </div>
                </div>
            </div> 
        </>
    )
}

export default NewProfile;