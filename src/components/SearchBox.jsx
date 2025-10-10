import React, { useState } from "react";
import { Button, Form, InputGroup, Nav } from "react-bootstrap";

const SearchBox = () => {
  const [activeTab, setActiveTab] = useState("alquilar");
  const [tipo, setTipo] = useState("Departamento");
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    alert(`Buscando para: ${activeTab} - ${tipo} - ${query}`);
  };

  return (
    <div className="bg-white p-3 rounded-4 shadow-lg">
      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav.Item>
          <Nav.Link eventKey="alquilar">Alquilar</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="comprar">Comprar</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="proyectos">Proyectos</Nav.Link>
        </Nav.Item>
      </Nav>

      <InputGroup className="mt-3">
        <Form.Select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option>Departamento</option>
          <option>Casa</option>
          <option>Terreno</option>
        </Form.Select>

        <Form.Control
          type="text"
          placeholder="Ingresa ubicaciones o características (ej: piscina)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="success" onClick={handleSearch}>
          Buscar
        </Button>
      </InputGroup>
    </div>
  );
};

export default SearchBox;
