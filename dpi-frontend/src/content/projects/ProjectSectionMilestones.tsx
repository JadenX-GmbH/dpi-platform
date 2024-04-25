import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  styled,
} from "@mui/material";
import BiotechIcon from "@mui/icons-material/Biotech";
import PaidIcon from "@mui/icons-material/Paid";
import { useState } from "react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import VerifiedIcon from "@mui/icons-material/Verified";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DescriptionIcon from "@mui/icons-material/Description";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ArticleIcon from "@mui/icons-material/Article";
import DeliveryStatus from "./DeliveryStatus";

const ChatBlockWrap = styled(Card)(
  ({ theme }) => `
        position: relative;
        margin-bottom: 20px;
        background-color: ${
          theme.palette.mode === "dark"
            ? theme.palette.primary.dark
            : theme.colors.alpha.white[100]
        };
        color: #717171;
        border: 1px solid transparent;
        box-shadow: 0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32);
    
          .MuiCardContent-root {
            display: flex;
            flex-direction: coloumn;
          }
    
          b {
            color: #000;
          }
        `
);

const ChatBlockTop = styled(Box)(
  ({ theme }) => `
          display: flex;
          flex-direction: coloumn;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: nowrap;
    
          .MuiTypography-h4 {
            color: #000;
            font-weight: 400;
          }
          `
);

