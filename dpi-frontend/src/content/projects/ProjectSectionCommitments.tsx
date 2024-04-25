import { Container, Grid, Card, CardContent, Box, Typography, useMediaQuery, Avatar, IconButton, styled } from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useGetEntitiesByQuery } from 'src/hooks/api/ngsi-ld/useGetEntitiesByQuery';
import { useEffect, useState } from 'react';
import { Commitment } from 'src/models/Communication';
import { useParams } from 'react-router';

const ChatBlockWrap = styled(Card)(
  ({ theme }) => `
      position: relative;
      margin-bottom: 20px;
      background-color: ${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.colors.alpha.white[100]};
      color: #717171;
      border: 1px solid transparent;
      box-shadow: 0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32);
  
        .MuiCardContent-root {
          display: flex;
          flex-direction: row;
        }
  
        b {
          color: #000;
        }

        .MuiAvatar-root .MuiSvgIcon-root {
            color: ${theme.palette.primary.main}
        }
      `
);

const ChatBlockTop = styled(Box)(
  ({ theme }) => `
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: baseline;
        flex-wrap: nowrap;
  
        .MuiTypography-h4 {
          color: #000;
          font-weight: 400;
        }
        `
);

const ProjectSectionCommitments = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { projectId } = useParams<{ projectId: string }>();
  const [commitments, setCommitments] = useState<Commitment[]>([]);

  const { makeRequest, loading, error, responseStatus } = useGetEntitiesByQuery();

  useEffect(() => {

    makeRequest({
      linkHeader: process.env.REACT_APP_DPI_NGSI_CONTEXT ?? 'http://context/json-context.jsonld',
      keyValues: true,
      type: 'Post',
      query: `postedUnder=="${projectId}";isCommitment==true`,
    }).then((assets) => {
      setCommitments((prev) => [...prev, ...assets.data]);

    });

    makeRequest({
      linkHeader: process.env.REACT_APP_DPI_NGSI_CONTEXT ?? 'http://context/json-context.jsonld',
      keyValues: true,
      type: 'Comment',
      query: `postedUnder=="${projectId}"; isCommitment==true`,
    }).then((assets) => {
      setCommitments((prev) => [...prev, ...assets.data]);

    });


  }, []);
  return (
    <Grid container>

      {
        commitments.map((commitment) => (
          <Grid xs={12} key={commitment.id} item>
            <ChatBlockWrap>
              <CardContent>
                <Box sx={{ marginRight: '14px' }}>
                  <Avatar variant="rounded" sx={{ backgroundColor: '#F0F0F0', fontSize: '22px' }}>
                    <SummarizeIcon />
                  </Avatar>
                </Box>
                <Box>
                  <ChatBlockTop mb={2}>
                    <Box>
                      <Box sx={{ margin: '1px 0 2px 0' }}>
                        <Typography variant="h4" component={'h4'}>
                          <b>{commitment?.title}</b> - <b>{commitment?.author}</b>
                        </Typography>
                      </Box>
                      <Box sx={{ fontSize: '12px' }}>5th February 2024 Edited <AttachFileIcon sx={{ fontSize: '14px' }} /></Box>
                    </Box>
                  </ChatBlockTop>
                  <Box mb={2}>
                    {commitment?.content}
                  </Box>
                  {
                    commitment.keyData.keyDataType.value !== 'N/A' && (
                      <Box display={'flex'} alignItems={'baseline'} sx={{ backgroundColor: '#3498db', color: '#fff', padding: '8px 14px', borderRadius: '10px', width:'20rem' }}>
                        <Typography variant="h6" mr={0.8} fontWeight={'400'}>
                          Key Data:
                        </Typography>
                        <Typography variant="body2" fontWeight={'bold'}>
                          {commitment.keyData.keyDataType.value} {commitment.keyData.keyDataValue.value}
                          {commitment.keyData.keyDataType.value === 'Funds' && '€'}
                        </Typography>
                      </Box>
                    )
                  }
                </Box>
              </CardContent>
            </ChatBlockWrap>
          </Grid>
        ))
      }

    </Grid>
  );
};

export default ProjectSectionCommitments;
