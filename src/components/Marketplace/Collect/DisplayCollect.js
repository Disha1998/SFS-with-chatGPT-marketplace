import React from 'react';
import { LensAuthContext } from '../../../context/LensContext';
import CollectModal from './display-collect-modal';

export default function DisplayCollectedPubs() {

    const lensAuthContext = React.useContext(LensAuthContext);
    const { collectedPubs } = lensAuthContext;
    const profileId = window.localStorage.getItem("profileId");

    return (
        <>
            <center><h3>Collected Items</h3></center>
            <div style={{ display: "flex" }} className='row'>
                {
                    collectedPubs && collectedPubs[0].map((pub) => {
                            return (
                                <div className='col-4'>
                       
                       <CollectModal pub={pub} />
                                </div>
                            )
                    })
                }
            </div>
        </>
    )
}
