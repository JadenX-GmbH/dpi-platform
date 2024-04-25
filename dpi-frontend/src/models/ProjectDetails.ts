export type ProjectDetailsType = {
  alternateName: { type: string; value: string };
  category: { type: string; value: 'E-Payment' | 'E-Identity' | 'E-Health' | 'Data Exchange' };
  description: { type: string; value: string };
  image?: { type: string; value: string | ArrayBuffer; };
  funding?: { type: string; value: 'Offering' | 'Co-funding' };
  id?: string;
  type?: string;
  author: { type: string; value: string };
};
