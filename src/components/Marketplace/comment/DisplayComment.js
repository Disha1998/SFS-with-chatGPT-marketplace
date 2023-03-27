import React from 'react';
import { LensAuthContext } from '../../../context/LensContext';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function DisplayComments({ pubId }) {
    const lensAuthContext = React.useContext(LensAuthContext);
    const { NFTComments } = lensAuthContext;

    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Comments</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ul>
                        {
                            NFTComments && NFTComments.map((pub) => {
                                console.log()
                                if (pub.__typename === "Comment" && pub.mainPost.id === pubId) {
                                    return (
                                        <li>{pub.metadata.content}</li>
                                    )
                                }
                            })
                        }
                    </ul>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

