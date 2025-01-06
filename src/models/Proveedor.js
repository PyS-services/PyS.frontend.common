class Proveedor {
    constructor({
        proveedorId = null,
        proveedorIdNegocio = null,
        razonSocial = '',
        nombreFantasia = '',
        cuit = '',
        domicilio = '',
        localidad = '',
        provincia = '',
        telefono = '',
        fax = '',
        email = '',
        posicionIva = 0,
        celular = '',
        ingresosBrutos = '',
        contacto = '',
        observaciones = '',
        created = null,
        updated = null
    } = {}) {
        this.proveedorId = proveedorId;
        this.proveedorIdNegocio = proveedorIdNegocio;
        this.razonSocial = razonSocial;
        this.nombreFantasia = nombreFantasia;
        this.cuit = cuit;
        this.domicilio = domicilio;
        this.localidad = localidad;
        this.provincia = provincia;
        this.telefono = telefono;
        this.fax = fax;
        this.email = email;
        this.posicionIva = posicionIva;
        this.celular = celular;
        this.ingresosBrutos = ingresosBrutos;
        this.contacto = contacto;
        this.observaciones = observaciones;
        this.created = created;
        this.updated = updated;
    }

    static fromJson(json) {
        return new Proveedor(json);
    }

    toJson() {
        return {
            proveedorId: this.proveedorId,
            proveedorIdNegocio: this.proveedorIdNegocio,
            razonSocial: this.razonSocial,
            nombreFantasia: this.nombreFantasia,
            cuit: this.cuit,
            domicilio: this.domicilio,
            localidad: this.localidad,
            provincia: this.provincia,
            telefono: this.telefono,
            fax: this.fax,
            email: this.email,
            posicionIva: this.posicionIva,
            celular: this.celular,
            ingresosBrutos: this.ingresosBrutos,
            contacto: this.contacto,
            observaciones: this.observaciones
        };
    }

    static createEmpty() {
        return new Proveedor();
    }
}

export default Proveedor; 