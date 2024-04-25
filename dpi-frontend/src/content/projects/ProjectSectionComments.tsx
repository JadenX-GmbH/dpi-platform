import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  styled,
  TextField,
  useMediaQuery,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Avatar,
  IconButton,
  Zoom,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { FC, useEffect, useState } from 'react';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useCreateEntity } from 'src/hooks/combined/useCreateEntity';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { useGetEntitiesByQuery } from 'src/hooks/api/ngsi-ld/useGetEntitiesByQuery';
import { Post, Comment, Commitment } from 'src/models/Communication';
import { useUpdateEntityById } from 'src/hooks/combined/useUpdateEntityById';
import { useAuth0 } from '@auth0/auth0-react';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { useParams } from 'react-router';
import ProjectSectionReplies from './ProjectSectionReplies';
import PrivacySettings from './PrivacySettings';

const ChatBlockWrap = styled(Card)(
  ({ theme }) => `
    position: relative;
    margin-bottom: 20px;
    background-color: ${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.colors.alpha.white[70]};
    color: #717171;
    border: 1px solid transparent;
    box-shadow: 0px 9px 16px rgba(159, 162, 191, 0.18), 0px 2px 2px rgba(159, 162, 191, 0.32);

      .MuiCardContent-root {
        display: flex;
        flex-direction: row;
      }

      b {
        color: #000;
      }
    `
);

const ChatBlockTop = styled(Box)(
  () => `
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: nowrap;

      .MuiTypography-h4 {
        color: #000;
      }
      `
);

const ActionsBlock = styled(Box)(
  ({ theme }) => `
      margin: 20px 0 0;

      .MuiIconButton-root {
        margin-right: 10px;
        &.active {
          background-color: ${theme.palette.primary.main};
          color: #fff;
        }
      }
      `
);

const ActionsTextField = styled(Box)(
  ({ theme }) => `
     position: absolute;
     right: 20px;
     bottom: 6px;
      `
);

interface ProjectSectionCommentsProps {
  goBack: () => void;
  canvasData: {
    title: string;
    description: string;
    canvasId: string;
  };
}

