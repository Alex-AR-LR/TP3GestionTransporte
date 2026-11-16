import CrudPage from "../components/CrudPage.jsx";

const fields = [
  { name: "marca", label: "Marca" },
  { name: "modelo", label: "Modelo" },
  { name: "patente", label: "Patente" },
  { name: "anio", label: "Año", type: "number" },
  { name: "capacidad_carga", label: "Capacidad de carga (kg)", type: "number" },
];

const validate = (v) => {
  const errs = {};
  const anio = Number(v.anio);
  if (!Number.isInteger(anio) || anio < 1900 || anio > new Date().getFullYear() + 1)
    errs.anio = "Año inválido";
  if (!(Number(v.capacidad_carga) > 0)) errs.capacidad_carga = "Debe ser mayor a 0";
  return errs;
};

export default function Vehiculos() {
  return <CrudPage title="Vehículos" endpoint="/vehiculos" fields={fields} validate={validate} />;
}
