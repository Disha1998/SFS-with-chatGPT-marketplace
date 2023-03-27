import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, CircularProgress, Divider, IconButton, ImageList, ImageListItem, Input, InputBase, Menu, MenuItem, Skeleton, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../header/Header';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';

import { Send } from '@mui/icons-material';
import { LensAuthContext } from '../../context/LensContext';
import { createComment, createCommentByDis } from '../../lensprotocol/post/comments/create-comment';
import { toast } from 'react-toastify';
import { getPublicationByLatest, getPublicationByUser } from '../../lensprotocol/post/explore/explore-publications';
import { getComments, posts } from '../../lensprotocol/post/get-post';
import { getpublicationById } from '../../lensprotocol/post/get-publicationById';
import { addReaction, getReactions, removeReaction } from '../../lensprotocol/reactions/add-reaction';
import { getLikes } from '../../lensprotocol/reactions/get-reactions';
import MirrorComponent from '../publications/MirrorComponent';
import CollectComponent from '../publications/CollectComponent';
import { whoCollected } from '../../lensprotocol/post/collect/collect';
import { useTheme } from '@mui/system';
import useInfiniteScroll from '../useInfiniteScroll';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RightNav from '../RightNav';
import moment from 'moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import ProfileCard from '../Cards/ProfileCard';
import CommentComponent from '../publications/CommentComponent';
import PostCard from '../Cards/PostCard';


