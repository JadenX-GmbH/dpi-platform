import { CSSProperties } from 'react';
import ReceiptLongTwoToneIcon from '@mui/icons-material/ReceiptLongTwoTone';
import { DeleteForeverTwoTone, OpenInBrowserTwoTone } from '@mui/icons-material';

const AgreementTableView = () => {
  const tableStyle: CSSProperties = {
    width: '90%',
    borderCollapse: 'collapse',
    borderRadius: '20px',
    overflow: 'hidden',
  };

  const cellStyle: CSSProperties = {
    borderBottom: '2px solid #ddd',
    padding: '12px 10px',
    textAlign: 'left',
  };

  const headerCellStyle: CSSProperties = {
    ...cellStyle,
    backgroundColor: '#f2f2f2',
  };


  const iconStyle: CSSProperties = {
    marginRight: '5px', // Add space between icon and text
    verticalAlign: 'middle', // Align icon vertically with text
  };

  return (
    <table style={tableStyle}>
      <thead>
      <tr>
        <th style={headerCellStyle}>FILENAME</th>
        <th style={headerCellStyle}>OWNER</th>
        <th style={headerCellStyle}>DATE CHANGED</th>
        <th style={headerCellStyle}>ACTIONS</th>

      </tr>
      </thead>
      <tbody>
      <tr>
        <td style={cellStyle}>
          <ReceiptLongTwoToneIcon style={iconStyle} /> Letter of Intent
        </td>
        <td style={cellStyle}>KfW</td>
        <td style={cellStyle}>2024-04-10</td>
        <td style={cellStyle}>
          <DeleteForeverTwoTone style={iconStyle} />
          <OpenInBrowserTwoTone style={iconStyle} />
        </td>
      </tr>
      <tr>
        <td style={cellStyle}>
          <ReceiptLongTwoToneIcon style={iconStyle} /> Memorandum of Understanding
        </td>
        <td style={cellStyle}>Partner Country</td>
        <td style={cellStyle}>2024-07-13</td>
        <td style={cellStyle}>
          <DeleteForeverTwoTone style={iconStyle} />
          <OpenInBrowserTwoTone style={iconStyle} />
        </td>
      </tr>
      <tr>
        <td style={cellStyle}>
          <ReceiptLongTwoToneIcon style={iconStyle} /> Contract
        </td>
        <td style={cellStyle}>Co-Develop</td>
        <td style={cellStyle}>2024-10-25</td>
        <td style={cellStyle}>
          <DeleteForeverTwoTone style={iconStyle} />
          <OpenInBrowserTwoTone style={iconStyle} />
        </td>
      </tr>
      </tbody>
    </table>
  );
};

export default AgreementTableView;