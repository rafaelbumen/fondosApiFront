// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, Divider } from "@mui/material";

export default function Sidebar() {
  return (
    <div style={{ width: 250, height: '100vh', backgroundColor: '#0a2540', color: 'white' }}>
      <h3 style={{ padding: '16px', color: 'white', fontSize: '1.5rem' }}>Menú</h3>
      <List>
        <ListItem button component={Link} to="/fondos">
          <ListItemText primary="Fondos de Inversión" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/transacciones">
          <ListItemText primary="Mis Transacciones" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/consignar">
          <ListItemText primary="Consignar" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/informacion">
          <ListItemText primary="Mi Información" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    </div>
  );
}
