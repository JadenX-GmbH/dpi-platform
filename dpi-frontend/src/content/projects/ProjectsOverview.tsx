import { Container, Card, CardContent, CardMedia, Grid, Typography, Button, Box, LinearProgress } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { Helmet } from 'react-helmet-async';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useEffect, useState } from 'react';
import ProjectModal from 'src/components/Modals/ProjectModal';
import { useNavigate } from 'react-router';
import { useGetEntities } from '../../hooks/api/ngsi-ld/useGetEntities';
import { Project } from '../../models/Project';
import { useAuth0 } from '@auth0/auth0-react';
import { useGetEntitiesByQuery } from 'src/hooks/api/ngsi-ld/useGetEntitiesByQuery';

const ProjectsOverview = () => {
  const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { data, loading, error, refresh } = useGetEntities('Project', process.env.REACT_APP_DPI_NGSI_CONTEXT);

  const handleCloseCreateProjectModal = () => {
    setOpenProjectModal(false);
  };

  const handleOpenProjectModal = () => {
    setOpenProjectModal(true);
  };

  const ProjectCard = ({ title, description, image, id, author }: { title: string; description: string; image: string; id: string, author:string }) => {
    const truncateDescription = (text, maxLength) => {
      if (text.length <= maxLength) return text;
      const truncatedText = text.substr(0, maxLength);
      const lastSpaceIndex = truncatedText.lastIndexOf(' ');
      return truncatedText.substr(0, lastSpaceIndex) + '...';
    };


    const [fundingPercentage, setFundingPercentage] = useState(0);
    const { makeRequest, loading, error, responseStatus } = useGetEntitiesByQuery();
    useEffect(() => {
      const fetchData = async () => {
  
        try {
          const response = await makeRequest({
            linkHeader: process.env.REACT_APP_DPI_NGSI_CONTEXT ?? 'http://context/json-context.jsonld',
            keyValues: true,
            query: `postedUnder=="${id}";isCommitment==true`,
            limit: 100,
          });
          const intentsArray = response.data.filter(asset => asset.isCommitment);

          const reciverArray = intentsArray.filter(asset => asset.auth0AuthorID === author && asset.keyData.keyDataType.value === 'Funds');
          const funderArray = intentsArray.filter(asset => asset.auth0AuthorID !== author && asset.keyData.keyDataType.value === 'Funds');
  
          let fundsRequested = reciverArray.reduce((sum, obj) => sum + parseInt(obj.keyData.keyDataValue.value), 0);
          let fundsReceived = funderArray.reduce((sum, obj) => sum + parseInt(obj.keyData.keyDataValue.value), 0);

          const percentage = (fundsReceived / fundsRequested) * 100;

          setFundingPercentage(isNaN(percentage) ? 0 : percentage);
        } catch (error) {
          console.log('error', error)
        }
      };
  
      fetchData();
    }, [id]);

    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}>
          <Box width={'100%'}>
            <CardMedia component="img" alt="" height="140" image={image} sx={{ backgroundColor: '#ECF3F8', objectFit: 'contain' }} />
            <Typography variant="h4" component={'h5'} margin={'14px 0'} fontSize={'18px'}>
              {title}
            </Typography>
            <Typography variant="body2" component="p" marginBottom={'4px'}>
              <div dangerouslySetInnerHTML={{ __html: truncateDescription(description, 180) }} />
            </Typography>
            <Box display="flex" alignItems="center" flexWrap="wrap" mt={1.8}>
              <Typography variant="h5" component={'h5'} margin={'5px 10px 5px 0'} fontSize={'16px'}>
                Funding:
              </Typography>
              <LinearProgress value={fundingPercentage} color="success" variant="determinate" sx={{ flexGrow: 1, marginRight: '8px' }} />
              <Typography variant="body2">{fundingPercentage.toFixed(2)}%</Typography>
            </Box> 
          </Box>
          <Button variant="outlined" onClick={() => navigate(`/projects/${id}`)} endIcon={<EastIcon />} sx={{ marginTop: '10px' }}>
            See details
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Helmet>
        <title>Projects</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Projects"
          // subHeading="Manage your day to day tasks with style! Enjoy a well built UI system."
          button={
            (user['https://auth.dpi.com/roles'][0] === 'Receiver' || user['https://auth.dpi.com/roles'][0] === 'Funder') && (
              <Button variant="contained" color="primary" size="medium" onClick={handleOpenProjectModal} startIcon={<AddCircleOutlineIcon fontSize="small" />}>
                Create Project
              </Button>
            )
          }
        />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {loading ? (
            <Grid item xs={4}>
              <Typography>Loading...</Typography>
            </Grid>
          ) : error ? (
            <Grid item xs={4}>
              <Typography>Error: {error.message}</Typography>
            </Grid>
          ) : (
            data.map((entity: Project) => (
              <Grid item xs={4} key={entity.id}>
                <ProjectCard author={entity.author} id={entity.id} title={entity.alternateName} image={`${entity.image ? entity.image : `/static/images/placeholders/covers/${entity?.category?.toLocaleLowerCase().replace(' ', '-')}.png`}`} description={entity.description} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
      <ProjectModal openedModal={openProjectModal} closeModal={handleCloseCreateProjectModal} refresh={refresh} />
    </>
  );
};

export default ProjectsOverview;
