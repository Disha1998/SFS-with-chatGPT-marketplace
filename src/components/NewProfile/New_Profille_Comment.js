import { Send } from '@mui/icons-material';
import { Avatar, Card, Button, CardActions, Input, CardContent, CardHeader, CardMedia, CircularProgress, Divider, IconButton, InputBase, Typography, ImageListItem, ImageList, useMediaQuery } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { postsByComment } from '../../lensprotocol/post/get-post';
import CollectComponent from '../publications/CollectComponent';
import MirrorComponent from '../publications/MirrorComponent';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import Profile_Likes from '../profile/Profile_Likes';
import { Box } from '@mui/system';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import SwapHorizSharpIcon from '@mui/icons-material/SwapHorizSharp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import { styled, useTheme } from '@mui/material/styles';
import useInfiniteScroll from '../useInfiniteScroll';
import PostCard from '../Cards/PostCard';
import CommentCard from '../Cards/CommentCard';
import LoadingCard from '../assets/SkeletonCard';



function New_Profile_Comment({ id }) {
    const theme = useTheme();
    const params = useParams();
    const greaterThanMid = useMediaQuery(theme.breakpoints.up("md"));
    const smallToMid = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const lessThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const xsmall = useMediaQuery(theme.breakpoints.down("xs"));

    const [showComment, setShowComment] = useState(false);
    const [comment, setComments] = React.useState("");
    const [loading, setLoading] = useState(false);

    const [Items, setItems] = useState([]);

    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState("{\"timestamp\":1,\"offset\":0}");
    const [HasMore, setHasMore] = useState(true);
    const [lastElementRef] = useInfiniteScroll(
        HasMore ? loadMoreItems : () => { },
        isFetching
    );
    React.useEffect(() => {
        loadMoreItems();
    }, [])

    useEffect(()=>{
        setItems([])
    },[params.id])



    async function loadMoreItems() {
        setIsFetching(true);
        const results = await postsByComment(page, id).then((res) => {
            setItems((prevTitles) => {
                return [...new Set([...prevTitles, ...res.data.publications.items.map((b) => b)])];
            });
            setPage(res.data.publications.pageInfo.next);
            setHasMore(res.data.publications.items.length > 0);
            setIsFetching(false);
        })
            .catch((e) => {
                console.log(e);
            });
    }

    const skele = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
        <Box sx={{ width: '100%', height: 'auto', overflowY: 'scroll', marginTop: '3%' }}>
            <ImageList variant="masonry" cols={greaterThanMid && 2 || smallToMid && 2 || lessThanSmall && 1 || xsmall && 1} gap={16}>

                {
                    isFetching && skele.map((e, i) => {
                        return (
                            <LoadingCard key={i} data={e} />
                        )
                    })
                }
                {
                    Items.length === 0 && <h4>No data Available</h4>
                }
                {
                    Items && Items.map((item, i) => {
                        return (
                            <ImageListItem
                                ref={lastElementRef}
                                key={i}
                                style={{ cursor: 'pointer' }}
                            >
                                <CommentCard item={item} />
                            </ImageListItem>
                        )
                    })
                }
            </ImageList>
        </Box>
    )
}

export default New_Profile_Comment;