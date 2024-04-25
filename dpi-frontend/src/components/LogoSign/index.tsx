import {
  Tooltip,
  TooltipProps,
  tooltipClasses,
  styled,
} from '@mui/material';
import { Link } from 'react-router-dom';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.colors.alpha.white[100]};
        display: flex;
        justify-content: center;
        text-decoration: none;
        margin: 0 auto;
        font-size: 18px;
        font-weight: ${theme.typography.fontWeightBold};

        span {
          margin-right: 6px;
          color: #4285F4;
        }
`
);

const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colors.alpha.trueWhite[100],
    color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 'bold',
    borderRadius: theme.general.borderRadiusSm,
    boxShadow:
      '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.colors.alpha.trueWhite[100]
  }
}));

function Logo({blackText}:{blackText?: boolean}) {

  return (
    <TooltipWrapper
      title="DPI Matching & Collaboration Platform"
      arrow
    >
      <LogoWrapper to="/overview" style={{color: blackText ? '#000' : '#fff' }}>
          <span>DPI</span> Matching & Collaboration Platform
      </LogoWrapper>
    </TooltipWrapper>
  );
}

export default Logo;
