import { Box, Breadcrumbs, Link, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useGetEntityById } from 'src/hooks/api/ngsi-ld/useGetEntityById';

const BreadcrumbWrapper = styled(Box)(
  ({ theme }) => `
        color: ${theme.header.textColor};
        padding: ${theme.spacing(1, 2)};
        height: ${theme.breadcrumbs.height};
        top:  ${theme.header.height};
        right: 0;
        z-index: 6;
        background-color: ${theme.breadcrumbs.background};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
            left: ${theme.sidebar.width};
            width: auto;
        }
`
);

const BreadcrumbsBlock = () => {
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const { makeRequest, loading, error, responseStatus } = useGetEntityById(process.env.REACT_APP_DOCKER_JSON_CONTEXT ?? 'http://context/json-context.jsonld');

  const [projectTitle, setProjectTitle] = useState();

  useEffect(() => {
    if (projectId) {
      makeRequest(projectId, false)
        .then((response) => {
          setProjectTitle(response.data.alternateName.value);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [projectId]);
  

  const getPathnameSegments = () => {
    return location.pathname.split('/').filter((segment) => segment !== '');
  };

  const renderBreadcrumbs = () => {
    const pathnameSegments = getPathnameSegments();
    const lastSegmentIndex = pathnameSegments.length - 1;

    return (
      <Breadcrumbs aria-label="breadcrumb">
        {pathnameSegments.map((segment, index) => {
          const path = `/${pathnameSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === lastSegmentIndex;

          return (
            <Box key={path} display="flex">
              <Link color="inherit" href={path} sx={{ textDecoration: isLast ? 'underline' : 'normal' }}>
                {segment === projectId ? projectTitle : segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Link>
            </Box>
          );
        })}
      </Breadcrumbs>
    );
  };

  return <BreadcrumbWrapper>{renderBreadcrumbs()}</BreadcrumbWrapper>;
};

export default BreadcrumbsBlock;
