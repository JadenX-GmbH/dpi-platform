export type Canvas = {
  id: string;
  type: string;
  order: number;
  topicsGroup: {
    groupId: {
      type: string;
      value: number;
    };
    title: {
      type: string;
      value: string;
    };
  };
  description: string;
  title: string;
};
