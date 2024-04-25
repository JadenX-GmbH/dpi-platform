import { Card, CardContent, Box, Typography, CardHeader, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  values: string[];
}

interface TextProps {
  text: string;
}

const TextRow: React.FC<TextProps> = ({ text }) => {
  return (
    <Typography variant="body2" component="p" marginBottom={'4px'}>
      {text}
    </Typography>
  );
};

const CardList: React.FC<CardProps> = ({ title, icon, values }) => {
  return (
    <Card sx={{ marginBottom: '20px', paddingBottom: '40px' }}>
      <CardHeader title={title} avatar={icon} sx={{ '.MuiCardHeader-avatar': { marginRight: '10px' }, '.MuiTypography-root': { fontWeight: 'bold' } }} />
      <Divider />
      <CardContent sx={{ paddingTop: '10px' }}>
        {/* <Box sx={{ svg: { width: '40px', height: '40px' } }}>{icon}</Box>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
          <Typography gutterBottom variant="h5" component="h4" paddingRight={'6px'} marginBottom={'14px'} fontSize={'18px'} fontWeight={'bold'}>
            {title}
          </Typography>
          {action && <a style={{ textAlign: 'right' }}>{action}</a>}
        </Box> */}
        <List disablePadding>
          {values.map((value, index) => (
            <Box key={index}>
              <ListItem disableGutters>
                <ArticleIcon color={index === 0 ? 'primary' : 'info'} sx={{ marginRight: '10px' }} />
                <ListItemText
                  primary={<Box>{value}</Box>}
                  primaryTypographyProps={{
                    variant: 'body1',
                    color: 'textPrimary',
                    noWrap: true,
                  }}
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CardList;
