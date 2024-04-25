import { withAuthenticationRequired } from "@auth0/auth0-react";
import SuspenseLoader from "../SuspenseLoader";

export const AuthenticationGuard = ({ component }) => {
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => (
            <div className="page-layout">
                <SuspenseLoader />
            </div>
        ),
        returnTo: window.location.pathname + window.location.search
    });

    return <Component />;
};