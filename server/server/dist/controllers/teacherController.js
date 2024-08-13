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
const teacher_1 = require("../domain/models/teacher");
const getAllTeachers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teachers = yield teacher_1.Teacher.getAllTeachers();
        res.json(teachers);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch teachers" });
    }
});
exports.getAllTeachers = getAllTeachers;
const getTeacherById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacherId = Number(req.params.id);
        const teacher = yield teacher_1.Teacher.getTeacherById(teacherId);
        if (teacher) {
            res.json(teacher);
        }
        else {
            res.status(404).json({ error: "Teacher not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch teacher" });
    }
});
exports.getTeacherById = getTeacherById;
const createTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacher = yield teacher_1.Teacher.createTeacher(req.body);
        res.status(201).json(teacher);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create teacher" });
    }
});
exports.createTeacher = createTeacher;
const updateTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield teacher_1.Teacher.updateTeacher(Object.assign({ id: Number(req.params.id) }, req.body));
        if (updated) {
            const teacherId = Number(req.params.id);
            const updatedTeacher = yield teacher_1.Teacher.getTeacherById(teacherId);
            res.json(updatedTeacher);
        }
        else {
            res.status(404).json({ error: "Teacher not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update teacher" });
    }
});
exports.updateTeacher = updateTeacher;
const deleteTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacherId = Number(req.params.id);
        const deleted = yield teacher_1.Teacher.deleteTeacher(teacherId);
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: "Teacher not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete teacher" });
    }
});
exports.deleteTeacher = deleteTeacher;
