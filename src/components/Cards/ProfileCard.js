import { Box, Button } from '@mui/material'
import React from 'react'

function ProfileCard({item}) {

    const replaceUrl = (e) => {
        const str = e && e.startsWith("ipfs://");
        if (str) {
          const res = 'https://superfun.infura-ipfs.io/ipfs/' + e.slice(7);
          return res;
        }
        return e;
      } 

    return (
        <Box style={{ margin: '10px  ', background: 'rgba(255,255,255,0.1)', padding: '20px',borderRadius:'4px' }}>
             <div className='text-left' style={{ marginLeft: '5%' }}>
                <div className='profile-edit-space'>
                    <img className='profile-picture-detail' src={
                        item?.profile?.picture != null ? replaceUrl(item?.profile.picture?.original?.url) :
                            '/assets/bg.png'} style={{ borderRadius: '3%' }} alt="" />
                    <div className='d-sm-block d-xs-block d-flex'> 
 
                        <Button sx={{ margin: '20px 10px 0 0' }}
                            variant='outlined'
                            // onClick={() => handleFollow(item.id)}
                        > Follow 
                        </Button>
                    </div>
                </div>
                <h4 className='pt-4' style={{ fontWeight: '500' }}>
                    {item?.profile?.name ? item?.profile?.name : item?.profile?.handle} </h4>
                <h6>
                    {`@${item?.profile?.handle.trim().toLowerCase()}`} </h6>
                <p><small> {item?.profile?.bio}</small></p> 
        </div>  
        </Box>
    )
}

export default ProfileCard