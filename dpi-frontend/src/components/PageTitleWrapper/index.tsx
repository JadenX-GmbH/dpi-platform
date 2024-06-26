import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, styled } from '@mui/material';

const PageTitle = styled(Box)(
  () => `
        margin-bottom: 36px;
`
);

interface PageTitleWrapperProps {
  children?: ReactNode;
}

const PageTitleWrapper: FC<PageTitleWrapperProps> = ({ children }) => {
  return (
    <PageTitle>
      <Container maxWidth="lg">{children}</Container>
    </PageTitle>
  );
};

PageTitleWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default PageTitleWrapper;
