import { Avatar, Box, Button, CircularProgress, Link } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Slider from 'react-slick';
import { exploreProfile, exploreProfileOnSlider } from '../lensprotocol/profile/explore-profiles';
import { getPublicationByUser } from '../lensprotocol/post/explore/explore-publications';
import { green } from '@mui/material/colors';
import { LensAuthContext } from '../context/LensContext';
import { profileById } from '../context/query';
import { follow } from '../lensprotocol/follow/follow';
import { toast } from 'react-toastify';
import UserCard from './Cards/UserCard';
import SkeletonCard from './assets/SkeletonSlider';

function TopCreators() {

    const [story, setStory] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        async function getCreator() {
            var user = [];
            const res = await exploreProfileOnSlider();

            res.exploreProfiles.items && res.exploreProfiles.items.map((e, i) => {
                // setStory(e) 
                // if(e.__typename == "Comment"){
                user.push(e);

                // }else if (e.__typename == "Mirror"){
                //     user.push(e.mirrorOf.profile);
                // }else{
                //     user.push(e.profile);
                // }
            })

            setStory(user)

            // setStory(arry);

        }
        getCreator()
    }, [])

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 6,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 540,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }
        ]
    };

    const skele =[0,1,2,3,4,5,6,7,8,9];




    return (
        <div className='container mt-3' >
            <div className='row'>
                <div className='col'>
                    <div className="d-flex justify-content-between mb-2">
                        <p>Newly Joined</p>
                        {/* <Button component={RouterLink} to="/memers">View All</Button> */}
                    </div>
                    {/* {
                        story.length === 0 && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    } */}
                    {
                        story.length === 0 && <Slider {...settings}>
                        {
                             skele.map((e, i) => {
                                return ( 
                                    <SkeletonCard key={i} />
                                )
                            })
                        }
                    </Slider>
                    }
                   
                    {
                        story === undefined && <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <h4>No data Available</h4>
                        </Box>
                    }
                    <Slider {...settings}>
                        {
                            story && story.map((e, i) => {
                                return (
                                    <UserCard key={i} data={e} index={i} />
                                )
                            })
                        }
                    </Slider>
                </div>
            </div >

        </div >

    )
}

export default TopCreators

// #ef6a37, #f7b643, #468f72, #2679c1, #9a73c3