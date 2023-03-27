

import * as React from 'react';
import { useState } from 'react';
import { Button, CircularProgress, ImageList, ImageListItem, useMediaQuery } from '@mui/material';
import { getPublicationByUser } from '../../../lensprotocol/post/explore/explore-publications';
import useInfiniteScroll from './useInfiniteScroll';
import { Box, useTheme } from '@mui/system';
import LoadingCard from './SkeletonCard';
import DisplayPublications from './NftPostModal';
import { LensAuthContext } from '../../../context/LensContext';
import RightNav from '../../../components/RightNav'
export default function NewdisplayPublication() {
    const lensAuthContext = React.useContext(LensAuthContext);
    const { NFTPosts, profile } = lensAuthContext;
    const theme = useTheme();
    const greaterThanMid = useMediaQuery(theme.breakpoints.up("md"));
    const smallToMid = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const lessThanSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const xsmall = useMediaQuery(theme.breakpoints.down("xs"));
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState("{\"timestamp\":1,\"offset\":0}");
    const [HasMore, setHasMore] = useState(true);
    const skele = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
        <>
            <div className='container'>
                <div style={{ margin: "0 7%" }}>
                    <Box sx={{ overflowY: 'hidden', marginTop: '7%' }} >
                        <ImageList variant="masonry" cols={greaterThanMid && 3 || smallToMid && 2 || lessThanSmall && 1 || xsmall && 1} gap={0}>
                            {
                                NFTPosts.length === 0 && skele.map((e, i) => {
                                    return (
                                        <LoadingCard key={i} data={e} />)
                                })
                            }
                            {
                                NFTPosts && NFTPosts.map((pub, i) => {
                                    if (pub.__typename === "Post") {
                                        return (
                                            <ImageListItem
                                                key={i}
                                            >
                                                <DisplayPublications key={i} pub={pub} />
                                            </ImageListItem>
                                        )
                                    }
                                })
                            }
                        </ImageList>
                    </Box>
                </div>
            </div>
        </>);
}