import * as React from 'react';
import { useState } from 'react';
import { Button, CircularProgress, ImageList, ImageListItem, useMediaQuery } from '@mui/material';
import { LensAuthContext } from '../context/LensContext';
import { getPublicationByUser } from '../lensprotocol/post/explore/explore-publications';
// import useInfiniteScroll from './useInfiniteScroll';
import { Box, useTheme } from '@mui/system';  
import PostCard from './Cards/PostCard'; 
import LoadingCard from './assets/SkeletonCard';


export default function RecipeReviewCard() {
    const lensAuthContext = React.useContext(LensAuthContext);
    const { userPosts, update } = lensAuthContext;
    const theme = useTheme();

    const greaterThanMid = useMediaQuery(theme.breakpoints.up("md"));
    const smallToMid = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const lessThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const xsmall = useMediaQuery(theme.breakpoints.down("xs"));


    const [Items, setItems] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState("{\"timestamp\":1,\"offset\":0}");
    const [HasMore, setHasMore] = useState(true);
    // const [lastElementRef] = useInfiniteScroll(
    //     HasMore ? loadMoreItems : () => { },
    //     isFetching
    // );
    React.useEffect(() => {
        loadMoreItems();
    }, [userPosts, update])



    async function loadMoreItems() {
        setIsFetching(true);
        const results = await getPublicationByUser(page).then((res) => {
            setItems((prevTitles) => {
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
    const skele =[0,1,2,3,4,5,6,7,8,9];

    return (
        <>
            <div className='container'>
                <div className='row'>
                <div className="d-flex justify-content-between  mt-4">
                        <p className='m-0'>Latest Publications</p> 
                    </div>
                    <Box sx={{ width: '100%', height: 'auto', overflowY: 'scroll', marginTop: '3%' }}>
                        <ImageList variant="masonry" cols={greaterThanMid && 3 || smallToMid && 2 || lessThanSmall && 1 || xsmall && 1} gap={16}>
                            {
                                Items.length === 0 && skele.map((e,i)=>{
                                    return (
                                        <LoadingCard key={i} data={e}/>
                                    )
                                })
                            }
                            {
                                Items && Items.map((item, i) => { 
                                    return (
                                        <ImageListItem
                                            // ref={lastElementRef}
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
            </div>

        </>

    );
}
