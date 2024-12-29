import React, { useState } from 'react';
import './ImportCard.css';
import ImportListaService from '../services/ImportListaService';

function ImportCard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dollarRate, setDollarRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDollarRateChange = (e) => {
    const value = e.target.value;
    // Permite solo números y un punto decimal
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDollarRate(value);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !dollarRate) {
      alert('Por favor seleccione un archivo y ingrese la cotización del dólar');
      return;
    }

    try {
      setLoading(true);
      const processId = await ImportListaService.uploadFile(selectedFile, dollarRate);
      
      // Iniciar el polling del estado
      ImportListaService.pollStatus(processId, (statusUpdate) => {
        setStatus(statusUpdate);
        if (statusUpdate.status === 'COMPLETED' || statusUpdate.status === 'COMPLETADO') {
          alert('Importación completada exitosamente');
          setLoading(false);
        } else if (statusUpdate.status === 'ERROR') {
          alert('Error en la importación');
          setLoading(false);
        }
      });

    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="import-card">
      <h2>Importar Lista</h2>
      <div className="import-form">
        <div className="form-group">
          <label htmlFor="file-upload">Seleccionar archivo XLSX:</label>
          <input
            type="file"
            id="file-upload"
            accept=".xlsx"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dollar-rate">Cotización del dólar:</label>
          <input
            type="text"
            id="dollar-rate"
            value={dollarRate}
            onChange={handleDollarRateChange}
            placeholder="Ingrese la cotización"
          />
        </div>

        <button 
          className="import-button"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? 'Importando...' : 'Importar'}
        </button>

        {status && (
          <div className="status-container">
            <p>Estado: {status.status}</p>
            <p>Progreso: {status.progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportCard;