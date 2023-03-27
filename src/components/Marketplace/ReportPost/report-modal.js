import { Button, Dialog, DialogActions, DialogContent, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Divider, IconButton } from '@mui/material';
import React, { useState } from 'react';
import FlagIcon from '@mui/icons-material/Flag';
import { reportPublication } from '../../../lensprotocol/MarketPlace/ReportNft/report-publication';
import { LensAuthContext } from '../../../context/LensContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { deletePublicaton } from '../../../lensprotocol/MarketPlace/deletePost/delete-publication-type-data';


export default function ReporrtModal({ pubId, data }) {
    const [open, setOpen] = React.useState(false);
    const [type, setType] = React.useState();
    const [reason, setReason] = React.useState();
    const [note, setNote] = useState('');
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login, update, setUpdate } = lensAuthContext;
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleReport = async () => {
        if (note === '') {
            alert.error("Required All the fields!");
            return;
        }
        const dd = {
            id: pubId,
            address: profile.ownedBy,
            login: login,
            reason: type,
            sub: reason,
            note: note
        }

        const res = await reportPublication(dd);
        console.log(res, 'report responce');
        alert("Successfully Reported!");
        setNote('')

    }
    const handleDeletePublication = async (id) => {
        const dd = {
            id: id,
            address: profile.ownedBy,
            login: login
        }
        const res = await deletePublicaton(dd);
        if (res.data.hidePublication === null) {
            handleClose();
            alert("Post successfully deleted!");
        }
        setUpdate(!update);
        handleClose();
    }

    const reportType = [
        {
            name: 'Illegal',
            value: 'ILLEGAL',
        },
        {
            name: 'Fraud',
            value: 'FRAUD',
        },
        {
            name: 'Sensitive',
            value: 'SENSITIVE',
        }
    ];
    const illegal = [
        {
            name: 'Animal Abuse',
            value: 'ANIMAL_ABUSE',
        },
        {
            name: 'Direct Threat',
            value: 'DIRECT_THREAT',
        },
        {
            name: 'Human Abuse',
            value: 'HUMAN_ABUSE',
        },
        {
            name: 'Threat Individual',
            value: 'THREAT_INDIVIDUAL',
        },
        {
            name: 'Violence',
            value: 'VIOLENCE',
        },
    ];
    const fraud = [
        {
            name: 'Scam',
            value: 'SCAM',
        },
        {
            name: 'Impersonation',
            value: 'IMPERSONATION',
        }
    ];
    const sensitive = [
        {
            name: 'Offensive',
            value: 'OFFENSIVE'
        }
    ];
    return (
        <>
            <MenuItem aria-label="share">
                <div>
                    <FlagIcon onClick={handleClickOpen} />Report
                    <Dialog open={open} onClose={handleClose}>

                        <DialogContent>
                            <FormControl sx={{ minWidth: 120, marginTop: '20px' }} size="large" fullWidth>
                                <InputLabel id="demo-select-small">Select Type</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={type}
                                    // label="Type"
                                    input={<OutlinedInput label="Select Type" />}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    {
                                        reportType.map((e, i) => {
                                            return <MenuItem key={i} value={e.value} sx={{ textTransform: 'capitalize' }}>{e.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            {
                                type === 'ILLEGAL' &&
                                <FormControl sx={{ minWidth: 120, marginTop: '20px' }} size="large" fullWidth>
                                    <InputLabel id="demo-select-small">Select Reason</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={reason}
                                        // label="Type"
                                        input={<OutlinedInput label="Select Reason" />}
                                        onChange={(e) => setReason(e.target.value)}
                                    >
                                        {
                                            illegal.map((e, i) => {
                                                return <MenuItem key={i} value={e.value} sx={{ textTransform: 'capitalize' }}>{e.name}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            }
                            {
                                type === 'FRAUD' &&
                                <FormControl sx={{ minWidth: 120, marginTop: '20px' }} size="large" fullWidth>
                                    <InputLabel id="demo-select-small">Select Reason</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={reason}
                                        // label="Type"
                                        input={<OutlinedInput label="Select Reason" />}
                                        onChange={(e) => setReason(e.target.value)}
                                    >
                                        {
                                            fraud.map((e, i) => {
                                                return <MenuItem key={i} value={e.value} sx={{ textTransform: 'capitalize' }}>{e.name}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            }
                            {
                                type === 'SENSITIVE' &&
                                <FormControl sx={{ minWidth: 120, marginTop: '20px' }} size="large" fullWidth>
                                    <InputLabel id="demo-select-small">Select Reason</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={reason}
                                        // label="Type"
                                        input={<OutlinedInput label="Select Reason" />}
                                        onChange={(e) => setReason(e.target.value)}
                                    >
                                        {
                                            sensitive.map((e, i) => {
                                                return <MenuItem key={i} value={e.value} sx={{ textTransform: 'capitalize' }}>{e.name}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            }
                            <label style={{ marginTop: '20px' }}>Description</label>
                            <textarea style={{ width: "100%" }} onChange={(e) => setNote(e.target.value)} rows={3} type="text" placeholder="Description" className="description-note" autoFocus="autofocus " />

                        </DialogContent>
                        <Divider />
                        <DialogActions>

                            <Button sx={{ margin: '20px 10px 0 0' }}
                                style={{ background: '#468f72', color: 'white', textTransform: 'capitalize' }}
                                onClick={handleReport}
                            >Report
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </MenuItem>
            {
                profile?.id === data?.profile?.id && <MenuItem onClick={() => handleDeletePublication(data.id)}>
                    <IconButton>
                        <DeleteIcon style={{ fontSize: "18px", marginLeft: "-3px" }} />
                    </IconButton><small>Delete</small></MenuItem>
            }
        </>
    )
}