import { Router } from "express";
import {addClassController, addSubjectController, addTeacherController, addStudentController, addExamController, addTeacherAssignmentController, addResultController, updateClassController} from "../controllers/post-management.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {addClassValidator, addSubjectValidator, addTeacherValidator, addStudentValidator, addExamValidator, addTeacherAssignmentValidator, addResultValidator, updateClassValidator} from "../validators/post-man.validator.js";

const router = Router();

router.route("/add-class").post(addClassValidator, validate, addClassController);
router.route("/add-subject").post(addSubjectValidator, validate, addSubjectController);
router.route("/add-teacher").post(addTeacherValidator, validate, addTeacherController);
router.route("/add-student").post(addStudentValidator, validate, addStudentController);
router.route("/add-exam").post(addExamValidator, validate, addExamController);
router.route("/add-teacher-assignment").post(addTeacherAssignmentValidator, validate, addTeacherAssignmentController);
router.route("/add-result").post(addResultValidator, validate, addResultController);
router.route("/update-class").post(updateClassValidator, validate, updateClassController);

export default router;