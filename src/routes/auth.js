import { randomBytes } from "crypto";
import { verifyPassword } from "../utils/auth.js";

const users = [
    {
        username: "admin",
        name: "Gustavo Alfredo Marín Sáez",
        password: "1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01",
    },
];

export function authMiddleware(req, res, next) {
    const token = req.get("X-Authorization");

    if (!token) {
        return res.status(401).json({
            error: "No se ha proporcionado un token de autorización",
        });
    }

    const user = users.find(user => user.token === token);

    if (!user) {
        return res.status(401).json({
            error: "El token es inválido"
        });
    }

    next();
}

export function login(req, res) {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({
            error: "El nombre de usuario y la contraseña deben ser strings",
        });
    }

    const user = users.find((user) => user.username === username);

    if (!user) {
        return res.status(401).json({
            error: "Nombre de usuario o contraseña incorrectos :(",
        });
    }

    if (!verifyPassword(password, user.password)) {
        return res.status(401).json({
            error: "Nombre de usuario o contraseña incorrectos",
        });
    }
    
    user.token = randomBytes(48).toString("hex");

    res.json({
        username: user.username,
        token: user.token,
        name: user.name
    });
} 