function TrendingDetails() {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [showComment, setShowComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const lensAuthContext = React.useContext(LensAuthContext);
  const [count, setCount] = useState(0);
  const [fileType, setFileType] = useState("img")
  const [style, setStyle] = useState("");
  const [updateMirror, setUpdateMirror] = useState(false);

  const [posts, setPosts] = useState([]);
  const [displayCmt, setDisplayCmt] = useState([]);
  // const [update, setUpdate] = useState(false);
  const [likeUp, setLikeUp] = useState(0);
  const { profile, userAdd, loginCreate, login, update, setUpdate } = lensAuthContext;

  const theme = useTheme();
  const greaterThanMid = useMediaQuery(theme.breakpoints.up("md"));
  const smallToMid = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const lessThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const xsmall = useMediaQuery(theme.breakpoints.down("xs"));


  const param = useParams();

  async function get_posts() {
    try {
      const pst = await getpublicationById(param.id);
      setData(pst.data.publication);
      if (pst.data.publication?.metadata?.media[0]?.original?.mimeType === 'image/jpeg') {
        setFileType("img");
      } else if (pst.data.publication?.metadata?.media[0]?.original?.mimeType === 'video/mp4') {
        setFileType("video");
      } else {
        setFileType("text");
      }
      const d = await getPublicationByLatest();
      setPosts(d.data.explorePublications.items);

    } catch (error) {
      toast.error(error);
    }

  }


  useEffect(() => {
    setTimeout(() => {
      getComm();
      get_posts();
      getLikeUp();
    }, 1000)
  }, [param.id, update, data, loading])

  const handleNavigate = (data) => {
    navigate(`/trendingDetails/${data.id}`);
    setPid(data.id);
  }

  async function getLikeUp() {
    const cId = data !== undefined && data?.id;

  }

  const handleShowComment = (id) => {
    setStyle(id)
    setShowComment(!showComment);
  };
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState("{\"timestamp\":1,\"offset\":0}");
  const [HasMore, setHasMore] = useState(true);
  const [pid, setPid] = useState(data?.id === undefined ? param.id : data?.id);


  const [lastElementRef] = useInfiniteScroll(
    HasMore ? loadMoreItems : () => { },
    isFetching
  );

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    loadMoreItems();
    getReact();
    getComm();
  }, [pid, update, loading])


  async function loadMoreItems() {
    setIsFetching(true);
    const results = await getPublicationByUser(page).then((res) => {
      setPosts((prevTitles) => {
        return [...new Set([...prevTitles, ...res.data.explorePublications.items.map((b) => b)])];
      });
      setPage(res.data.explorePublications.pageInfo.next);
      setHasMore(res.data.explorePublications.items.length > 0);
      setIsFetching(false);
    })
      .catch((e) => {
        console.log(e);
      });
  }



  async function getComm() {

    let arr = [];
    const cmt = await getComments(param.id);
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

  const handleNav = (dd) => {
    navigate(`/newprofile/${dd}`)
  }


  const addReactions = async (data) => {
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
    const like = res.items && res.items.filter((e) => e.profile.id === profile.id);
    if (like.length === 0) {
      setLikeUp(false)
    } else {
      setLikeUp(true)
    }
    setCount(res.items.length);
  }

  const replaceUrl = (e) => {
    const str = e && e.startsWith("ipfs://");
    if (str) {
      const res = 'https://superfun.infura-ipfs.io/ipfs/' + e.slice(7);
      return res;
    }
    return e;
  }

  return (
    <>
      <Box className='footer-position' sx={{ marginTop: { sx: '20px', sm: '50px', md: '100px' }, marginBottom: { sx: '20px', sm: '50px', md: '100px' } }}>
        {/* <Search /> */}
        <div className='container'>
          {/* <div className='row mt-5'> */}
          <div className='row mt-5'>

            {
              data == undefined &&
              <div className='col-12 col-sm-8 col-md-8 col-lg-8' style={{ margin: '10px 0' }}>
                {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box> */}

                <Card sx={{ m: 2 }}>
                  <CardHeader
                    avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />
                    }
                    title={<Skeleton
                      animation="wave"
                      height={10}
                      width="80%"
                      style={{ marginBottom: 6 }}
                    />
                    }
                    subheader={<Skeleton animation="wave" height={10} width="40%" />}
                  />
                  <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
                  <CardContent>
                    <React.Fragment>
                      <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                      <Skeleton animation="wave" height={10} width="80%" />
                    </React.Fragment>

                  </CardContent>
                </Card>
              </div>
            } 
            {
              data &&
              <div className='col-12 col-sm-8 col-md-8 col-lg-8' style={{ margin: '10px 0' }}>
                <Card>
                  <CardHeader
                    sx={{ padding: '10px' }}
                    avatar={
                      <Avatar
                        src={data != undefined &&
                          data?.profile?.picture != null ?
                          replaceUrl(data?.profile?.picture?.original?.url) : 'https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF'} aria-label="recipe">

                      </Avatar>
                    }

                    title={<span onClick={() => handleNav(data && data.__typename === "Comment" ? data?.mainPost?.profile?.id : data?.profile?.id)}>
                      {data && data.__typename === "Comment" ? data?.mainPost?.metadata?.name : data?.metadata?.name}
                    </span>}
                    subheader={<span>{moment(data.__typename === "Comment" ? data?.mainPost?.createdAt : data?.createdAt, "YYYYMMDD").fromNow()}</span>}
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
                    <MenuItem onClick={handleClose}><IconButton><OutlinedFlagOutlinedIcon style={{ fontSize: "18px" }} /></IconButton><small>Report Post</small></MenuItem>
                    <MenuItem onClick={handleClose}><IconButton><CodeOutlinedIcon style={{ fontSize: "18px" }} /></IconButton><small>Embed</small></MenuItem>
                  </Menu>

                  {
                    fileType !== 'text' && <CardMedia
                      component={fileType}
                      image={`${data.mainPost ? replaceUrl(data?.mainPost?.metadata?.media[0]?.original?.url) : replaceUrl(data?.metadata?.media[0]?.original?.url)} `}
                      alt="sfs"
                      autoPlay
                      controls
                      sx={{ objectFit: 'fill', maxHeight: { xs: ' 250px', sm: '300px', md: '320px', lg: '500px' } }}
                    />
                  }

                  <CardContent >
                    <span style={{ fontSize: '20px', textTransform: 'capitalize' }}  >
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
                  <CardActions disableSpacing>
                    <div
                      className="d-flex align-items-center"
                      style={{ color: 'white', margin: '0 15px', cursor: 'pointer' }}
                      onClick={() => addReactions(data)}
                    >
                      {
                        likeUp == 0 ? <FavoriteBorderIcon /> : <FavoriteIcon />
                      }
                      {count}
                    </div>

                    <div
                      onClick={() => handleShowComment(data.id)}
                      className="d-flex align-items-center"
                      style={{ color: 'white', margin: '0 15px', cursor: 'pointer' }}
                    >
                      < ModeCommentOutlinedIcon />  {data && data.stats.totalAmountOfComments}

                    </div>
                    <MirrorComponent data={data} updateMirror={update} setUpdateMirror={setUpdate} />
                    <CollectComponent data={data} updateMirror={update} setUpdateMirror={setUpdate} />
                  </CardActions>
                  <Divider flexItem orientation="horizontal" style={{ border: '1px solid white' }} />
                  {
                    showComment && style === data.id && <CommentComponent show={showComment} profile={profile} data={data} updateMirror={update} setUpdateMirror={setUpdateMirror} />
                  }
                </Card>

                <Box sx={{ width: '100%', height: 'auto', overflowY: 'scroll', marginTop: '4%' }}>
                  <ImageList variant="masonry" cols={greaterThanMid && 3 || smallToMid && 2 || lessThanSmall && 1 || xsmall && 1} gap={16}>
                    {
                      posts && posts.map((item, i) => {
                        return (
                          <ImageListItem
                            ref={lastElementRef}
                            key={i}
                            style={{ cursor: 'pointer' }}
                          >
                            <PostCard item={item} />
                          </ImageListItem>
                        )
                      })
                    }
                  </ImageList>
                </Box>

              </div>
            }
            <div className='col-12 col-sm-4 col-md-4 col-lg-4' >
              <RightNav />
            </div>
          </div>
        </div>
      </Box>

    </ >
  )
}

export default TrendingDetails