import { Avatar, Divider, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { following } from '../../lensprotocol/follow/following';
import FollowButton from '../assets/FollowButton';
import useInfiniteScroll from '../useInfiniteScroll';

function FollowingList({ address, handleNavigate}) {
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
    }, [ address])

    useEffect(()=>{
        setItems([]);
    },[params])

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
        const results = await following(page,  address).then((res) => {
            setItems((prevTitles) => {
                return [...new Set([...prevTitles, ...res.data.following.items.map((b) => b)])];
            });
            setPage(res.data.following.pageInfo.next);
            setHasMore(res.data.following.items.length > 0);
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

                        <ListItem ref={lastElementRef} button key={e.profile.id}
                            onClick={() => handleNavigate(e.profile.id)}
                            secondaryAction={
                                <FollowButton id={e.profile.id} />
                            }
                        >
                            <ListItemAvatar>
                                <Avatar src={e.profile?.picture != null ?  e.profile?.picture?.original && replaceUrl(e.profile?.picture?.original?.url) : 'https://superfun.infura-ipfs.io/ipfs/QmRY4nWq3tr6SZPUbs1Q4c8jBnLB296zS249n9pRjfdobF'}>

                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={shortAddress(e.profile?.name ? e.profile?.name : `@${e.profile?.handle}`)} secondary={e.profile?.bio} />

                        </ListItem>

                    )
                })
            }
            <Divider orientation='horizontal' />
        </>
    )
}

export default FollowingList