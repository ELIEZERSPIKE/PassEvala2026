import React from 'react';
import { FlashInfo } from '../api/flashApi';

interface FlashInfoTableProps {
  data: FlashInfo[];
  onEdit: (flash: FlashInfo) => void;
  onDelete: (id: number) => void;
  isMutating: boolean;
}

export const FlashInfoTable: React.FC<FlashInfoTableProps> = ({ data, onEdit, onDelete, isMutating }) => {
  if (data.length === 0) {
    return <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Aucun flash info trouvé.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Titre</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Lien</th>
          <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((flash) => (
          <tr key={flash.id} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '12px' }}>{flash.title}</td>
            <td style={{ padding: '12px' }}>
              {flash.link ? (
                <a href={flash.link} target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>
                  {flash.link}
                </a>
              ) : (
                <span style={{ color: '#999', fontStyle: 'italic' }}>Aucun</span>
              )}
            </td>
            <td style={{ padding: '12px', textAlign: 'right' }}>
              <button 
                onClick={() => onEdit(flash)}
                style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Modifier
              </button>
              <button 
                onClick={() => onDelete(flash.id)}
                disabled={isMutating}
                style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: isMutating ? 'not-allowed' : 'pointer' }}
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};