import { body } from "express-validator";

const addClassValidator = [
    body("name").notEmpty().withMessage("Class name is required"),
]

const addSubjectValidator = [
    body("name").notEmpty().withMessage("Subject name is required"),
]

const addTeacherValidator = [
    body("name").notEmpty().withMessage("Teacher name is required"),
]

const addStudentValidator = [
    body("name").notEmpty().withMessage("Student name is required"),
]

const addExamValidator = [
    body("name").notEmpty().withMessage("Exam name is required"),
]

const addTeacherAssignmentValidator = [
    body("teacher_id").notEmpty().withMessage("Teacher ID is required"),
    body("class_id").notEmpty().withMessage("Class ID is required"),
    body("subject_id").notEmpty().withMessage("Subject ID is required"),
]

const addResultValidator = [
    body("student_id").notEmpty().withMessage("Student ID is required"),
    body("exam_id").notEmpty().withMessage("Exam ID is required"),
    body("subject_id").notEmpty().withMessage("Subject ID is required"),
    body("marks").notEmpty().withMessage("Marks is required"),
]

const updateClassValidator = [
    body("id").notEmpty().withMessage("ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
]

    

export {addClassValidator,
    addSubjectValidator,
    addTeacherValidator,
    addStudentValidator,
    addExamValidator,
    addTeacherAssignmentValidator,
    addResultValidator,
    updateClassValidator};
