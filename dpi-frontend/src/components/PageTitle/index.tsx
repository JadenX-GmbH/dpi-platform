import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Typography, Grid, Button } from '@mui/material';

interface PageTitleProps {
  heading?: string;
  subHeading?: string;
  docs?: string;
  button?: ReactNode;
}

const PageTitle: FC<PageTitleProps> = ({ heading = '', subHeading = '', docs = '', button, ...rest }) => {
  return (
    <Grid container justifyContent="space-between" alignItems="center" {...rest}>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {heading}
        </Typography>
        <Typography variant="subtitle2">{subHeading}</Typography>
      </Grid>
      <Grid item>
        {button && <>{button}</>}
        {/* <Button
          href={docs}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          {heading} Documentation
        </Button> */}
      </Grid>
    </Grid>
  );
};

PageTitle.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  docs: PropTypes.string,
  button: PropTypes.node,
};

export default PageTitle;
