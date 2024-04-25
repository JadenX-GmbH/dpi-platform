
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { Checkbox, CheckboxProps, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, styled } from '@mui/material';
import { useGetEntitiesByQuery } from 'src/hooks/api/ngsi-ld/useGetEntitiesByQuery';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const BpIcon = styled('span')(({ theme }) => ({
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow:
        theme.palette.mode === 'dark'
            ? '0 0 0 1px rgb(16 22 26 / 40%)'
            : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
    backgroundImage:
        theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
            : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '.Mui-focusVisible &': {
        outline: '2px auto rgba(19,124,189,.6)',
        outlineOffset: 2,
    },
    'input:hover ~ &': {
        backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
    },
    'input:disabled ~ &': {
        boxShadow: 'none',
        background:
            theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
    },
}));

const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&::before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
            " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
            "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
    },
    'input:hover ~ &': {
        backgroundColor: '#106ba3',
    },
});

function BpCheckbox(props: CheckboxProps) {
    return (
        <Checkbox
            sx={{
                '&:hover': { bgcolor: 'transparent' },
            }}
            disableRipple
            color="default"
            checkedIcon={<BpCheckedIcon />}
            icon={<BpIcon />}
            inputProps={{ 'aria-label': 'Checkbox demo' }}
            {...props}
        />
    );
}

const PrivacySettings = ({ user, setAllowedOrgs, data }) => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('anyone');
    const [organization, setOrganization] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState([]);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        setValue((event.target as HTMLInputElement).value);
    };


    
    const { makeRequest, loading, error, responseStatus } = useGetEntitiesByQuery();

    useEffect(() => {
        if (Array.isArray(data)) {
            setSelectedOrg(data);
            if (data.length > 0) {
                setValue('selected_org')
            } else {
                setValue('anyone')
            }
        } else {
            setSelectedOrg([data])
            setValue('no_one')
        }

    }, [data]);



    useEffect(() => {

        makeRequest({
            linkHeader: process.env.REACT_APP_DPI_NGSI_CONTEXT ?? 'http://context/json-context.jsonld',
            keyValues: true,
            type: 'Organization',
        }).then((assets) => {
            setOrganization(assets.data);

        });
    }, []);

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const orgId = event.target.name;
        const isChecked = event.target.checked;


        if (isChecked && !selectedOrg.includes(orgId)) {
            setSelectedOrg(prev => [...prev, orgId]);
        } else if (!isChecked && selectedOrg.includes(orgId)) {
            setSelectedOrg(prev => prev.filter(id => id !== orgId));
        }
    }

    const handleSave = () => {
        if (value === 'selected_org') {

            if (selectedOrg.includes(user["https://auth.dpi.com/org_id"])) {
                setAllowedOrgs(selectedOrg)
            } else {
                setAllowedOrgs((prev) => [...selectedOrg, user["https://auth.dpi.com/org_id"]])
            }


        } else if (value === 'no_one') {
            setAllowedOrgs([user["https://auth.dpi.com/org_id"]])
        } else if (value === 'anyone') {
            setAllowedOrgs([])
        }
        handleClose();
    }

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>Privacy Settings</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box sx={style}>
                        <Box>

                            <Typography variant="h4" component={'h4'}>
                                Who can view this comment?
                            </Typography>
                            <FormControl>

                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={value}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="anyone" control={<Radio />} label="Anyone" />
                                    <FormControlLabel value="no_one" control={<Radio />} label="No one" />
                                    <FormControlLabel value="selected_org" control={<Radio />} label="Selected Organisation Only" />
                                </RadioGroup>

                            </FormControl>
                        </Box>

                        {value === 'selected_org' && <Box ml={4}>
                            <FormGroup>
                                {
                                    organization.filter(item => item.org_id !== user["https://auth.dpi.com/org_id"]).map((item, index) => <FormControlLabel key={index} control={<BpCheckbox checked={selectedOrg.includes(item.org_id)} name={item.org_id} onChange={handleCheckBoxChange} />} label={item.displayName} />)
                                }
                            </FormGroup>
                        </Box>}
                        <Box display={'flex'} flexDirection={'row-reverse'}>
                            <Button variant="contained" onClick={handleSave} style={{ marginLeft: 10 }}>Save</Button>
                            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                        </Box>
                    </Box>
                </>

            </Modal>
        </div>
    );
}

export default PrivacySettings