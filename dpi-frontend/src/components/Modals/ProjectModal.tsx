import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Grid,
  Box,
  TextField,
  Alert,
  Divider,
  List,
  Button,
  CircularProgress,
  ListItem,
  ListItemText,
  Zoom,
  useTheme,
  styled,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import { useCreateEntity } from '../../hooks/combined/useCreateEntity';
import { ProjectDetailsType } from 'src/models/ProjectDetails';
import { useUpdateEntityById } from 'src/hooks/combined/useUpdateEntityById';
import { useAuth0 } from '@auth0/auth0-react';

const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
      border-radius: ${theme.general.borderRadius};
      padding: ${theme.spacing(3)};
      background: ${theme.colors.alpha.black[5]};
      border: 1px dashed ${theme.colors.alpha.black[30]};
      outline: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: ${theme.transitions.create(['border', 'background'])};
  
      &:hover {
        background: ${theme.colors.alpha.white[100]};
        border-color: ${theme.colors.primary.main};
      }
  `
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
  `
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.success.light};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
  `
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.error.light};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
  `
);

const ListItemCustom = styled(ListItem)(
  ({ theme }) => `
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: ${theme.spacing(1)};
        background: #F0F0F0;
        border-radius: 10px;

        .MuiBox-root {
            display: flex;
            align-items: center;
            
            .MuiSvgIcon-root {
                margin-right: 8px;
                color: #4285F4;
            }
        }
    `
);

const EditorWrapper = styled(Box)(
  ({ theme }) => `

    .ql-editor {
      min-height: 100px;
      font-size: 15px;
    }

    .ql-editor.ql-blank::before {
      color: #a3a9b7;
      font-style: normal;
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`
);

interface CreateProjectModalProps {
  openedModal: boolean | false;
  closeModal: () => void;
  refresh?: () => void;
  projectData?: ProjectDetailsType;
}

type CategoryType = 'E-Payment' | 'E-Identity' | 'E-Health' | 'Data Exchange';
type FundingType = 'Offering' | 'Co-funding';

