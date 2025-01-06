import React, { useState, useEffect } from 'react';
import ProveedorService from '../services/ProveedorService';
import { Table, Button, Modal, Form, Row, Col, Pagination, Form as BootstrapForm } from 'react-bootstrap';
import './ProveedoresCard.css';
import Proveedor from '../models/Proveedor';

function ProveedoresCard() {
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [formData, setFormData] = useState(Proveedor.createEmpty());
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [cuitError, setCuitError] = useState('');

  const pageSizeOptions = [10, 20, 50, 100];

  const posicionesIva = [
    { id: 1, descripcion: "Resp.Inscripto" },
    { id: 2, descripcion: "Consum.Final" },
    { id: 3, descripcion: "Monotributista" },
    { id: 4, descripcion: "Resp.No Inscripto" },
    { id: 5, descripcion: "Exportación" },
    { id: 6, descripcion: "Exento" }
  ];

  useEffect(() => {
    fetchProveedores();
  }, [currentPage, pageSize]);

  const fetchProveedores = async () => {
    try {
      const response = await ProveedorService.getProveedoresPaginados(currentPage, pageSize);
      setProveedores(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching proveedores:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  useEffect(() => {
    if (currentProveedor) {
      setFormData(currentProveedor);
    } else {
      setFormData(Proveedor.createEmpty());
    }
  }, [currentProveedor]);

  const handleAdd = () => {
    setCurrentProveedor(null);
    setShowModal(true);
  };

  const handleEdit = (proveedor) => {
    setCurrentProveedor(proveedor);
    setShowModal(true);
  };

  const handleDelete = async (proveedorId) => {
    await ProveedorService.deleteProveedor(proveedorId);
    fetchProveedores();
  };

  const formatCuit = (value) => {
    // Eliminar todos los caracteres no numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos
    const truncated = numbers.slice(0, 11);
    
    // Aplicar el formato XX-XXXXXXXX-X
    if (truncated.length <= 2) {
      return truncated;
    } else if (truncated.length <= 10) {
      return `${truncated.slice(0, 2)}-${truncated.slice(2)}`;
    } else {
      return `${truncated.slice(0, 2)}-${truncated.slice(2, 10)}-${truncated.slice(10)}`;
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    if (name === 'cuit') {
      const formattedCuit = formatCuit(value);
      setFormData(prev => ({
        ...prev,
        cuit: formattedCuit
      }));

      // Solo validar si tenemos un CUIT completo (13 caracteres incluyendo guiones)
      if (formattedCuit.length === 13) {
        try {
          const existingProveedor = await ProveedorService.findByCuit(formattedCuit);
          if (existingProveedor && (!currentProveedor || existingProveedor.proveedorId !== currentProveedor.proveedorId)) {
            setCuitError('Este CUIT ya está registrado');
          } else {
            setCuitError('');
          }
        } catch (error) {
          setCuitError('');
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'posicionIva' ? parseInt(value) : value
      }));
    }
  };

  const validateCuit = (cuit) => {
    // Verificar el formato correcto XX-XXXXXXXX-X
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(cuit)) {
      return 'El CUIT debe tener el formato XX-XXXXXXXX-X';
    }
    return '';
  };

  const handleSave = async () => {
    try {
      // Validar formato del CUIT
      const cuitFormatError = validateCuit(formData.cuit);
      if (cuitFormatError) {
        setCuitError(cuitFormatError);
        return;
      }

      // Validar CUIT duplicado antes de guardar
      if (!currentProveedor) {
        const existingProveedor = await ProveedorService.findByCuit(formData.cuit);
        if (existingProveedor) {
          setCuitError('Este CUIT ya está registrado');
          return;
        }
      }

      // Crear una instancia de Proveedor con los datos del formulario
      const proveedorToSave = Proveedor.fromJson(formData);

      if (currentProveedor) {
        await ProveedorService.updateProveedor(proveedorToSave);
      } else {
        await ProveedorService.addProveedor(proveedorToSave);
      }
      setShowModal(false);
      setCuitError('');
      fetchProveedores();
    } catch (error) {
      console.error('Error saving proveedor:', error);
    }
  };

  const renderPagination = () => {
    let items = [];
    for (let number = 0; number < totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number + 1}
        </Pagination.Item>
      );
    }

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          <span>Total: {totalElements} registros</span>
          <BootstrapForm.Select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="page-size-select"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size} registros por página
              </option>
            ))}
          </BootstrapForm.Select>
        </div>
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          />
          {items}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
          />
        </Pagination>
      </div>
    );
  };

  return (
    <div className="proveedores-card">
      <Button onClick={handleAdd}>Agregar Proveedor</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Razón Social</th>
            <th>CUIT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor, index) => (
            <tr key={`${proveedor.proveedorId}-${index}`}>
              <td>{proveedor.razonSocial}</td>
              <td>{proveedor.cuit}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleEdit(proveedor)}>
                  <i className="bi bi-pencil-square"></i> Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(proveedor.proveedorId)}>
                  <i className="bi bi-trash"></i> Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {renderPagination()}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentProveedor ? 'Editar Proveedor' : 'Agregar Proveedor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formRazonSocial">
                  <Form.Label>Razón Social</Form.Label>
                  <Form.Control
                    type="text"
                    name="razonSocial"
                    value={formData.razonSocial}
                    onChange={handleInputChange}
                    placeholder="Ingrese la razón social"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formNombreFantasia">
                  <Form.Label>Nombre Fantasía</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombreFantasia"
                    value={formData.nombreFantasia}
                    onChange={handleInputChange}
                    placeholder="Ingrese el nombre fantasía"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formCuit">
                  <Form.Label>CUIT</Form.Label>
                  <Form.Control
                    type="text"
                    name="cuit"
                    value={formData.cuit}
                    onChange={handleInputChange}
                    placeholder="XX-XXXXXXXX-X"
                    isInvalid={!!cuitError}
                    maxLength={13}
                  />
                  <Form.Control.Feedback type="invalid">
                    {cuitError}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formPosicionIva">
                  <Form.Label>Posición IVA</Form.Label>
                  <Form.Select
                    name="posicionIva"
                    value={formData.posicionIva}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione posición IVA</option>
                    {posicionesIva.map(pos => (
                      <option key={pos.id} value={pos.id}>
                        {pos.descripcion}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3" controlId="formDomicilio">
                  <Form.Label>Domicilio</Form.Label>
                  <Form.Control
                    type="text"
                    name="domicilio"
                    value={formData.domicilio}
                    onChange={handleInputChange}
                    placeholder="Ingrese el domicilio"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formLocalidad">
                  <Form.Label>Localidad</Form.Label>
                  <Form.Control
                    type="text"
                    name="localidad"
                    value={formData.localidad}
                    onChange={handleInputChange}
                    placeholder="Ingrese la localidad"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formProvincia">
                  <Form.Label>Provincia</Form.Label>
                  <Form.Control
                    type="text"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    placeholder="Ingrese la provincia"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formTelefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ingrese el teléfono"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formCelular">
                  <Form.Label>Celular</Form.Label>
                  <Form.Control
                    type="text"
                    name="celular"
                    value={formData.celular}
                    onChange={handleInputChange}
                    placeholder="Ingrese el celular"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ingrese el email"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formIngresosBrutos">
                  <Form.Label>Ingresos Brutos</Form.Label>
                  <Form.Control
                    type="text"
                    name="ingresosBrutos"
                    value={formData.ingresosBrutos}
                    onChange={handleInputChange}
                    placeholder="Ingrese ingresos brutos"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formContacto">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                name="contacto"
                value={formData.contacto}
                onChange={handleInputChange}
                placeholder="Ingrese el contacto"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formObservaciones">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                placeholder="Ingrese observaciones"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProveedoresCard; 