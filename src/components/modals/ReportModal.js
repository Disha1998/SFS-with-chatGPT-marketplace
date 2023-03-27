import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, OutlinedInput } from '@mui/material'
import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LensAuthContext } from '../../context/LensContext';
import { reportPublication } from '../../lensprotocol/post/report-publication';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

function ReportModal({ open, onClose, data }) {
    const lensAuthContext = React.useContext(LensAuthContext);
    const { profile, login } = lensAuthContext;
    const [type, setType] = React.useState( );
    const [reason, setReason] = React.useState();
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    // const handleChange = (event) => {
    //     setType(event.target.value);
    // }; 
    const handleReport = async () => {
        setLoading(true);
        if (note == '') {
            toast.error("Required All the fields!");
            return;
        }
        const dd = {
            id: data?.id,
            address: profile.ownedBy,
            login: login,
            reason: type,
            sub: reason,
            note: note
        }

        const res = await reportPublication(dd); 
        setLoading(false);
        toast.success("Successfully Reported!");
        setNote('')
        onClose();

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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Report </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <Divider />
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
                <textarea onChange={(e) => setNote(e.target.value)} rows={3} type="text" placeholder="Description" className="description-note" autoFocus="autofocus " />

            </DialogContent>
            <Divider />
            <DialogActions>
                <Button
                    sx={{ margin: '20px 10px 0 0' }}
                    style={{ background: '#F66A24', color: 'white', textTransform: 'capitalize' }}
                    onClick={onClose}>Cancel</Button>
                <Button sx={{ margin: '20px 10px 0 0' }}
                    style={{ background: '#468f72', color: 'white', textTransform: 'capitalize' }}
                    onClick={handleReport}
                >{loading ? <CircularProgress size={20} /> : " Report"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ReportModal