const ProjectSectionMilestones = () => {
  const [expandContributors, setExpandContributors] = useState(false);
  const [expandDocuments, setExpandDocuments] = useState(false);
  const [expandDependencies, setExpandDependencies] = useState(false);
  const [expandHistory, setExpandHistory] = useState(false);

  const values = ["document.docx", "document.docx", "document.docx"];
  return (
    <Grid container flexDirection={"row"} flexWrap={"nowrap"} spacing={3}>
      <Grid xs={8} item>
        <ChatBlockWrap sx={{ padding: "20px" }}>
          <Box sx={{ marginRight: "14px" }}>
            <Avatar
              variant="square"
              sx={{
                bgcolor: "transparent",
                width: "50px",
                height: "50px",
              }}
            >
              <BiotechIcon
                sx={{ width: "40px", height: "40px", color: "#000000" }}
              />
            </Avatar>
          </Box>

          <Box>
            <ChatBlockTop mb={2}>
              <Box>
                <Box sx={{ margin: "1px 0 2px 0" }}>
                  <Typography variant="h4" component={"h4"}>
                    <b>Implementation of Carbon Credit Calculator </b> from 
                    <b>Bill & Melinda Gates Foundation</b>
                  </Typography>
                </Box>
                <Box sx={{ fontSize: "12px" }}>5th February 2024 Edited </Box>
              </Box>
            </ChatBlockTop>
            <Box mb={2}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                  fontWeight: 500,
                  color: "#0E0F0F",
                }}
              >
                This is the portion of the legal contract that was previously
                marked. Contrary to popular belief, Lorem Ipsum is not simply
                random text. It has roots in a piece of classical Latin
                literature from 45 BC, making it over 2000 years old. Richard
                McClintock, a Latin professor at Hampden-Sydney College in
                Virginia, looked up one of the more obscure Latin words,
                consectetur, from a Lorem Ipsum passage, and going through the
                cites of the word in classical literature, discovered the
                undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
                1.10.33 of "de Finibus Bonorum et Malorum"{" "}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "17rem",
                borderBottom: "1px solid #D8D8D8",
                paddingBottom: "15px",
                marginTop: "20px",
              }}
            >
              <Typography variant="h5">Budget: </Typography>
              <Typography variant="h5" color={"#000000"}>
                $500,000{" "}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "17rem",
                borderBottom: "1px solid #D8D8D8",
                paddingBottom: "15px",
                marginTop: "20px",
              }}
            >
              <Typography variant="h5">Due Date: </Typography>
              <Typography variant="h5" color={"#000000"}>
                1st February 2025{" "}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "17rem",
                borderBottom: "1px solid #D8D8D8",
                paddingBottom: "15px",
                marginTop: "20px",
              }}
            >
              <Typography variant="h5">Percentage of Completion: </Typography>
              <Typography variant="h5" color={"#000000"}>
                100%{" "}
              </Typography>
            </Box>
          </Box>
        </ChatBlockWrap>

        <ChatBlockWrap sx={{ padding: "20px" }}>
          <Box sx={{ marginRight: "14px" }}>
            <Avatar
              variant="square"
              sx={{
                bgcolor: "transparent",
                width: "50px",
                height: "50px",
              }}
            >
              <LocalShippingIcon
                sx={{ width: "40px", height: "40px", color: "#000000" }}
              />
            </Avatar>
          </Box>
          <Box>
            <ChatBlockTop mb={2}>
              <Box>
                <Box sx={{ margin: "1px 0 2px 0" }}>
                  <Typography variant="h4" component={"h4"}>
                    <b>Delivery Status reported </b>by 
                    <b>Software Development Company</b>
                  </Typography>
                </Box>
                <Box sx={{ fontSize: "12px" }}>5th February 2024 Edited </Box>
              </Box>
            </ChatBlockTop>
            <Box mb={2}>
              <DeliveryStatus />
            </Box>
          </Box>
        </ChatBlockWrap>

        <ChatBlockWrap sx={{ padding: "20px" }}>
          <Box sx={{ marginRight: "14px" }}>
            <Avatar
              variant="square"
              sx={{
                bgcolor: "transparent",
                width: "50px",
                height: "50px",
              }}
            >
              <FactCheckIcon
                sx={{ width: "40px", height: "40px", color: "#000000" }}
              />
            </Avatar>
          </Box>
          <Box>
            <ChatBlockTop mb={2}>
              <Box>
                <Box sx={{ margin: "1px 0 2px 0" }}>
                  <Typography variant="h4" component={"h4"}>
                    <b>Attestation</b> by<b> TÜV</b>
                  </Typography>
                </Box>
                <Box sx={{ fontSize: "12px" }}>5th February 2024 Edited </Box>
              </Box>
            </ChatBlockTop>
            <ChatBlockWrap
              sx={{
                border: "2px solid #27AE60",
                bgcolor: "rgba(39, 174, 96, 0.16)",
                borderRadius: "5px",
                padding: "20px",
              }}
            >
              <Grid container>
                <Grid item xs={1}>
                  <Box sx={{ marginRight: "14px" }}>
                    <Avatar
                      variant="square"
                      sx={{
                        bgcolor: "transparent",
                        width: "30px",
                        height: "30px",
                      }}
                    >
                      <VerifiedIcon
                        sx={{
                          width: "25px",
                          height: "25px",
                          color: "#27AE60 ",
                        }}
                      />
                    </Avatar>
                  </Box>
                </Grid>
                <Grid item xs={11}>
                  <Typography sx={{ color: "#000000" }}>
                    TÜV attested that the deliverable "Carbon Credit Calculator"
                    meets the agreed upon requirements.
                  </Typography>
                </Grid>
              </Grid>
            </ChatBlockWrap>
          </Box>
        </ChatBlockWrap>
      </Grid>
      <Grid xs={3.8} item sx={{ marginLeft: "auto" }}>
        <Card sx={{ marginBottom: "20px" }}>
          <CardHeader
            title={"Contributors"}
            avatar={
              <Avatar
                variant="square"
                sx={{ backgroundColor: "transparent", fontSize: "20px" }}
              >
                <PaidIcon sx={{ width: "20px", color: "#000" }} />
              </Avatar>
            }
            sx={{
              ".MuiCardHeader-avatar": { marginRight: "10px" },
              ".MuiTypography-root": { fontWeight: "bold" },
              ".MuiCardHeader-action": { margin: "0" },
            }}
            action={
              <>
                <Avatar
                  onClick={() => setExpandContributors(!expandContributors)}
                  variant="square"
                  sx={{ backgroundColor: "transparent", fontSize: "30px" }}
                >
                  {expandContributors ? (
                    <KeyboardArrowUpIcon
                      sx={{ width: "30px", color: "#000" }}
                    />
                  ) : (
                    <KeyboardArrowDownIcon
                      sx={{ width: "30px", color: "#000" }}
                    />
                  )}
                </Avatar>
              </>
            }
          />
          <Divider />
          <Collapse in={expandContributors}>
            <CardContent sx={{ paddingTop: "10px" }}>
              <Typography> Bill & Melinda Gates... </Typography>
              <Typography> Republic of Estonia </Typography>
              <Typography>KfW </Typography>
            </CardContent>
          </Collapse>
        </Card>

        <Card sx={{ marginBottom: "20px" }}>
          <CardHeader
            title={"Documents"}
            avatar={
              <Avatar
                variant="square"
                sx={{ backgroundColor: "transparent", fontSize: "20px" }}
              >
                <DescriptionIcon sx={{ width: "20px", color: "#000" }} />
              </Avatar>
            }
            sx={{
              ".MuiCardHeader-avatar": { marginRight: "10px" },
              ".MuiTypography-root": { fontWeight: "bold" },
              ".MuiCardHeader-action": { margin: "0" },
            }}
            action={
              <>
                <Avatar
                  onClick={() => setExpandDocuments(!expandDocuments)}
                  variant="square"
                  sx={{ backgroundColor: "transparent", fontSize: "30px" }}
                >
                  {expandDocuments ? (
                    <KeyboardArrowUpIcon
                      sx={{ width: "30px", color: "#000" }}
                    />
                  ) : (
                    <KeyboardArrowDownIcon
                      sx={{ width: "30px", color: "#000" }}
                    />
                  )}
                </Avatar>
              </>
            }
          />
          <Divider />
          <Collapse in={expandDocuments}>
            <CardContent sx={{ paddingTop: "10px" }}>
              <List disablePadding>
                {values.map((value, index) => (
                  <Box key={index}>
                    <ListItem disableGutters>
                      <ArticleIcon
                        color={index === 0 ? "primary" : "info"}
                        sx={{ marginRight: "10px" }}
                      />
                      <ListItemText
                        primary={<Box>{value}</Box>}
                        primaryTypographyProps={{
                          variant: "body1",
                          color: "textPrimary",
                          noWrap: true,
                        }}
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </CardContent>
          </Collapse>
        </Card>
        <Card sx={{ marginBottom: "20px" }}>
          <CardHeader
            title={"Dependencies"}
            avatar={
              <Avatar
                variant="square"
                sx={{ backgroundColor: "transparent", fontSize: "20px" }}
              >
                <PlaylistAddCheckIcon sx={{ width: "20px", color: "#000" }} />
              </Avatar>
            }
            sx={{
              ".MuiCardHeader-avatar": { marginRight: "10px" },
              ".MuiTypography-root": { fontWeight: "bold" },
              ".MuiCardHeader-action": { margin: "0" },
            }}
            action={
              <>
                <Avatar
                  onClick={() => setExpandDependencies(!expandDependencies)}
                  variant="square"
                  sx={{ backgroundColor: "transparent", fontSize: "30px" }}
                >
                  {expandDependencies ? (
                    <KeyboardArrowUpIcon
                      sx={{ width: "30px", color: "#000" }}
                    />
                  ) : (
                    <KeyboardArrowDownIcon
                      sx={{ width: "30px", color: "#000" }}
                    />
                  )}
                </Avatar>
              </>
            }
          />
          <Divider />
          <Collapse in={expandDependencies}>
            <CardContent sx={{ paddingTop: "10px" }}>
              <Typography> Bill & Melinda Gates... </Typography>
              <Typography> Republic of Estonia </Typography>
              <Typography>KfW </Typography>
            </CardContent>
          </Collapse>
        </Card>

        <Card sx={{ marginBottom: "20px" }}>
          <CardHeader
            title={"History"}
            avatar={
              <Avatar
                variant="square"
                sx={{ backgroundColor: "transparent", fontSize: "20px" }}
              >
                <ScheduleIcon sx={{ width: "20px", color: "#000" }} />
              </Avatar>
            }
            sx={{
              ".MuiCardHeader-avatar": { marginRight: "10px" },
              ".MuiTypography-root": { fontWeight: "bold" },
              ".MuiCardHeader-action": { margin: "0" },
            }}
            action={
              <>
                <Avatar
                  onClick={() => setExpandHistory(!expandHistory)}
                  variant="square"
                  sx={{ backgroundColor: "transparent", fontSize: "30px" }}
                >
                  {expandHistory ? (
                    <KeyboardArrowUpIcon
                      sx={{ width: "30px", color: "#000" }}
                    />
                  ) : (
                    <KeyboardArrowDownIcon
                      sx={{ width: "30px", color: "#000" }}
                    />
                  )}
                </Avatar>
              </>
            }
          />
          <Divider />
          <Collapse in={expandHistory}>
            <CardContent sx={{ paddingTop: "5px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "auto",
                  borderBottom: "1px solid #D8D8D8",
                  paddingBottom: "5px",
                  marginTop: "20px",
                }}
              >
                <Typography>Initial Version </Typography>
                <Typography color={"#9C9C9C"}>12 January 2024 </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "auto",
                  borderBottom: "1px solid #D8D8D8",
                  paddingBottom: "5px",
                  marginTop: "20px",
                }}
              >
                <Typography>Initial Version </Typography>
                <Typography color={"#9C9C9C"}>12 January 2024 </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "auto",
                  borderBottom: "1px solid #D8D8D8",
                  paddingBottom: "5px",
                  marginTop: "20px",
                }}
              >
                <Typography>Initial Version </Typography>
                <Typography color={"#9C9C9C"}>12 January 2024 </Typography>
              </Box>
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProjectSectionMilestones;