const ProjectSectionComments: FC<ProjectSectionCommentsProps> = ({ goBack, canvasData }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { user } = useAuth0();
  const { projectId } = useParams<{ projectId: string }>()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [addCommentMode, setAddCommentMode] = useState(false);
  const [postValue, setPostValue] = useState('');
  const [commentValue, setCommentValue] = useState('');
  const [editValue, setEditValue] = useState(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const createEntity = useCreateEntity();
  const updateEntity = useUpdateEntityById();
  const [keyDataType, setKeyDataType] = useState(null);
  const [keyDataValue, setKeyDataValue] = useState(null);
  const [replyBlockOpenIndex, setReplyBlockOpenIndex] = useState(null);
  const [editBlockOpenIndex, setEditBlockOpenIndex] = useState(null);

  const [fetchPosts, setFetchPosts] = useState(false);
  const [fetchComments, setFetchComments] = useState(false);
  const [fetchCommitments, setFetchCommitments] = useState(false);
  const [isCommitment, setIsCommitment] = useState<boolean>(null);
  const [allowedOrgs, setAllowedOrgs] = useState<string[]>([]);


  const toggleReplyBlock = (index) => {
    setKeyDataType(null);
    setKeyDataValue(null);
    setReplyBlockOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const toggleEditBlock = (index) => {
    setKeyDataType(null);
    setKeyDataValue(null);
    setEditValue(null);
    setEditBlockOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const { makeRequest, loading, error, responseStatus } = useGetEntitiesByQuery();

  useEffect(() => {
    makeRequest({
      linkHeader: process.env.REACT_APP_DPI_NGSI_CONTEXT ?? 'http://context/json-context.jsonld',
      keyValues: true,
      query: `belongsTo=="${canvasData.canvasId}"`,
      type: 'Post',
    }).then((assets) => {
      if (assets) setPosts(assets.data);
    });
  }, [fetchPosts]);


  useEffect(() => {
    makeRequest({
      linkHeader: process.env.REACT_APP_DPI_NGSI_CONTEXT ?? 'http://context/json-context.jsonld',
      keyValues: true,
      type: 'Commitment',
      query: `belongsTo=="${projectId}"`,
    }).then((assets) => {
      if (assets) setCommitments(assets.data);
    });
  }, [fetchCommitments]);

  const handlePostSuccess = () => {
    enqueueSnackbar('A new post has been added successfully', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      TransitionComponent: Zoom,
    });

    setPostValue('');
    setKeyDataType(null);
    setKeyDataValue(null);
    setFetchPosts((prevValue) => !prevValue);
    setFetchCommitments((prevValue) => !prevValue);
    setAddCommentMode(false);
  };

  const handleCommentSuccess = (postId) => {
    enqueueSnackbar('A new comment has been added successfully', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      TransitionComponent: Zoom,
    });

    setCommentValue('');
    setFetchComments((prevValue) => !prevValue);
    setReplyBlockOpenIndex(false);
  };

  const handleEditSuccess = () => {
    enqueueSnackbar('The post has been updated successfully', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      TransitionComponent: Zoom,
    });

    setEditValue('');
    setKeyDataType(null);
    setKeyDataValue(null);
    setFetchPosts((prevValue) => !prevValue);
    setFetchCommitments((prevValue) => !prevValue);
    setEditBlockOpenIndex(null);
  };

  const handlePost = async () => {
    const randomNumber = Math.floor(Math.random() * 10000);

    if (postValue) {
      try {
        const postId = `urn:ngsi-ld:Post:post${randomNumber}`;
        const postData = {
          type: 'Post',
          id: postId,
          title: { type: 'Property', value: canvasData?.title },
          content: { type: 'Property', value: postValue },
          author: { type: 'Property', value: user?.nickname },
          auth0AuthorID: { type: 'Property', value: user?.sub },
          belongsTo: {
            type: 'Relationship',
            object: canvasData.canvasId,
          },
          keyData: {
            type: 'Property',
            value: {
              keyDataType: { type: 'Property', value: keyDataType === null ? 'N/A' : keyDataType},
              keyDataValue: { type: 'Property', value: keyDataValue },
            },
          },
          postedUnder: {
            type: 'Relationship',
            object: projectId,
          },
          isCommitment: {
            type: 'Property',
            value: isCommitment === null ? false : isCommitment
          },
          allowedOrgs: {
            type: 'Property',
            value: allowedOrgs
          }
        };

        await createEntity.makeRequests(postData);


        handlePostSuccess();
      } catch {
        console.error('error adding post');
      }
    }
  };

  const handleComment = async (postId) => {
    const randomNumber = Math.floor(Math.random() * 10000);

    if (commentValue) {
      try {
        await createEntity.makeRequests({
          type: 'Comment',
          id: `urn:ngsi-ld:Comment:comment${randomNumber}`,
          title: { type: 'Property', value: canvasData?.title },
          content: { type: 'Property', value: commentValue },
          author: { type: 'Property', value: user?.nickname },
          auth0AuthorID: { type: 'Property', value: user?.sub },
          replyTo: {
            type: 'Relationship',
            object: postId,
          },
          keyData: {
            type: 'Property',
            value: {
              keyDataType: { type: 'Property', value: keyDataType === null ? 'N/A' : keyDataType},
              keyDataValue: { type: 'Property', value: keyDataValue },
            },
          },
          postedUnder: {
            type: 'Relationship',
            object: projectId,
          },
          isCommitment: {
            type: 'Property',
            value: isCommitment === null ? false : isCommitment
          }
        });

        handleCommentSuccess(postId);
      } catch {
        console.error('error adding comment');
      }
    }
  };

  const handleEdit = async (data) => {

    if (data) {
      try {
        await updateEntity.makeRequests(data.postId, {
          content: { type: 'Property', value: data.content },
          keyData: {
            type: 'Property',
            value: {
              keyDataType: { type: 'Property', value: keyDataType === null ? data?.keyData.type : keyDataType},
              keyDataValue: { type: 'Property', value: data.keyData.value },
            },
          },
          isCommitment: {
            type: 'Property',
            value: isCommitment !== null ? isCommitment : data?.isCommitment
          },
          allowedOrgs: {
            type: 'Property',
            value: allowedOrgs
          }
        });

        handleEditSuccess();
      } catch {
        console.error('error adding post');
      }
    }
  };


  const handleCommitment = (e) => {
    setIsCommitment(e.target.checked);
  }

  return (
    <Grid container flexDirection={'column'}>
      <Grid item mb={2}>
        <Button color="warning" variant="contained" size="medium" sx={{ marginLeft: '10px' }} onClick={goBack}>
          Back
        </Button>
      </Grid>
      <Grid item mb={2}>
        <Card>
          <CardContent>
            <Typography variant="h4" fontSize={'20px'} mb={1.4}>
              {canvasData.title}
            </Typography>
            <Typography variant="body2">{canvasData.description}</Typography>
            {!addCommentMode && (
              <Box mt={2}>
                <Button color="primary" variant="contained" size="medium" startIcon={<AddCircleOutlineIcon />} onClick={() => setAddCommentMode(true)}>
                  Add a Comment
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      {addCommentMode && (
        <Grid item>
          <ChatBlockWrap sx={{ marginLeft: '54px', backgroundColor: '#f8f8f8', borderColor: '#015a8c' }}>
            <CardContent>
              <Box width={'100%'}>
                <ChatBlockTop mb={2}>
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} sx={{ lineHeight: '1.3' }}>
                    <Typography variant="h4" component={'h4'}>
                      Add Comment
                    </Typography>
                    <IconButton color="primary" size="small" onClick={() => setAddCommentMode(false)}>
                      <CloseIcon sx={{ fontSize: '22px' }} />
                    </IconButton>
                  </Box>
                </ChatBlockTop>
                <Box
                  mb={1}>
                          <PrivacySettings user={user} setAllowedOrgs={setAllowedOrgs} data={[]}/>
                </Box>
                <Box>
                  <TextField
                    minRows={3}
                    multiline={true}
                    fullWidth
                    onChange={(e) => setPostValue(e.target.value)}
                    placeholder="Type your message here"
                    sx={{ '.MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
                  />
                </Box>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={2}>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography mr={1.4} variant="h6" fontWeight={'600'}>
                      Key Data:
                    </Typography>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="key-data-type-label" required>
                          Type
                        </InputLabel>
                        <Select labelId="key-data-type-label" id="key-data-type" value={keyDataType} label="Type" onChange={(event) => setKeyDataType(event.target.value)} sx={{ marginRight: '14px' }}>
                          <MenuItem value={'N/A'}>N/A</MenuItem>
                          <MenuItem value={'Funds'}>Funds</MenuItem>
                          <MenuItem value={'Date'}>Date</MenuItem>
                          <MenuItem value={'Months'}>Months</MenuItem>
                          <MenuItem value={'Days'}>Days</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    {keyDataType && keyDataType !== 'N/A' && (
                      <TextField
                        name={keyDataType}
                        label={keyDataType}
                        placeholder={`Provide ${keyDataType}`}
                        onChange={(event) => {
                          setKeyDataValue(event.target.value);
                        }}
                        value={keyDataValue}
                        type={keyDataType === 'Funds' ? 'number' : 'text'}
                        variant="outlined"
                        required
                        size="small"
                        InputProps={{
                          startAdornment: <>{keyDataType === 'Funds' && <InputAdornment position="start">€</InputAdornment>}</>,
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  </Box>
                  <Box>
                    <FormControlLabel control={<Checkbox defaultChecked={isCommitment} onChange={handleCommitment} />} label={user['https://auth.dpi.com/roles'][0] === 'Funder' ? 'Intent' : 'Request'} />
                    <Button variant="contained" onClick={handlePost}>
                       Save
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </ChatBlockWrap>
        </Grid>
      )}
      <Grid item mt={2}>
        {posts ? (
          posts.filter((item)=>{
            if(item.allowedOrgs.length === 0){
              return true
            }else if (!Array.isArray(item.allowedOrgs)){
              return item.allowedOrgs === user["https://auth.dpi.com/org_id"]
            }else{
              return item.allowedOrgs.includes(user["https://auth.dpi.com/org_id"])
            }
          }).map((post, index) => {
            const associatedCommitment = commitments.find((commitment) => commitment.commmitTo === post.id);
            return (
              <>
                <ChatBlockWrap key={post.id} sx={{border: post.isCommitment ?'2px solid #3498db' : '1px solid transparent'}}>
                  <CardContent>
                    <Box sx={{ marginRight: '14px' }}>
                      <Avatar variant="rounded" sx={{ backgroundColor: '#F0F0F0', fontSize: '22px' }}>
                        {post.isCommitment ? <SummarizeIcon sx={{ color: '#015A8C' }} /> : '🙂'}
                      </Avatar>
                    </Box>
                    <Box>
                      <ChatBlockTop mb={2}>
                        <Box>
                          <Box sx={{ margin: '1px 0 2px 0' }}>
                            <Typography variant="h4" component={'h4'}>
                              {post.author}
                            </Typography>
                          </Box>
                          <Box sx={{ fontSize: '12px' }}>5th February 2024 Edited</Box>
                        </Box>
                      </ChatBlockTop>
                      <Box mb={2}>{post.content}</Box>
                      {
                        post.keyData.keyDataType.value !== 'N/A' && (
                          <Box display={'flex'} alignItems={'baseline'} sx={{ backgroundColor: '#3498db', color: '#fff', padding: '8px 14px', borderRadius: '10px' }}>
                            <Typography variant="h6" mr={0.8} fontWeight={'400'}>
                              Key Data:
                            </Typography>
                            <Typography variant="body2" fontWeight={'bold'}>
                              {post.keyData.keyDataType.value} {post.keyData.keyDataValue.value}
                              {post.keyData.keyDataType.value === 'Funds' && '€'}
                            </Typography>
                          </Box>
                        )
                      }


                      <ActionsBlock>
                        {
                          post.auth0AuthorID === user.sub && (
                            <IconButton color="primary" onClick={() => toggleEditBlock(index)} className={editBlockOpenIndex === index ? 'active' : ''} sx={{ backgroundColor: '#EBF8FF' }}>
                              <CreateOutlinedIcon />
                            </IconButton>
                          )
                        }          

                        <>
                          <IconButton color="primary" onClick={() => toggleReplyBlock(index)} className={replyBlockOpenIndex === index ? 'active' : ''} sx={{ backgroundColor: '#EBF8FF' }}>
                            <MessageOutlinedIcon />
                          </IconButton>
                        </>

                      </ActionsBlock>
                    </Box>
                  </CardContent>
                </ChatBlockWrap>
                {editBlockOpenIndex === index && (
                  <ChatBlockWrap sx={{ marginLeft: '54px', backgroundColor: '#f8f8f8', borderColor: '#015a8c' }}>
                    <CardContent>
                      <Box width={'100%'}>
                        <ChatBlockTop mb={2}>
                          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} sx={{ lineHeight: '1.3' }}>
                            <Typography variant="h4" component={'h4'}>
                              Edit Comment
                            </Typography>
                            <IconButton color="primary" size="small" onClick={() => setEditBlockOpenIndex(null)}>
                              <CloseIcon sx={{ fontSize: '22px' }} />
                            </IconButton>
                          </Box>
                        </ChatBlockTop>
                        <Box
                          mb={1}>
                          <PrivacySettings user={user} setAllowedOrgs={setAllowedOrgs} data={post.allowedOrgs}/>
                        </Box>
                        <Box sx={{ position: 'relative' }}>
                          <TextField
                            minRows={3}
                            multiline={true}
                            fullWidth
                            value={editValue !==null ? editValue : post.content}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="Type your message here"
                            sx={{ '.MuiOutlinedInput-root': { paddingBottom: '60px', backgroundColor: '#fff' } }}
                          />
                        </Box>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={2}>
                          <Box display={'flex'} alignItems={'center'}>
                            <Typography mr={1.4} variant="h6" fontWeight={'600'}>
                              Key Data:
                            </Typography>
                            <Box sx={{ minWidth: 120 }}>
                              <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel id="key-data-type-label" required>
                                  Type
                                </InputLabel>
                                <Select
                                  labelId="key-data-type-label"
                                  id="key-data-type"
                                  value={keyDataType !== null ? keyDataType : (post?.keyData?.keyDataType?.value && post.keyData.keyDataType.value)}
                                  label="Type"
                                  onChange={(event) => {
                                    setKeyDataType(event.target.value);
                                    setKeyDataValue('');
                                  }}
                                  sx={{ marginRight: '14px' }}
                                >
                                  <MenuItem value={'N/A'}>N/A</MenuItem>
                                  <MenuItem value={'Funds'}>Funds</MenuItem>
                                  <MenuItem value={'Date'}>Date</MenuItem>
                                  <MenuItem value={'Months'}>Months</MenuItem>
                                  <MenuItem value={'Days'}>Days</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>

                            {((keyDataType && keyDataType !== 'N/A') || (!keyDataType && post?.keyData && post?.keyData.keyDataType.value !== 'N/A'))&& <TextField
                              name={keyDataType !== null ? keyDataType : (post.keyData.keyDataType.value && post.keyData.keyDataType.value)}
                              placeholder={`Provide ${keyDataType !== null ? keyDataType : (post.keyData.keyDataType.value && post.keyData.keyDataType.value)}`}
                              onChange={(event) => setKeyDataValue(event.target.value)}
                              value={keyDataValue !== null ? keyDataValue : (post.keyData.keyDataValue.value && post.keyData.keyDataValue.value)}
                              type={keyDataType === 'Funds' || (post.keyData.keyDataType.value && post.keyData.keyDataType.value === 'Funds') ? 'number' : 'text'}
                              variant="outlined"
                              required
                              size="small"
                              InputProps={{
                                startAdornment: <>{keyDataType === 'Funds' && <InputAdornment position="start">€</InputAdornment>}</>,
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />}

                          </Box>
                          <Box>
                            <FormControlLabel control={<Checkbox defaultChecked={post.isCommitment} onChange={handleCommitment} />} label={user['https://auth.dpi.com/roles'][0] === 'Funder' ? 'Intent' : 'Request'} />

                            <Button
                              variant="contained"
                              onClick={() => {
                                const data = { isCommitment:post.isCommitment ? post.isCommitment : isCommitment,postId: post.id, content: editValue || post.content, keyData: { type: keyDataType !== null ? keyDataType : (post && post.keyData.keyDataType.value), value: keyDataValue !== null ? keyDataValue : (post && post.keyData.keyDataValue.value) } };
                                handleEdit(data);
                              }}
                            >
                              {user['https://auth.dpi.com/roles'][0] === 'Funder' ? 'Promise' : 'Save'}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </ChatBlockWrap>
                )}

                {replyBlockOpenIndex === index && (
                  <>
                    <ChatBlockWrap sx={{ marginLeft: '54px', backgroundColor: '#f8f8f8', borderColor: '#015a8c' }}>
                      <CardContent>
                        <Box width={'100%'}>
                          <ChatBlockTop mb={2}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} sx={{ lineHeight: '1.3' }}>
                              <Typography variant="h4" component={'h4'}>
                                Reply to {post.author}
                              </Typography>
                              <IconButton color="primary" size="small" onClick={() => setReplyBlockOpenIndex(null)}>
                                <CloseIcon sx={{ fontSize: '22px' }} />
                              </IconButton>
                            </Box>
                          </ChatBlockTop>
                          <Box sx={{ position: 'relative' }}>
                            <TextField
                              minRows={3}
                              multiline={true}
                              fullWidth
                              onChange={(e) => setCommentValue(e.target.value)}
                              placeholder="Type your message here"
                              sx={{ '.MuiOutlinedInput-root': { paddingBottom: '60px', backgroundColor: '#fff' } }}
                            />
                          </Box>
                          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={2}>
                            <Box display={'flex'} alignItems={'center'}>
                              <Typography mr={1.4} variant="h6" fontWeight={'600'}>
                                Key Data:
                              </Typography>
                              <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth variant="outlined" size="small">
                                  <InputLabel id="key-data-type-label" required>
                                    Type
                                  </InputLabel>
                                  <Select
                                    labelId="key-data-type-label"
                                    id="key-data-type"
                                    value={keyDataType}
                                    label="Type"
                                    onChange={(event) => {
                                      setKeyDataType(event.target.value);
                                      setKeyDataValue('');
                                    }}
                                    sx={{ marginRight: '14px' }}
                                  >
                                    <MenuItem value={'N/A'}>N/A</MenuItem>
                                    <MenuItem value={'Funds'}>Funds</MenuItem>
                                    <MenuItem value={'Date'}>Date</MenuItem>
                                    <MenuItem value={'Months'}>Months</MenuItem>
                                    <MenuItem value={'Days'}>Days</MenuItem>
                                  </Select>
                                </FormControl>
                              </Box>
                              {keyDataType && keyDataType !== 'N/A' && (
                                <TextField
                                  name={keyDataType}
                                  label={keyDataType}
                                  placeholder={`Provide ${keyDataType}`}
                                  onChange={(event) => {
                                    setKeyDataValue(event.target.value);
                                  }}
                                  value={keyDataValue}
                                  type={keyDataType === 'Funds' ? 'number' : 'text'}
                                  variant="outlined"
                                  required
                                  size="small"
                                  InputProps={{
                                    startAdornment: <>{keyDataType === 'Funds' && <InputAdornment position="start">€</InputAdornment>}</>,
                                  }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              )}
                            </Box>
                            <Box>
                              <FormControlLabel control={<Checkbox defaultChecked={isCommitment} onChange={handleCommitment} />} label={user['https://auth.dpi.com/roles'][0] === 'Funder' ? 'Intent' : 'Request'} />

                              <Button
                                variant="contained"
                                onClick={() => handleComment(post.id)}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </ChatBlockWrap>
                  </>

                )}

                <ProjectSectionReplies postId={post.id} fetchComments={fetchComments} />

              </>
            );
          })
        ) : (
          <Typography variant="h5">No posts yet</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ProjectSectionComments;
