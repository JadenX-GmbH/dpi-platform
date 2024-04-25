import React, { FC } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Card, CardContent, Grid, LinearProgress, Typography, styled } from '@mui/material';
import BrightnessHighSharpIcon from '@mui/icons-material/BrightnessHighSharp';
import { useGetCanvas } from 'src/hooks/api/ngsi-ld/useGetCanvas';
import { Canvas } from 'src/models/Canvas';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams } from 'react-router';

const CustomAccordion = styled(Accordion)(
    ({ theme }) => `
    margin-bottom: 20px !important;
    border-radius: 10px !important;
    border: 1px solid #e1e1e1;

    & .MuiAccordionSummary-content {
        margin: 20px 0;
    }
  `
  );

interface CanvasCardsProps {
  addCanvasData: (title: string, description: string, canvasId: string) => void;
}

const CanvasCards: FC<CanvasCardsProps> = ({ addCanvasData }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, loading, error, refresh } = useGetCanvas('Canvas', projectId, process.env.REACT_APP_DPI_NGSI_CONTEXT, 100) as { data: Canvas[]; loading: boolean; error: any; refresh: () => void };

  const ProjectRequirementCard = ({
    title,
    description,
    canvasId,
    icon,
    iconColor,
    emoji,
    percent,
  }: {
    title: string;
    description: string;
    canvasId: string;
    icon: JSX.Element;
    iconColor?: string;
    emoji: string;
    percent: number;
  }) => {
    return (
      <Card sx={{ height: '100%', textDecoration: 'none', backgroundColor: '#F0F0F0', cursor: 'pointer' }} onClick={() => addCanvasData(title, description, canvasId)}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Avatar variant="rounded" sx={{ width: '56px', height: '56px', backgroundColor: iconColor ? iconColor : '#FB8A05', svg: { color: '#fff', fontSize: '32px' } }}>
                {icon}
              </Avatar>
              <Avatar variant="rounded" sx={{ backgroundColor: '#fff', fontSize: '18px' }}>
                {emoji}
              </Avatar>
            </Box>
            <Typography variant="h4" component="h4" margin="20px 0 12px" fontSize={20} lineHeight={'1.2'}>
              {title}
            </Typography>
            <Typography variant="body2" component="p" fontSize={15} marginBottom="4px">
              {description}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" flexWrap="wrap" mt={1.8}>
            <LinearProgress value={percent} color="success" variant="determinate" sx={{ flexGrow: 1, marginRight: '8px' }} />
            <Typography variant="body2">{percent}%</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderAccordions = () => {
    if (!data) return null;
  
    const groupedData: { [key: string]: Canvas[] } = data.reduce((acc: { [key: string]: Canvas[] }, curr: Canvas) => {
      const groupId = curr.topicsGroup.groupId.value;
      acc[groupId] = [...(acc[groupId] || []), curr];
      return acc;
    }, {});
 
    return Object.entries(groupedData).sort((a, b) => Number(a[0]) - Number(b[0])).map(([groupId, items]) => (
      <CustomAccordion key={groupId} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${groupId}-content`} id={`${groupId}-header`}>
          <Typography variant='h4' fontSize={20}>{items[0].topicsGroup.title.value}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {items.sort((a, b) => a.order - b.order).map(({ title, description, id, order }, index) => (
                <Grid item xs={3} key={order}>
                  <ProjectRequirementCard title={title} description={description} canvasId={id} icon={<BrightnessHighSharpIcon />} iconColor={index % 2 === 0 ? '#57B894' : '#FB8A05'} emoji="😐" percent={50} />
                </Grid>
              ) )}
          </Grid>
        </AccordionDetails>
      </CustomAccordion>
    ));
  };

  return (
    <div>
      {renderAccordions()}
    </div>
  );
};

export default CanvasCards;
