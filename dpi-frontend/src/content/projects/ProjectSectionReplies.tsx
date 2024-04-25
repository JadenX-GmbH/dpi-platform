
import { Avatar, Box, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, Zoom, styled } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useGetEntitiesByQuery } from 'src/hooks/api/ngsi-ld/useGetEntitiesByQuery';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useUpdateEntityById } from 'src/hooks/combined/useUpdateEntityById';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { useCreateEntity } from 'src/hooks/combined/useCreateEntity';
import { useAuth0 } from '@auth0/auth0-react';
import SummarizeIcon from '@mui/icons-material/Summarize';


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


const ProjectSectionReplies = ({ postId, fetchComments }) => {
    const { makeRequest, loading, error, responseStatus } = useGetEntitiesByQuery();
    const { user } = useAuth0();

    const updateEntity = useUpdateEntityById();
    const createEntity = useCreateEntity();

    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState([]);
    const [replyBlockOpenIndex, setReplyBlockOpenIndex] = useState(null);
    const [editBlockOpenIndex, setEditBlockOpenIndex] = useState(null);
    const [editValue, setEditValue] = useState(null);
    const [keyDataType, setKeyDataType] = useState(null);
    const [keyDataValue, setKeyDataValue] = useState(null);
    const [commentValue, setCommentValue] = useState('');

    const [fetchReply, setFetchReply] = useState(false);
    const [fetchComment, setFetchComment] = useState(false);


    const [isCommitment, setIsCommitment] = useState<boolean>(null);


    const handleCommitment = (e) => {
        setIsCommitment(e.target.checked);
    }


    useEffect(() => {
        makeRequest({
            linkHeader: process.env.REACT_APP_DPI_NGSI_CONTEXT ?? 'http://context/json-context.jsonld',
            keyValues: true,
            type: 'Comment',
            query: `replyTo=="${postId}"`,
        }).then((assets) => {
            if (assets) setComments(assets.data)

        });
    }, [fetchComments, fetchComment]);

    useEffect(() => {
        comments.forEach((comment) => {
            fetchReplies(comment.id);
        });
    }, [comments]);




    const fetchReplies = async (id) => {
        try {
            await makeRequest({
                linkHeader: process.env.REACT_APP_DPI_NGSI_CONTEXT ?? 'http://context/json-context.jsonld',
                keyValues: true,
                type: 'Comment',
                query: `replyTo=="${id}"`,
            }).then((assets) => {
                if (assets) {

                    const existingIndex = replies.findIndex((reply) => reply.commentId === id);
                    if (existingIndex === -1) {

                        setReplies((prevReplies) => [
                            ...prevReplies,
                            { commentId: id, replies: assets.data },
                        ]);
                    } else {

                        setReplies((prevReplies) => {
                            const updatedReplies = [...prevReplies];
                            updatedReplies[existingIndex] = { commentId: id, replies: assets.data };
                            return updatedReplies;
                        });
                    }
                }
            });
        } catch (error) {

        }
    }

    const toggleReplyBlock = (index) => {
        setKeyDataType(null);
        setKeyDataValue(null);
        setIsCommitment(null);
        setReplyBlockOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const toggleEditBlock = (index) => {
        setKeyDataType(null);
        setKeyDataValue(null);
        setIsCommitment(null);
        setEditBlockOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const handleEdit = async (data) => {
        if (data) {
            try {
                await updateEntity.makeRequests(data.id, {


                    content: { type: 'Property', value: editValue !== null ? editValue : data.content },
                    keyData: {
                        type: 'Property',
                        value: {
                            keyDataType: { type: 'Property', value: keyDataType !== null ? keyDataType : data.keyData.keyDataType.value },
                            keyDataValue: { type: 'Property', value: keyDataValue !== null ? keyDataValue : data.keyData.keyDataValue.value },
                        },
                    },
                    isCommitment: { type: 'Property', value: isCommitment === null ? data.isCommitment : isCommitment },
                });
                handleEditSuccess();
            } catch {
                console.error('error editing comment');
            }
        }
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

        setEditValue(null);
        setKeyDataType(null);
        setKeyDataValue(null);
        setFetchComment((prevValue) => !prevValue);

        setEditBlockOpenIndex(null);
    };


    const handleComment = async (data) => {
        const randomNumber = Math.floor(Math.random() * 100000);

        if (commentValue) {
            try {
                await createEntity.makeRequests({
                    type: 'Comment',
                    id: `urn:ngsi-ld:Comment:comment${randomNumber}`,
                    title: { type: 'Property', value: data.title },
                    content: { type: 'Property', value: commentValue },
                    author: { type: 'Property', value: user?.nickname },
                    auth0AuthorID: { type: 'Property', value: user?.sub },
                    replyTo: {
                        type: 'Relationship',
                        object: data?.id,
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
                        object: data.postedUnder,
                    },
                    isCommitment: {
                        type: 'Property',
                        value: isCommitment === null ? false : isCommitment
                    }
                });
                fetchReplies(data.id);
                handleCommentSuccess(postId);
            } catch {
                console.error('error adding comment');
            }
        }
    }

    const handleCommentSuccess = (postId) => {
        enqueueSnackbar('A new reply has been added successfully', {
            variant: 'success',
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            },
            TransitionComponent: Zoom,
        });

        setCommentValue(null);
        setFetchReply((prevValue) => !prevValue);
        setReplyBlockOpenIndex(false);
    };


    const getRepliesForCommentId = (commentId) => {
        return replies.filter((reply) => reply.commentId === commentId);
    };


    return (<>
        {comments.map((comment) => {
            const commentReplies = getRepliesForCommentId(comment.id);

            return (

                <>
                    <ChatBlockWrap sx={{ marginLeft: '54px', border: comment.isCommitment ?'2px solid #3498db' : '1px solid transparent' }} key={comment.id}>
                        <CardContent>
                            <Box sx={{ marginRight: '14px' }}>
                                <Avatar variant="rounded" sx={{ backgroundColor: '#F0F0F0', fontSize: '22px' }}>
                                    {comment.isCommitment ? <SummarizeIcon sx={{ color: '#015A8C' }} /> : '🙂'}
                                </Avatar>
                            </Box>
                            <Box>
                                <ChatBlockTop mb={2}>
                                    <Box>
                                        <Box sx={{ margin: '1px 0 2px 0' }}>
                                            <Typography variant="h4" component={'h4'}>
                                                {comment.author}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ fontSize: '12px' }}>5th February 2024 Edited</Box>
                                    </Box>
                                </ChatBlockTop>
                                <Box mb={2}>{comment.content}</Box>
                                {
                                    comment.keyData.keyDataType.value !== 'N/A' && (
                                        <Box display={'flex'} alignItems={'baseline'} sx={{ backgroundColor: '#3498db', color: '#fff', padding: '8px 14px', borderRadius: '10px' }}>
                                            <Typography variant="h6" mr={0.8} fontWeight={'400'}>
                                                Promise:
                                            </Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {comment?.keyData?.keyDataType?.value} {comment?.keyData?.keyDataValue?.value}
                                                {comment?.keyData?.keyDataType?.value === 'Funds' && '€'}
                                            </Typography>
                                        </Box>
                                    )
                                }

                                <ActionsBlock>
                                    {
                                        comment.auth0AuthorID === user.sub && (
                                            <IconButton color="primary" onClick={() => toggleEditBlock(comment.id)} className={editBlockOpenIndex === comment.id ? 'active' : ''} sx={{ backgroundColor: '#EBF8FF' }}>
                                                <CreateOutlinedIcon />
                                            </IconButton>
                                        )
                                    }              
                                    <>
                                        <IconButton color="primary" onClick={() => toggleReplyBlock(comment.id)} className={replyBlockOpenIndex === comment.id ? 'active' : ''} sx={{ backgroundColor: '#EBF8FF' }}>
                                            <MessageOutlinedIcon />
                                        </IconButton>
                                    </>

                                </ActionsBlock>
                            </Box>
                        </CardContent>
                    </ChatBlockWrap>

                    {editBlockOpenIndex === comment.id && (
                        <ChatBlockWrap sx={{ marginLeft: '54px', backgroundColor: '#f8f8f8', borderColor: '#015a8c' }}>
                            <CardContent>
                                <Box width={'100%'}>
                                    <ChatBlockTop mb={2}>
                                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} sx={{ lineHeight: '1.3' }}>
                                            <Typography variant="h4" component={'h4'}>
                                                Edit Reply to {comment.author}
                                            </Typography>
                                            <IconButton color="primary" size="small" onClick={() => setEditBlockOpenIndex(null)}>
                                                <CloseIcon sx={{ fontSize: '22px' }} />
                                            </IconButton>
                                        </Box>
                                    </ChatBlockTop>
                                    <Box sx={{ position: 'relative' }}>
                                        <TextField
                                            minRows={3}
                                            multiline={true}
                                            fullWidth
                                            value={editValue !== null ? editValue : comment.content}
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
                                                        value={keyDataType !== null ? keyDataType : (comment?.keyData && comment?.keyData.keyDataType.value)}
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
                                            {((keyDataType && keyDataType !== 'N/A') || (!keyDataType && comment?.keyData && comment?.keyData.keyDataType.value !== 'N/A')) && (
                                                <TextField
                                                    name={keyDataType !== null ? keyDataType : (comment?.keyData && comment?.keyData.keyDataType.value)}
                                                    label={keyDataType !== null ? keyDataType : (comment?.keyData && comment?.keyData.keyDataType.value)}
                                                    placeholder={`Provide ${keyDataType !== null ? keyDataType : (comment?.keyData && comment?.keyData.keyDataType.value)}`}
                                                    onChange={(event) => setKeyDataValue(event.target.value)}
                                                    value={keyDataValue !== null ? keyDataValue : (comment?.keyData && comment?.keyData.keyDataValue.value)}
                                                    type={keyDataType === 'Funds' || (comment?.keyData && comment?.keyData.keyDataType.value === 'Funds') ? 'number' : 'text'}
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
                                            <FormControlLabel control={<Checkbox defaultChecked={comment.isCommitment} onChange={handleCommitment} />} label={user['https://auth.dpi.com/roles'][0] === 'Funder' ? 'Intent' : 'Request'} />

                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    handleEdit(comment);
                                                }}
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </ChatBlockWrap>
                    )}

                    {replyBlockOpenIndex === comment.id && (
                        <>
                            <ChatBlockWrap sx={{ marginLeft: '54px', backgroundColor: '#f8f8f8', borderColor: '#015a8c' }}>
                                <CardContent>
                                    <Box width={'100%'}>
                                        <ChatBlockTop mb={2}>
                                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} sx={{ lineHeight: '1.3' }}>
                                                <Typography variant="h4" component={'h4'}>
                                                    Reply to {comment.author}
                                                </Typography>
                                                <IconButton color="primary" size="small" onClick={() => {
                                                    setReplyBlockOpenIndex(null)
                                                    setKeyDataType(null);
                                                    setKeyDataValue(null);
                                                    setIsCommitment(null);
                                                }}>
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
                                                {(keyDataType && keyDataType !== 'N/A')  && (
                                                    <TextField
                                                        name={keyDataType }
                                                        label={keyDataType }
                                                        placeholder={`Provide ${keyDataType }`}
                                                        onChange={(event) => setKeyDataValue(event.target.value)}
                                                        value={keyDataValue}
                                                        type={keyDataType === 'Funds'? 'number' : 'text'}
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
                                                    onClick={() => handleComment(comment)}
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





                    {

                        commentReplies[0]?.replies?.map((reply) =>


                        (
                            <>


                                <ChatBlockWrap sx={{ marginLeft: '54px', border: reply.isCommitment ?'2px solid #3498db' : '1px solid transparent' }} key={reply.id}>
                                    <CardContent>
                                        <Box sx={{ marginRight: '14px' }}>
                                            <Avatar variant="rounded" sx={{ backgroundColor: '#F0F0F0', fontSize: '22px' }}>
                                                {reply.isCommitment ? <SummarizeIcon sx={{ color: '#015A8C' }} /> : '🙂'}
                                            </Avatar>
                                        </Box>
                                        <Box>
                                            <ChatBlockTop mb={2}>
                                                <Box>
                                                    <Box sx={{ margin: '1px 0 2px 0' }}>
                                                        <Typography variant="h4" component={'h4'}>
                                                            {reply.author}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ fontSize: '12px' }}>5th February 2024 Edited</Box>
                                                </Box>
                                            </ChatBlockTop>
                                            <Box mb={2}>{reply.content}</Box>
                                            {
                                                reply.keyData.keyDataType.value !== 'N/A' && (
                                                    <Box display={'flex'} alignItems={'baseline'} sx={{ backgroundColor: '#3498db', color: '#fff', padding: '8px 14px', borderRadius: '10px' }}>
                                                        <Typography variant="h6" mr={0.8} fontWeight={'400'}>
                                                            Promise:
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={'bold'}>
                                                            {reply?.keyData?.keyDataType?.value} {reply?.keyData?.keyDataValue?.value}
                                                            {reply?.keyData?.keyDataType?.value === 'Funds' && '€'}
                                                        </Typography>
                                                    </Box>
                                                )
                                            }

                                            <ActionsBlock>
                                                {
                                                    reply.auth0AuthorID === user.sub && (
                                                        <IconButton color="primary" onClick={() => toggleEditBlock(reply.id)} className={editBlockOpenIndex === reply.id ? 'active' : ''} sx={{ backgroundColor: '#EBF8FF' }}>
                                                            <CreateOutlinedIcon />
                                                        </IconButton>
                                                    )
                                                }
                                                <>
                                                    <IconButton color="primary" onClick={() => toggleReplyBlock(reply.id)} className={replyBlockOpenIndex === reply.id ? 'active' : ''} sx={{ backgroundColor: '#EBF8FF' }}>
                                                        <MessageOutlinedIcon />
                                                    </IconButton>
                                                </>

                                            </ActionsBlock>
                                        </Box>
                                    </CardContent>
                                </ChatBlockWrap>

                                {editBlockOpenIndex === reply.id && (
                                    <ChatBlockWrap sx={{ marginLeft: '54px', backgroundColor: '#f8f8f8', borderColor: '#015a8c' }}>
                                        <CardContent>
                                            <Box width={'100%'}>
                                                <ChatBlockTop mb={2}>
                                                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} sx={{ lineHeight: '1.3' }}>
                                                        <Typography variant="h4" component={'h4'}>
                                                            Edit Reply to {reply.author}
                                                        </Typography>
                                                        <IconButton color="primary" size="small" onClick={() => setEditBlockOpenIndex(null)}>
                                                            <CloseIcon sx={{ fontSize: '22px' }} />
                                                        </IconButton>
                                                    </Box>
                                                </ChatBlockTop>
                                                <Box sx={{ position: 'relative' }}>
                                                    <TextField
                                                        minRows={3}
                                                        multiline={true}
                                                        fullWidth
                                                        value={editValue !== null ? editValue : reply.content}
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
                                                                    value={keyDataType !== null ? keyDataType : (reply?.keyData && reply?.keyData.keyDataType.value)}
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
                                                        {((keyDataType && keyDataType !== 'N/A') || (!keyDataType && reply?.keyData && reply?.keyData.keyDataType.value !== 'N/A')) && (
                                                            <TextField
                                                                name={keyDataType !== null ? keyDataType : (reply?.keyData && reply?.keyData.keyDataType.value)}
                                                                label={keyDataType !== null ? keyDataType : (reply?.keyData && reply?.keyData.keyDataType.value)}
                                                                placeholder={`Provide ${keyDataType !== null ? keyDataType : (reply?.keyData && reply?.keyData.keyDataType.value)}`}
                                                                onChange={(event) => setKeyDataValue(event.target.value)}
                                                                value={keyDataValue !== null ? keyDataValue : (reply?.keyData && reply?.keyData.keyDataValue.value)}
                                                                type={keyDataType === 'Funds' || (reply?.keyData && reply?.keyData.keyDataType.value === 'Funds') ? 'number' : 'text'}
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
                                                        <FormControlLabel control={<Checkbox defaultChecked={reply.isCommitment} onChange={handleCommitment} />} label={user['https://auth.dpi.com/roles'][0] === 'Funder' ? 'Intent' : 'Request'} />

                                                        <Button
                                                            variant="contained"
                                                            onClick={() => {
                                                                // const data = { postId: post.id, content: editValue || post.content, keyData: { type: keyDataType !== null ?  keyDataType : (associatedCommitment && associatedCommitment.keyData.keyDataType.value), value: keyDataValue } };
                                                                // if (associatedCommitment) data['commitmentId'] = associatedCommitment.id;
                                                                handleEdit(reply);
                                                            }}
                                                        >
                                                            Save
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </ChatBlockWrap>
                                )}

                                {replyBlockOpenIndex === reply.id && (
                                    <>
                                        <ChatBlockWrap sx={{ marginLeft: '54px', backgroundColor: '#f8f8f8', borderColor: '#015a8c' }}>
                                            <CardContent>
                                                <Box width={'100%'}>
                                                    <ChatBlockTop mb={2}>
                                                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={'100%'} sx={{ lineHeight: '1.3' }}>
                                                            <Typography variant="h4" component={'h4'}>
                                                                Reply to {reply.author}
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
                                                            {(keyDataType && keyDataType !== 'N/A')  && (
                                                                <TextField
                                                                    name={keyDataType}
                                                                    label={keyDataType}
                                                                    placeholder={`Provide ${keyDataType !== null ? keyDataType : (reply?.keyData && reply?.keyData.keyDataType.value)}`}
                                                                    onChange={(event) => setKeyDataValue(event.target.value)}
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
                                                                onClick={() => handleComment(comment)}
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



                            </>
                        ))
                    }

                </>

            )
        }

        )
        }
    </>
    )
}

export default ProjectSectionReplies