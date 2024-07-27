import { Request, Response } from 'express';
import { Teacher } from '../models/teacher';

// Exemplo de função para obter todos os professores
export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
};

// Exemplo de função para obter um professor pelo ID
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
};

// Exemplo de função para criar um novo professor
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create teacher' });
  }
};

// Exemplo de função para atualizar um professor existente
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const [updated] = await Teacher.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedTeacher = await Teacher.findByPk(req.params.id);
      res.json(updatedTeacher);
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update teacher' });
  }
};

// Exemplo de função para excluir um professor
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const deleted = await Teacher.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
};
