export type Post = {
  id: string;
  type: string;
  author: string;
  belongsTo: string;
  content: string;
  title: string;
  isCommitment: boolean;
  keyData: {
    keyDataType: {
      type: string;
      value: string;
    };
    keyDataValue: {
      type: string;
      value: string;
    };
  };
  auth0AuthorID:string,
  allowedOrgs: string[]
};

export type Comment = {
  id: string;
  type: string;
  author: string;
  replyTo: string;
  content: string;
  title: string;
  auth0AuthorID:string
};

export type Commitment = {
  id: string;
  type: string;
  author: string;
  commmitTo: string;
  content: string;
  keyData: {
    keyDataType: {
      type: string;
      value: string;
    };
    keyDataValue: {
      type: string;
      value: string;
    };
  };
  title: string;
  isCommitment: boolean;
  auth0AuthorID:string
};
