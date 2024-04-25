import { Box, Button, Card, CardContent, CardMedia, Container, Grid, Tab, Tabs, Typography, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import CardList from 'src/components/Cards/CardList';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useGetEntityById } from 'src/hooks/api/ngsi-ld/useGetEntityById';
import { ProjectDetailsType } from 'src/models/ProjectDetails';
import ProjectModal from 'src/components/Modals/ProjectModal';
import CanvasCards from './CanvasCards';
import ProjectSectionComments from './ProjectSectionComments';
import ProjectSectionCommitments from './ProjectSectionCommitments';
import { useAuth0 } from '@auth0/auth0-react';
import AgreementTableView from './projectTables/AgreementTableView';
import ProjectSectionMilestones from './ProjectSectionMilestones';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabsCustom = styled(Tabs)(
  ({ theme }) => `
  .MuiTab-root {
    background-color: #fff;
    border-radius: 0;
    &.Mui-selected {
      background-color: #F0FAFF;
      color: ${theme.colors.primary.main} !important;
      z-index: 1 !important;
    }
  }

  .MuiTabs-indicator {
    height: 2px;
    min-height: 2px;
    border-radius: 0;
    z-index: 2;
  }
`
);

interface CanvasDataType {
  title: string;
  description: string;
  canvasId: string;
}

const ProjectDetails = () => {
  const {user} = useAuth0();
  const { projectId } = useParams<{ projectId: string }>();
  const [value, setValue] = useState(0);
  const [projectDetails, setProjectDetails] = useState<ProjectDetailsType>();
  const [refetchProjectDetails, setRefetchProjectDetails] = useState(false);
  const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
  const [canvasData, setCanvasData] = useState<CanvasDataType | undefined>();
  const [isEditButtonVisible, setIsEditButtonVisible] = useState<boolean>(false);

  const handleCloseProjectModal = () => {
    setOpenProjectModal(false);
  };

  const handleOpenProjectModal = () => {
    setOpenProjectModal(true);
  };

  const handleRefetchProjectDetails = () => {
    setRefetchProjectDetails((prevValue) => !prevValue);
  };

  const addCanvasData = (title: string, description: string, canvasId: string) => {
    setCanvasData({title, description, canvasId});
  };

  const { makeRequest } = useGetEntityById(process.env.REACT_APP_DOCKER_JSON_CONTEXT ?? 'http://context/json-context.jsonld');

  useEffect(() => {
    if (projectId) {
      makeRequest(projectId, false)
        .then((response) => {
          setIsEditButtonVisible(response?.data?.author?.value === user?.sub)
          setProjectDetails(response.data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [projectId, refetchProjectDetails]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`tab-${index}`} aria-labelledby={`tab-${index}`} {...other}>
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  return (
    <>
      <Helmet>
        <title>Project Details</title>
      </Helmet>
      <Container maxWidth="xl">
        {projectDetails && (
          <>
            <Grid container>
              <Grid item width={'100%'}>
                <Card sx={{ marginBottom: '20px' }}>
                  <CardContent>
                    <Typography variant="h3" mb={1.5} mt={0.5} pl={0.5} gutterBottom>
                      {projectDetails.alternateName.value}
                    </Typography>
                  </CardContent>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabsCustom value={value} onChange={handleChange} aria-label="tabs">
                      <Tab label="Description" {...a11yProps(0)} />
                      {user['https://auth.dpi.com/roles'][0] !== 'Certifier' && <Tab label="Discussions" {...a11yProps(1)} />}
                      <Tab label="Intents" {...a11yProps(2)} />
                      <Tab label="Agreements" {...a11yProps(3)} />
                      <Tab label="Milestones" {...a11yProps(4)} />
                    </TabsCustom>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item width={'100%'}>
                <CustomTabPanel value={value} index={0}>
                  {
                    isEditButtonVisible && <Grid container mb={2}>
                      <Grid item width={'100%'}>
                        <Box>
                          <Button variant="contained" onClick={handleOpenProjectModal}>
                            Edit
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  }
                  
                  <Grid container flexDirection={'row'} flexWrap={'nowrap'} spacing={3}>
                    <Grid item width={'100%'}>
                      <Card>
                        <CardContent>
                          <Typography variant="body1" gutterBottom>
                            <div dangerouslySetInnerHTML={{ __html: projectDetails.description.value }} />
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item minWidth={'400px'}>
                      <Card sx={{ marginBottom: '20px' }}>
                        <CardContent>
                          <CardMedia component="img" alt="" height="170" sx={{ borderRadius: '10px' }} image={ projectDetails.image ? projectDetails.image.value.toString() : `/static/images/placeholders/covers/${projectDetails?.category?.value.toLocaleLowerCase().replace(' ', '-')}.png`} />
                        </CardContent>
                      </Card>

                      <CardList title="Documents" icon={<DescriptionIcon />} values={['document.docx', 'document.docx', 'document.docx']} />
                    </Grid>
                  </Grid>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  {canvasData ? <ProjectSectionComments canvasData={canvasData} goBack={() => setCanvasData(undefined)}/> : <CanvasCards addCanvasData={addCanvasData}/>}
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  <ProjectSectionCommitments />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                  <AgreementTableView />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={4}>
                  <ProjectSectionMilestones />
                </CustomTabPanel>
              </Grid>
            </Grid>
            <ProjectModal openedModal={openProjectModal} closeModal={handleCloseProjectModal} projectData={projectDetails} refresh={handleRefetchProjectDetails} />
          </>
        )}
      </Container>
    </>
  );
};

export default ProjectDetails;