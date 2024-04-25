import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';
import { AuthenticationGuard } from './components/AuthenticationGuard';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

const Projects = Loader(
  lazy(() => import('src/content/projects/ProjectsOverview'))
);
const ProjectDetails = Loader(
  lazy(() => import('src/content/projects/ProjectDetails'))
);

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  // {
  //   path: '',
  //   element: <BaseLayout />,
  //   children: [
  //     {
  //       path: '/',
  //       element: <Overview />
  //     },
  //     {
  //       path: 'overview',
  //       element: <Navigate to="/" replace />
  //     },
  //     {
  //       path: 'status',
  //       children: [
  //         {
  //           path: '',
  //           element: <Navigate to="404" replace />
  //         },
  //         {
  //           path: '404',
  //           element: <Status404 />
  //         },
  //         {
  //           path: '500',
  //           element: <Status500 />
  //         },
  //         {
  //           path: 'maintenance',
  //           element: <StatusMaintenance />
  //         },
  //         {
  //           path: 'coming-soon',
  //           element: <StatusComingSoon />
  //         }
  //       ]
  //     },
  //     {
  //       path: '*',
  //       element: <Status404 />
  //     }
  //   ]
  // },
  // {
  //   path: '/auth/login',
  //   element: <BaseLayout />,
  //   children: [
  //     {
  //       path: '',
  //       element: <Overview />
  //     }
  //   ]
  // },
  {
    path: '/',
    element: (
      <>
        <AuthenticationGuard component={SidebarLayout} />
      </>
    ),
    children: [
      // {
      //   path: '/',
      //   element: <ProjectsOverview />,
      // },
      {
        path: '/projects',
        element: <Projects />,
      },
      {
        path: '/projects/:projectId',
        element: <ProjectDetails />
      },
      {
        path: '/',
        element: <Navigate to="/projects" replace />
      },
      {
        path: 'status',
        children: [
          {
            path: '',
            element: <Navigate to="404" replace />
          },
          {
            path: '404',
            element: <Status404 />
          },
          {
            path: '500',
            element: <Status500 />
          },
          {
            path: 'maintenance',
            element: <StatusMaintenance />
          },
          {
            path: 'coming-soon',
            element: <StatusComingSoon />
          }
        ]
      },
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },
  // {
  //   path: '',
  //   element: <SidebarLayout />,
  //   children: [
  //     {
  //       path: '/',
  //       element: <ProjectsOverview />,
  //     },
  //     {
  //       path: '/projects',
  //       element: <ProjectsOverview />,
  //     },
  //     {
  //       path: '/projects/:projectId',
  //       element: <ProjectDetails />
  //     },
  //     {
  //       path: '',
  //       element: <Navigate to="/" replace />
  //     },
  //     {
  //       path: 'status',
  //       children: [
  //         {
  //           path: '',
  //           element: <Navigate to="404" replace />
  //         },
  //         {
  //           path: '404',
  //           element: <Status404 />
  //         },
  //         {
  //           path: '500',
  //           element: <Status500 />
  //         },
  //         {
  //           path: 'maintenance',
  //           element: <StatusMaintenance />
  //         },
  //         {
  //           path: 'coming-soon',
  //           element: <StatusComingSoon />
  //         }
  //       ]
  //     },
  //     {
  //       path: '*',
  //       element: <Status404 />
  //     }
  //   ]
  // },
];

export default routes;
