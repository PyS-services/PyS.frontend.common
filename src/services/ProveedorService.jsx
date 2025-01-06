import axios from 'axios';
import Proveedor from '../models/Proveedor';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/common-service/proveedor/`;

class ProveedorService {
  async getProveedores() {
    console.log('GET Proveedores - URL:', BASE_URL);
    try {
      const response = await axios.get(BASE_URL);
      console.log('GET Proveedores - Response:', response.data);
      return response.data.map(proveedor => Proveedor.fromJson(proveedor));
    } catch (error) {
      console.error('GET Proveedores - Error:', error);
      throw error;
    }
  }

  async getProveedoresPaginados(page, size) {
    const url = `${BASE_URL}page`;
    console.log('GET Proveedores Paginados - URL:', url);
    console.log('GET Proveedores Paginados - Params:', { page, size });
    try {
      const response = await axios.get(url, {
        params: { page, size }
      });
      console.log('GET Proveedores Paginados - Response:', response.data);
      return {
        content: response.data.content.map(proveedor => Proveedor.fromJson(proveedor)),
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        size: response.data.size,
        number: response.data.number
      };
    } catch (error) {
      console.error('GET Proveedores Paginados - Error:', error);
      throw error;
    }
  }

  async addProveedor(proveedor) {
    console.log('POST Proveedor - URL:', BASE_URL);
    console.log('POST Proveedor - Data:', proveedor.toJson());
    try {
      const response = await axios.post(BASE_URL, proveedor.toJson());
      console.log('POST Proveedor - Response:', response.data);
      return Proveedor.fromJson(response.data);
    } catch (error) {
      console.error('POST Proveedor - Error:', error);
      throw error;
    }
  }

  async updateProveedor(proveedor) {
    const url = `${BASE_URL}${proveedor.proveedorId}`;
    console.log('PUT Proveedor - URL:', url);
    console.log('PUT Proveedor - Data:', proveedor.toJson());
    try {
      const response = await axios.put(url, proveedor.toJson());
      console.log('PUT Proveedor - Response:', response.data);
      return Proveedor.fromJson(response.data);
    } catch (error) {
      console.error('PUT Proveedor - Error:', error);
      throw error;
    }
  }

  async deleteProveedor(proveedorId) {
    const url = `${BASE_URL}${proveedorId}`;
    console.log('DELETE Proveedor - URL:', url);
    try {
      const response = await axios.delete(url);
      console.log('DELETE Proveedor - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('DELETE Proveedor - Error:', error);
      throw error;
    }
  }

  async findByCuit(cuit) {
    const url = `${BASE_URL}cuit/${cuit}`;
    console.log('GET Proveedor by CUIT - URL:', url);
    try {
      const response = await axios.get(url);
      console.log('GET Proveedor by CUIT - Response:', response.data);
      return Proveedor.fromJson(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('GET Proveedor by CUIT - Not found');
        return null; // CUIT no existe
      }
      console.error('GET Proveedor by CUIT - Error:', error);
      throw error;
    }
  }
}

export default new ProveedorService(); 