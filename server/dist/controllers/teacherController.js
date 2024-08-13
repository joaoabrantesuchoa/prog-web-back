"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeacher = exports.updateTeacher = exports.createTeacher = exports.getTeacherById = exports.getAllTeachers = void 0;
const teacher_1 = require("../models/teacher");
// Exemplo de função para obter todos os professores
const getAllTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teachers = yield teacher_1.Teacher.findAll();
        res.json(teachers);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
});
exports.getAllTeachers = getAllTeachers;
// Exemplo de função para obter um professor pelo ID
const getTeacherById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacher = yield teacher_1.Teacher.findByPk(req.params.id);
        if (teacher) {
            res.json(teacher);
        }
        else {
            res.status(404).json({ error: 'Teacher not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch teacher' });
    }
});
exports.getTeacherById = getTeacherById;
// Exemplo de função para criar um novo professor
const createTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacher = yield teacher_1.Teacher.create(req.body);
        res.status(201).json(teacher);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create teacher' });
    }
});
exports.createTeacher = createTeacher;
// Exemplo de função para atualizar um professor existente
const updateTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [updated] = yield teacher_1.Teacher.update(req.body, {
            where: { id: req.params.id },
        });
        if (updated) {
            const updatedTeacher = yield teacher_1.Teacher.findByPk(req.params.id);
            res.json(updatedTeacher);
        }
        else {
            res.status(404).json({ error: 'Teacher not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update teacher' });
    }
});
exports.updateTeacher = updateTeacher;
// Exemplo de função para excluir um professor
const deleteTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield teacher_1.Teacher.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: 'Teacher not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete teacher' });
    }
});
exports.deleteTeacher = deleteTeacher;
