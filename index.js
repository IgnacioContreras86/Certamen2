import express from "express";
import { authMiddleware, login } from "./src/routes/auth.js";
import { getReminders, createReminder, updateReminder, deleteReminder } from "./src/routes/reminders.js";

const PORT = process.env.PORT ?? 3000;
const app = express();

// Configuración de middleware
app.use(express.static("public"));
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
	next();
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		error: "Ha ocurrido un error en el servidor"
	});
});

// Middleware para CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Authorization");
	res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

// Rutas de autenticación
app.post("/api/auth/login", login);

// Rutas de recordatorios
app.get("/api/reminders", authMiddleware, getReminders);
app.post("/api/reminders", authMiddleware, createReminder);
app.patch("/api/reminders/:id", authMiddleware, updateReminder);
app.delete("/api/reminders/:id", authMiddleware, deleteReminder);

// Ruta para verificar el estado del servidor
app.get("/health", (req, res) => {
	res.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		uptime: process.uptime()
	});
});

// Manejo de rutas no encontradas
app.use((req, res) => {
	res.status(404).json({
		error: "Ruta no encontrada"
	});
});

// Iniciar el servidor
app.listen(PORT, (error) => {
	if (error) {
		console.error(`No se puede ocupar el puerto ${PORT} :(`);
		return;
	}
	console.log(`Servidor iniciado en el puerto ${PORT}`);
	console.log(`Modo: ${process.env.NODE_ENV || 'desarrollo'}`);
});

export default app;
