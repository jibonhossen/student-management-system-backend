import { Router } from "express";
import {getAllTeachersController, getAllStudentsController, getClassesAssignedToTeacherController, getSubjectsofATeacherController, getStudentsOfAClassController, getAllClassesController, getAllStudentsOfAClassController, getExamsOfAClassController, getSubjectsOfAClassController, getResultsOfAStudentController, getAllDataController} from "../controllers/get-management.controllers.js";



const router = Router();

router.route("/all-teachers").get(getAllTeachersController);
router.route("/all-students").get(getAllStudentsController);
router.route("/classes-assigned-to-teacher").get(getClassesAssignedToTeacherController);
router.route("/subjects-of-a-teacher").get(getSubjectsofATeacherController);
router.route("/students-of-a-class").get(getStudentsOfAClassController);
router.route("/all-classes").get(getAllClassesController);
router.route("/all-students-of-a-class").get(getAllStudentsOfAClassController);
router.route("/exams-of-a-class").get(getExamsOfAClassController);
router.route("/subjects-of-a-class").get(getSubjectsOfAClassController);
router.route("/results-of-a-student").get(getResultsOfAStudentController);
router.route("/all-management-data").get(getAllDataController);
export default router;