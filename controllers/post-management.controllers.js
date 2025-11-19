import supabase from "../db/supabase.js";   
import ApiResponse from "../utils/api-respons.js";
import ApiError from "../utils/api-error.js";
import { generateClassId, generateSubjectId, generateStudentId, generateTeacherId, generateExamId ,generateAssignmentId} from "../utils/id-gen.js";           

const addClassController = async (req, res) => {
  const { name } = req.body;
  console.log(name);
 
  if (!name) return res.status(400).json(new ApiError(400, 'Class name required'));

  let id = generateClassId();
  console.log(id);

  const {data: existingClass, error: existingClassError} = await supabase.from('classes').select().eq('name', name).single();
  if (existingClass) return res.status(400).json(new ApiError(400, 'Class already exists'));

  const { data, error } = await supabase.from('classes').insert({ name, id }).select().single();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Class added successfully'));
 
}


const addSubjectController = async (req, res) => {
  const { name, class_id } = req.body;
  console.log(name);
  console.log(class_id);
  if (!name) return res.status(400).json(new ApiError(400, 'Subject name required'));

  // const {data: existingSubject, error: existingSubjectError} = await supabase.from('subjects').select().eq('name', name).single();
  // if (existingSubject) return res.status(400).json(new ApiError(400, 'Subject already exists'));

  const { data, error } = await supabase.from('subjects').insert({ name, class_id,id: generateSubjectId() }).select().single();
  if (error) return res.status(500).json(new ApiError(500, error.message));

  return res.status(200).json(new ApiResponse(200, data, 'Subject added successfully'));
}

const addTeacherController = async (req, res) => {
  const { email, password_hash, name } = req.body;
  if (!email || !password_hash || !name) return res.status(400).json(new ApiError(400, 'Email, password_hash, name required'));
 
  const {data: existingTeacher, error: existingTeacherError} = await supabase.from('teachers').select().eq('email', email).single();
  if (existingTeacher) return res.status(400).json(new ApiError(400, 'Teacher already exists'));

  const { data, error } = await supabase.from('teachers').insert({ email, password_hash, name, id: generateTeacherId() }).select().single();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, { id: data.id, email: data.email, name: data.name }, 'Teacher added successfully'));
}

const addStudentController = async (req, res) => {
  const { name, roll_number, class_id } = req.body;
  if (!name || !roll_number || !class_id) return  res.status(400).json(new ApiError(400, 'Name, roll_number, class_id required'));

  const {data: existingStudent, error: existingStudentError} = await supabase.from('students').select().eq('roll_number', roll_number).single();
  if (existingStudent) return res.status(400).json(new ApiError(400, 'Student already exists'));

  const { data, error } = await supabase.from('students').insert({ name, roll_number, class_id , id: generateStudentId() }).select().single();
  if (error) return res.status(500).json(new ApiError(500, error.message.includes('unique') ? 'Roll number already exists' : error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Student added successfully'));
}

const addExamController = async (req, res) => {
  const { name, class_id, exam_date } = req.body;
  if (!name || !class_id) return res.status(400).json(new ApiError(400, 'Name and class_id required'));

  const {data: existingExam, error: existingExamError} = await supabase.from('exams').select().eq('name', name).single();
  if (existingExam) return res.status(400).json(new ApiError(400, 'Exam already exists'));

  const { data, error } = await supabase.from('exams').insert({ name, class_id, exam_date: exam_date || null , id: generateExamId() }).select().single();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Exam added successfully'));
}

const addTeacherAssignmentController = async (req, res) => {
  const { teacher_id, class_id, subject_id } = req.body;
  if (!teacher_id || !class_id || !subject_id) return res.status(400).json(new ApiError(400, 'All IDs required'));
  const { data, error } = await supabase.from('teacher_assignments').insert({ teacher_id, class_id, subject_id , id: generateAssignmentId() }).select().single();
  if (error) return res.status(500).json(new ApiError(500, error.message.includes('unique') ? 'Assignment exists' : error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Assigned successfully'));
}

const addResultController = async (req, res) => {
  const { student_id, exam_id, subject_id, marks, comments  } = req.body;

  console.log(req.body);
  if (!student_id || !exam_id || !subject_id || marks === undefined) return res.status(400).json(new ApiError(400, 'Required fields missing'));


  let grade = null;
  if (marks >= 80) {
    grade = 'A+';
  } else if (marks >= 70) {
    grade = 'A';
  } else if (marks >= 60) {
    grade = 'B';
  } else if (marks >= 50) {
    grade = 'C';
  } else if (marks >= 40) {
    grade = 'D';
  } else if (marks >= 33) {
    grade = 'E';
  } else {
    grade = 'F';
  }
  let year = new Date().getFullYear();

  // Generate id like R-2025-0001-34VV
  const id = `R-${year}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const { data, error } = await supabase
    .from('results')
    .upsert({ id,student_id, exam_id, subject_id, marks, grade: grade || null, comments: comments || null, updated_at: new Date().toISOString() }, 
      { onConflict: 'student_id,exam_id,subject_id' })
    .select()
    .single();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Result saved successfully'));
}

const getAllClassesController = async (req, res) => {
  const { data, error } = await supabase.from('classes').select();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Classes fetched successfully'));
}

const getAllSubjectsController = async (req, res) => {
  const { data, error } = await supabase.from('subjects').select();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Subjects fetched successfully'));
}

const getAllTeachersController = async (req, res) => {
  const { data, error } = await supabase.from('teachers').select();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Teachers fetched successfully'));
}

const getAllStudentsController = async (req, res) => {
  const { data, error } = await supabase.from('students').select();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Students fetched successfully'));
}

const getAllExamsController = async (req, res) => {
  const { data, error } = await supabase.from('exams').select();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Exams fetched successfully'));
}

const getAllTeacherAssignmentsController = async (req, res) => {
  const { data, error } = await supabase.from('teacher_assignments').select();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Teacher assignments fetched successfully'));
}

const getAllResultsController = async (req, res) => {
  const { data, error } = await supabase.from('results').select();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Results fetched successfully'));
}

const updateClassController = async (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) return res.status(400).json(new ApiError(400, 'ID and name required'));

  const { data, error } = await supabase.from('classes').update({ name }).eq('id', id).select().single();
  if (error) return res.status(500).json(new ApiError(500, error.message));
  return res.status(200).json(new ApiResponse(200, data, 'Class updated successfully'));
}


export {addClassController,
     addSubjectController,
     addTeacherController,
     addStudentController,
     addExamController,
     addTeacherAssignmentController,
     addResultController,
     getAllClassesController,
     getAllSubjectsController,
     getAllTeachersController,
     getAllStudentsController,
     getAllExamsController,
     getAllTeacherAssignmentsController,
     getAllResultsController,
     updateClassController
    };

