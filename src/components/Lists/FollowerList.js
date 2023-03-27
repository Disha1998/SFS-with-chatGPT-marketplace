
import { Avatar, Divider, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { followers } from '../../lensprotocol/follow/follower';
import { following } from '../../lensprotocol/follow/following';
import FollowButton from '../assets/FollowButton';
import useInfiniteScroll from '../useInfiniteScroll';

function FollowerList({ id, handleNavigate }) {
    const params = useParams();
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
    }, [page])

    useEffect(() => {
        setItems([]);
    }, [params])

    const replaceUrl = (e) => {
        const str = e && e.startsWith("ipfs://");
        if (str) {
            const res = 'https://superfun.infura-ipfs.io/ipfs/' + e.slice(7);
            return res;
        }
        return e;
    }

    async function loadMoreItems() {
        setIsFetching(true);
        const results = await followers(page, id).then((res) => {
            setItems((prevTitles) => {
                return [...new Set([...prevTitles, ...res.data.followers.items.map((b) => b)])];
            });
            setPage(res.data.followers.pageInfo.next);
            setHasMore(res.data.followers.items.length > 0);
            setIsFetching(false);
        })
            .catch((e) => {
                console.log(e);
            });
    }

    const shortAddress = (addr) =>
        addr.length > 10 && addr.startsWith('0x')
            ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
            : addr
    return (
        <>
            {
                Items.length === 0 && <h4>doesn’t follow anyone.</h4>
            }
            {
                Items && Items.map((e) => {
                    return (
                        <ListItem ref={lastElementRef} button key={e.wallet?.defaultProfile?.id}
                            onClick={() => handleNavigate(e.wallet?.defaultProfile?.id)}
                            secondaryAction={
                                <FollowButton id={e.wallet?.defaultProfile?.id} />
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={e.wallet?.defaultProfile?.picture != null ? replaceUrl(e?.wallet?.defaultProfile?.picture?.original?.url) : 'https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF'}>

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={shortAddress(e.wallet?.defaultProfile?.name ? e.wallet?.defaultProfile?.name : `@${e.wallet?.defaultProfile?.handle}`)} secondary={e.wallet?.defaultProfile?.bio} />

                        </ListItem>
                    )
                })
            }
            <Divider orientation='horizontal' />
        </>
    )
}

export default FollowerList