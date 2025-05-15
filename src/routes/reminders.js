import { randomUUID } from "crypto";

export const reminders = [];

export function getReminders(req, res) {
    res.json(reminders.toSorted((a, b) => {
        if (a.important && !b.important) {
            return -1;
        }
        else if (!a.important && b.important) {
            return 1;
        }
        return a.createdAt - b.createdAt;
    }));
}

export function createReminder(req, res) {
    let { content, important } = req.body;

    if (typeof content !== "string") {
        return res.status(400).json({
            error: "El contenido debe ser un string no vacío de máximo 120 caracteres",
        });
    }

    content = content.trim();

    if (content === "" || content.length > 120) {
        return res.status(400).json({
            error: "El contenido debe ser un string no vacío de máximo 120 caracteres",
        });
    }

    if (typeof important !== "boolean" && important !== undefined) {
        return res.status(400).json({
            error: "El campo 'important' debe ser un booleano",
        });
    }

    const newReminder = {
        id: randomUUID(),
        content,
        createdAt: Date.now(),
        important: important ?? false,
    };

    reminders.push(newReminder);
    res.status(201).json(newReminder);
}

export function updateReminder(req, res) {
    const { id } = req.params;
    let { content, important } = req.body;

    const reminder = reminders.find((reminder) => reminder.id === id);

    if (!reminder) {
        return res.status(404).json({
            error: "Recordatorio no encontrado",
        });
    }

    if (content !== undefined) {
        if (typeof content !== "string") {
            return res.status(400).json({
                error: "El contenido debe ser un string no vacío de máximo 120 caracteres",
            });
        }

        content = content.trim();
        if (content === "" || content.length > 120) {
            return res.status(400).json({
                error: "El contenido debe ser un string no vacío de máximo 120 caracteres",
            });
        }

        reminder.content = content.trim();
    }

    if (important !== undefined) {
        if (typeof important !== "boolean") {
            return res.status(400).json({
                error: "El campo 'important' debe ser un booleano",
            });
        }
        reminder.important = important;
    }

    res.json(reminder);
}

export function deleteReminder(req, res) {
    const { id } = req.params;

    const reminderIndex = reminders.findIndex((reminder) => reminder.id === id);

    if (reminderIndex === -1) {
        return res.status(404).json({
            error: "Recordatorio no encontrado",
        });
    }

    reminders.splice(reminderIndex, 1);

    res.status(204).end();
} 