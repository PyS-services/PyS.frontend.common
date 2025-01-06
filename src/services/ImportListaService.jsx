import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/common-service/import/listaIveco`;

class ImportListaService {
    async uploadFile(file, cotizacionDolar) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('cotizacionDolar', cotizacionDolar);

            const response = await axios.post(`${BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data; // Este será el processId
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data);
            }
            throw new Error('Error al subir el archivo');
        }
    }

    async checkStatus(processId) {
        try {
            const response = await axios.get(`${BASE_URL}/status/${processId}`);
            return response.data; // Retorna ProcessStatusDto
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error('Proceso no encontrado');
            }
            throw new Error('Error al verificar el estado del proceso');
        }
    }

    async pollStatus(processId, onStatusUpdate, intervalMs = 2000) {
        const checkStatus = async () => {
            try {
                const status = await this.checkStatus(processId);
                onStatusUpdate(status);

                if (status.status === 'COMPLETED' || status.status === 'ERROR') {
                    return; // Detiene el polling cuando el proceso termina
                }

                // Continúa el polling
                setTimeout(checkStatus, intervalMs);
            } catch (error) {
                onStatusUpdate({ status: 'ERROR', progress: 0 });
            }
        };

        // Inicia el polling
        checkStatus();
    }
}

export default new ImportListaService();