const ProjectModal: React.FC<CreateProjectModalProps> = ({ openedModal, closeModal, refresh, projectData }) => {
  const {user}= useAuth0();
  const [open, setOpen] = useState(openedModal);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const createEntity = useCreateEntity();
  const updateEntity = useUpdateEntityById();
  const [category, setCategory] = useState<CategoryType>(projectData ? projectData.category.value : null);
  const [funding, setFunding] = useState<FundingType>(projectData && projectData.funding ? projectData.funding.value : null);
  const [description, setDescription] = useState<string>(projectData ? projectData.description.value : '');
  const [imageBase64, setImageBase64] = useState(projectData && projectData.image ? projectData.image.value : null);

  const handleDescriptionChange = (content: string) => {
    setDescription(content);
  };

  const handleCategoryChange = (event: SelectChangeEvent<CategoryType>) => {
    setCategory(event.target.value as CategoryType);
  };

  const handleFundingChange = (event: SelectChangeEvent<FundingType>) => {
    setFunding(event.target.value as FundingType);
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      setImageBase64(base64Data);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setOpen(openedModal);
  }, [openedModal]);

  const { acceptedFiles, isDragActive, isDragAccept, isDragReject, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg'],
    },
    onDrop: handleDrop,
  });

  const handleProjectClose = () => {
    closeModal();
  };

  const handleProjectSuccess = () => {
    enqueueSnackbar(projectData ? 'The project description has been edited successfully' : 'A new project has been created successfully', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
      TransitionComponent: Zoom,
    });

    refresh();
    handleProjectClose();
  };

  const canvasDataTemp = async (projectId) =>{
    const randomNumber = Math.floor(Math.random() * 100000);
    let canvasDataArr =  [
      {
        topicGroup: 'General Information',
        groupId: 0,
        orderIndex: 0,
        title: 'Project Summary',
        description: 'Summarise briefly what your project intends to achieve (description of objectives aligning to national and sector priorities and intended benefits), which issue is tackled and how the project is carried out.'
      },
      {
        topicGroup: 'General Information',
        groupId: 0,
        orderIndex: 1,
        title: 'Geographical Scope',
        description: 'Please provide details of the project site from the district to the village.'
      },
      {
        topicGroup: 'General Information',
        groupId: 0,
        orderIndex: 2,
        title: 'Anticipated Start Date',
        description: 'Please provide the anticipated start date in format DD/MM/YYYY.'
      },
      {
        topicGroup: 'General Information',
        groupId: 0,
        orderIndex: 3,
        title: 'Estimated Project Duration',
        description: 'Please provide the estimated project duration in months and specify phases if applicable.'
      },
      {
        topicGroup: 'General Information',
        groupId: 0,
        orderIndex: 4,
        title: 'Estimated Budget',
        description: 'Please provide the Estimated Budget that is needed for project execution.'
      },
      {
        topicGroup: 'Project Setup',
        groupId: 1,
        orderIndex: 0,
        title: 'Technical and Functional Description',
        description: 'Please write a short technical and functional description of the project. Also indicate if it is a new or existing project.'
      },
      {
        topicGroup: 'Project Setup',
        groupId: 1,
        orderIndex: 1,
        title: 'Privacy',
        description: 'Please describe how the project complies with local data protection regulation and laws.'
      },
      {
        topicGroup: 'Project Setup',
        groupId: 1,
        orderIndex: 2,
        title: 'Scalability',
        description: 'Please describe if the project is outlined for potential scaling in terms of technical platform delivery or in other departments, provinces, etc.'
      },
      {
        topicGroup: 'Project Setup',
        groupId: 1,
        orderIndex: 3,
        title: 'Impact',
        description: 'Please describe the specific change the project intends to achieve. Clearly state specific objectives and expected results.'
      },
      {
        topicGroup: 'Project Setup',
        groupId: 1,
        orderIndex: 4,
        title: 'Measurement',
        description: 'Please describe how the project satisfies the value of money and includes measures and indicators accordingly.'
      },
      {
        topicGroup: 'Project Setup',
        groupId: 1,
        orderIndex: 5,
        title: 'Target Beneficiaries',
        description: 'Please describe who will be the beneficiary of the project.'
      },
      {
        topicGroup: 'Relevance',
        groupId: 2,
        orderIndex: 0,
        title: 'Strategic Focus',
        description: 'Please describe how the project responds to the National/ International Agenda (e.g. NST1, Vision 2035, SSPs, AU 2063 Agenda, etc.)? Is the project seeking to address/act upon a most pressing public issue?'
      },
      {
        topicGroup: 'Relevance',
        groupId: 2,
        orderIndex: 1,
        title: 'Priority Sector',
        description: 'Please describe how the project responds to the selected sector: (1) Smart Cities and Smart Municipalities, (2) Education and Skills, or (3) Agriculture'
      },
      {
        topicGroup: 'Relevance',
        groupId: 2,
        orderIndex: 2,
        title: 'Synergies',
        description: 'Please describe if the project will be linked to other German Development Cooperation or other donor funded projects.'
      },
      {
        topicGroup: 'Sustainability',
        groupId: 3,
        orderIndex: 0,
        title: 'Financial Sustainability',
        description: 'Please describe how the operation of the project will be financially sustained in the long run without additional funding?'
      },
      {
        topicGroup: 'Sustainability',
        groupId: 3,
        orderIndex: 1,
        title: 'Operational Sustainability',
        description: 'Please describe the capacity of the MDADC (Ministries, Departments, Agencies, Districts and City Governments) for continuing (operating and maintaining) the project after the implementation phase.'
      },
      {
        topicGroup: 'Costs / Procurement',
        groupId: 4,
        orderIndex: 0,
        title: 'Cost Estimation',
        description: 'Please describe the estimated costs for the implementation of the investment as well as the operational costs.'
      },
      {
        topicGroup: 'Project Methodology / Design',
        groupId: 5,
        orderIndex: 0,
        title: 'User Centricity',
        description: 'Please describe how the project design addresses end user needs and their context (citizen and/or administrative personnel).'
      },
      {
        topicGroup: 'Project Methodology / Design',
        groupId: 5,
        orderIndex: 1,
        title: 'Agile',
        description: 'Please describe how the solution includes testing methods and feedback loops and describe if the project will be implemented using modern IT project management (e.g. Prince2, Scrum).'
      },
      {
        topicGroup: 'Project Methodology / Design',
        groupId: 5,
        orderIndex: 2,
        title: 'Minimal Viable Product',
        description: 'Please describe if there is a minimal viable product or prototype planned  for rapid and iterative development.'
      },
      {
        topicGroup: 'Technology',
        groupId: 6,
        orderIndex: 0,
        title: 'Feasibility',
        description: 'Please describe the technological solution feasibility – Is there a best practice case already in place?'
      },
      {
        topicGroup: 'Technology',
        groupId: 6,
        orderIndex: 1,
        title: 'Interoperability',
        description: 'Please describe if the project is interlinked and can work with other existing solutions (e.g. digital services or software) in the local government'
      },
      {
        topicGroup: 'Technology',
        groupId: 6,
        orderIndex: 2,
        title: 'Open Source',
        description: 'Please describe if the project could apply for open standards and/or open-source software.'
      },
      {
        topicGroup: 'Environnemental & Social Impact',
        groupId: 7,
        orderIndex: 0,
        title: 'Regulation',
        description: 'Please describe if and how the project complies with national environmental and social legislation.'
      },
      {
        topicGroup: 'Environnemental & Social Impact',
        groupId: 7,
        orderIndex: 1,
        title: 'Environmental & Social Risk',
        description: 'Please provide a short assessment of the potential environmental and social impact and potential mitigation measures.'
      },
      {
        topicGroup: 'Environnemental & Social Impact',
        groupId: 7,
        orderIndex: 2,
        title: 'Gender Equality',
        description: 'Please describe how the project promotes gender equality and increase the share of female participation.'
      },
      {
        topicGroup: 'Environnemental & Social Impact',
        groupId: 7,
        orderIndex: 3,
        title: 'Inclusiveness',
        description: 'Please describe how the project promotes inclusiveness and increase digital inclusion of historically disadvantaged social groups.'
      },
      {
        topicGroup: 'Environnemental & Social Impact',
        groupId: 7,
        orderIndex: 4,
        title: 'Resettlement',
        description: 'Please describe if the project can be carried out without major physical or economic resettlement.'
      }
    ]

    let dataToSend = [];
    canvasDataArr.forEach((canvasData, index) => {
      dataToSend.push(
        {
          "id": `urn:ngsi-ld:Canvas:${randomNumber + index}`,
          "type": "Canvas",
          "title": {
              "type": "Property",
              "value": canvasData.title
          },
          "description": {
              "type": "Property",
              "value": canvasData.description
          },
          "order": {
              "type": "Property",
              "value": canvasData.orderIndex
          },
            "belongsTo": {
              "type": "Relationship",
              "object": projectId
          },
          "topicsGroup": {
              "type": "Property",
              "value": {
                "groupId": {
              "type": "Property",
              "value": canvasData.groupId
          },
          "title": {
              "type": "Property",
              "value": canvasData.topicGroup
          }
          }
          }
      
      })
    });

    try {
       await createEntity.makeRequests(dataToSend)
    } catch (error) {
      
    }
    
  }




  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleProjectClose}>
      <DialogTitle
        sx={{
          p: 3,
        }}
      >
        <Typography variant="h3" gutterBottom>
          {projectData ? 'Edit' : 'Create'} Project
        </Typography>
      </DialogTitle>
      <Formik
        initialValues={{
          title: projectData ? projectData.alternateName.value : '',
          submit: null,
        }}
        //   validationSchema={Yup.object().shape({
        //     title: Yup.string()
        //       .max(255)
        //       .required(t('The title field is required'))
        //   })}

        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const randomNumber = Math.floor(Math.random() * 10000);

            const entity: ProjectDetailsType = {
              id: `urn:ngsi-ld:Project:${randomNumber}`,
              type: 'Project',
              alternateName: {
                type: 'Property',
                value: values.title,
              },
              description: {
                type: 'Property',
                value: description,
              },
              category: {
                type: 'Property',
                value: category,
              },
              author:{
                type:'Property',
                value:user.sub
              }
            };

            const entityUpdate: ProjectDetailsType = {
              alternateName: {
                type: 'Property',
                value: values.title,
              },
              description: {
                type: 'Property',
                value: description,
              },
              category: {
                type: 'Property',
                value: category,
              },
              author:{
                type:'Property',
                value:user.sub
              }
            };

            if(imageBase64) {
              entity.image = {
                type: 'Property',
                value: imageBase64,
              };

              entityUpdate.image = {
                type: 'Property',
                value: imageBase64,
              };
            }

            if (user['https://auth.dpi.com/roles'][0] === 'Funder') {
              entity.funding = {
                type: 'Property',
                value: funding,
              };

              entityUpdate.funding = {
                type: 'Property',
                value: funding,
              };
            }

            projectData ? await updateEntity.makeRequests(projectData.id, entityUpdate) : await createEntity.makeRequests(entity);
            if(!projectData){
              canvasDataTemp(entity.id)
            }

            handleProjectSuccess();
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
          }
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent
              dividers
              sx={{
                p: 3,
              }}
            >
              <Grid container spacing={0}>
                {/* <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`,
                  }}
                  item
                  xs={12}
                >
                  <BoxUploadWrapper {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragAccept && (
                      <>
                        <AvatarSuccess variant="rounded">
                          <CheckTwoToneIcon />
                        </AvatarSuccess>
                        <Typography
                          sx={{
                            mt: 2,
                          }}
                        >
                          Drop the image to start uploading
                        </Typography>
                      </>
                    )}
                    {isDragReject && (
                      <>
                        <AvatarDanger variant="rounded">
                          <CloseTwoToneIcon />
                        </AvatarDanger>
                        <Typography
                          sx={{
                            mt: 2,
                          }}
                        >
                          You cannot upload image type
                        </Typography>
                      </>
                    )}
                    {!isDragActive && (
                      <>
                        {imageBase64 ? (
                          <img src={imageBase64.toString()} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        ) : (
                          <AvatarWrapper variant="rounded">
                            <CloudUploadTwoToneIcon />
                          </AvatarWrapper>
                        )}

                        <Typography
                          sx={{
                            mt: 2,
                          }}
                        >
                          Drag & drop image here
                        </Typography>
                      </>
                    )}
                  </BoxUploadWrapper>
                </Grid> */}
                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`,
                  }}
                  item
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.title && errors.title)}
                    fullWidth
                    helperText={touched.title && errors.title}
                    name="title"
                    label="Name"
                    placeholder="Provide Name"
                    // onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.title}
                    variant="outlined"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: theme.spacing(2) }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="category-label" required>
                      Category
                    </InputLabel>
                    <Select labelId="category-label" id="category" value={category} onChange={handleCategoryChange} label="Category" required>
                      <MenuItem value="E-Payment">E-Payment</MenuItem>
                      <MenuItem value="E-Identity">E-Identity</MenuItem>
                      <MenuItem value="E-Health">E-Health</MenuItem>
                      <MenuItem value="Data Exchange">Data Exchange</MenuItem>
                      <MenuItem value="Misc.">Misc.</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {user['https://auth.dpi.com/roles'][0] === 'Funder' && (
                  <Grid item xs={12} sx={{ mb: theme.spacing(2) }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="funding-label" required>
                        Funding
                      </InputLabel>
                      <Select labelId="funding-label" id="funding" value={funding} onChange={handleFundingChange} label="Funding" required>
                        <MenuItem value="Offering">Offering</MenuItem>
                        <MenuItem value="Co-funding">Co-funding</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid
                  sx={{
                    mb: `${theme.spacing(2)}`,
                  }}
                  item
                  xs={12}
                >
                  <EditorWrapper>
                    <ReactQuill theme="snow" placeholder="Provide Description" value={description} onChange={handleDescriptionChange} />
                  </EditorWrapper>
                </Grid>

                <Grid xs={12}>
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={1}>
                    <Typography variant="h5">Documents</Typography>
                    <Button startIcon={<AddIcon />}>Add documents</Button>
                  </Box>
                  <List component="div" sx={{ padding: '0' }}>
                    <ListItemCustom>
                      <Box>
                        <ArticleIcon />
                        <span>project_file.docx</span>
                      </Box>
                      <IconButton>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </ListItemCustom>
                    <ListItemCustom>
                      <Box>
                        <ArticleIcon />
                        <span>project_file.docx</span>
                      </Box>
                      <IconButton>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </ListItemCustom>
                    <ListItemCustom>
                      <Box>
                        <ArticleIcon />
                        <span>project_file.docx</span>
                      </Box>
                      <IconButton>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </ListItemCustom>
                  </List>
                </Grid>
                <Grid
                  sx={{
                    mt: `${theme.spacing(3)}`,
                  }}
                  item
                  xs={12}
                  display={'flex'}
                  justifyContent={'flex-end'}
                >
                  <Button
                    sx={{
                      mr: 2,
                    }}
                    type="submit"
                    startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                    disabled={Boolean(errors.submit) || isSubmitting}
                    variant="contained"
                    size="large"
                  >
                    {projectData ? 'Save' : 'Create'}
                  </Button>
                  <Button color="secondary" size="large" variant="outlined" onClick={handleProjectClose}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ProjectModal;
