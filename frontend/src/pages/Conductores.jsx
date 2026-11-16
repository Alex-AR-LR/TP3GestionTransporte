import CrudPage from "../components/CrudPage.jsx";

const fields = [
  { name: "nombre", label: "Nombre" },
  { name: "apellido", label: "Apellido" },
  { name: "numero_documento", label: "N° de documento" },
  { name: "numero_licencia", label: "N° de licencia" },
  { name: "fecha_alta_licencia", label: "Alta de licencia", type: "date" },
  { name: "fecha_vencimiento_licencia", label: "Vencimiento de licencia", type: "date" },
];

const validate = (v) => {
  const errs = {};
  if (v.fecha_vencimiento_licencia <= v.fecha_alta_licencia)
    errs.fecha_vencimiento_licencia = "Debe ser posterior al alta";
  return errs;
};

export default function Conductores() {
  return <CrudPage title="Conductores" endpoint="/conductores" fields={fields} validate={validate} />;
}
