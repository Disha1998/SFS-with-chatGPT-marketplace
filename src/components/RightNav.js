import { Button, CircularProgress, Divider, Skeleton } from '@mui/material'
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LensAuthContext } from '../context/LensContext';
import { follow } from '../lensprotocol/follow/follow';
import { exploreProfile, recommendedPro, recommendedProfile } from '../lensprotocol/profile/explore-profiles';
import UserListView from './Lists/UserListView';


export default function RightNav() {
    const [Items, setItems] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [update, setUpdate] = useState(false);
    const lensAuthContext = React.useContext(LensAuthContext);
    const { updatePro } = lensAuthContext;




    useEffect(() => {
        loadMoreItems();
    }, [updatePro])


    async function loadMoreItems() {
        setIsFetching(true);
        const results = await recommendedPro().then((res) => {

            setItems((prevTitles) => {
                return [...new Set([prevTitles, ...res.recommendedProfiles.map((b) => b)])];
            });
            setIsFetching(false);
        })
            .catch((e) => {
                console.log(e);
                setIsFetching(false);
            });
    }

    const skele = [0, 1, 2, 3, 4, 5, 6, 7];


    return (
        <>
            <div><p style={{ textAlign: "left" }}>Recommended Profile</p></div>
            <div className='container rightnav'>
                {
                    !isFetching && Items && Items.slice(1, 8).map((e, i) => {
                        return (
                            < UserListView e={e} key={i} index={i} update={update} setUpdate={setUpdate} />
                        )
                    })
                }

                {
                    isFetching && skele.map((e, i) => {
                        return (
                            <div key={i}>
                                <Skeleton animation="wave" variant="circular" width={25} height={25} />
                                <Skeleton
                                    animation="wave"
                                    height={10}
                                    width="80%"
                                    style={{ marginBottom: 6 }}
                                />
                                <Skeleton animation="wave" height={10} width="40%" />
                            </div>
                        )
                    })
                }

            </div>

        </>

    )
}
