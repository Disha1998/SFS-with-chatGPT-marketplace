import React from 'react';
import { LensAuthContext } from '../../../context/LensContext';
import MirrorModal from './Mirror-display-modal';

export default function DisplayMirror() {

    const lensAuthContext = React.useContext(LensAuthContext);
    const { publications } = lensAuthContext;
    const profileId = window.localStorage.getItem("profileId");

    return (
        <>
            <center><h3>Mirrored Items</h3></center>
            <div style={{ display: "flex" }} className='row'>
                {
                    publications && publications.map((pub) => {
                        // console.log(pub);
                        if (pub.__typename === "Mirror" && pub.profile.id === profileId) {
                            return (
                                <div className='col-4'>
                                    <MirrorModal pub={pub} />
                                </div>
                            )
                        }
                    })
                }
            </div>
        </>
    )
}
