import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TopCreators from './TopCreators';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown } from "@fortawesome/free-regular-svg-icons";
import ForyouCards from './ForyouCards';



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function HeaderTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className='container' > 
            <Box sx={{ width: '100%' ,padding:'0'}}>
                {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> */}
                    {/* <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="For You" {...a11yProps(0)} className="headertabs" />
                        <Tab label="Trending 🚀" {...a11yProps(1)} className="headertabs" /> */}
                        {/* <Tab label="Comming soon" {...a11yProps(2)} className="headertabs" /> */}
                        {/* <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                                <React.Fragment>
                                    <Button {...bindTrigger(popupState)} className="headertabs" >
                                        More { " "}
                                        <FontAwesomeIcon icon={faArrowAltCircleDown} style={{marginLeft:"5px"}} /> 
                                        
                                    </Button>
                                    
                                    
                                    <Menu {...bindMenu(popupState)}>
                                        <MenuItem onClick={popupState.close}>Text</MenuItem>
                                        <MenuItem onClick={popupState.close}>Photos </MenuItem>
                                        <MenuItem onClick={popupState.close}>GIFs</MenuItem>
                                        <MenuItem onClick={popupState.close}>Quotes</MenuItem>
                                        <MenuItem onClick={popupState.close}>Chats</MenuItem>
                                        <MenuItem onClick={popupState.close}>Audios</MenuItem>
                                        <MenuItem onClick={popupState.close}>Videos</MenuItem>
                                        <MenuItem onClick={popupState.close}>Asks</MenuItem>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </PopupState> */}
                    {/* </Tabs>
                </Box> */}
                {/* <TabPanel  value={value} index={0}> */}
                    <TopCreators />
                    <ForyouCards />
                {/* </TabPanel> */}
                {/* <TabPanel  value={value} index={1}>
                    Comming Soon
                </TabPanel> */}
                {/* <TabPanel  value={value} index={2}>
                    Item Three
                </TabPanel> */}

            </Box>
        </div>

    );
}



