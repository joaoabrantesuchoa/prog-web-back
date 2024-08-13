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
exports.deleteStudent = exports.updateStudent = exports.createStudent = exports.getStudentById = exports.getAllStudents = void 0;
const student_1 = require("../domain/models/student");
const getAllStudents = (res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield student_1.Student.getAllStudents();
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
});
exports.getAllStudents = getAllStudents;
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = Number(req.params.id);
        const student = yield student_1.Student.getStudentById(studentId);
        if (student) {
            res.json(student);
        }
        else {
            res.status(404).json({ error: "Student not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch student" });
    }
});
exports.getStudentById = getStudentById;
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = yield student_1.Student.createStudent(req.body);
        res.status(201).json(student);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create student" });
    }
});
exports.createStudent = createStudent;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield student_1.Student.updateStudent(Object.assign({ id: Number(req.params.id) }, req.body));
        if (updated) {
            const studentId = Number(req.params.id);
            const updatedStudent = yield student_1.Student.getStudentById(studentId);
            res.json(updatedStudent);
        }
        else {
            res.status(404).json({ error: "Student not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update student" });
    }
});
exports.updateStudent = updateStudent;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = Number(req.params.id);
        const deleted = yield student_1.Student.deleteStudent(studentId);
        if (deleted) {
            res.status(204).send();
        }
        else {
            res.status(404).json({ error: "Student not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete student" });
    }
});
exports.deleteStudent = deleteStudent;
