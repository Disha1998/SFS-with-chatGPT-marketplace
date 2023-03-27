import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function SkeletonCard() {
  return (
    <Stack spacing={1}  className="story"> 
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} /> 
      <Skeleton variant="rounded" width={210} height={100} />
      <Skeleton variant="rectangular" width={100} height={30} />
      {/* <Skeleton variant="rounded" width={210} height={60} /> */}
    </Stack>
  );
}
 