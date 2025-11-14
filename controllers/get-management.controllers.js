import supabase from "../db/supabase.js";   
import ApiResponse from "../utils/api-respons.js";
import ApiError from "../utils/api-error.js";


const getAllTeachersController = async (req, res) => {
  const { data, error } = await supabase.from('teachers').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
return res.status(200).json(new ApiResponse(200, data, 'Teachers fetched successfully'));
};

const getAllStudentsController = async (req, res) => {
  const { data, error } = await supabase.from('students').select('*').order('roll_number');
  if (error) return res.status(500).json({ error: error.message });
return res.status(200).json(new ApiResponse(200, data, 'Students fetched successfully'));
};



// 1. Get classes assigned to a teacher
const getClassesAssignedToTeacherController = async (req, res) => {
  const { teacher_id } = req.query;
  console.log(teacher_id);
  if (!teacher_id) return res.status(400).json({ error: 'teacher_id required' });

  const { data, error } = await supabase
    .from('teacher_assignments')
    .select('classes(*)')
    .eq('teacher_id', teacher_id);

  if (error) return res.status(500).json({ error: error.message });
  const classes = data.map(d => d.classes);
return res.status(200).json(new ApiResponse(200, classes, 'Classes fetched successfully'));
};

// 2. Get subjects a teacher teaches in a class
const getSubjectsofATeacherController = async (req, res) => {
  const { teacher_id, class_id } = req.query;
  if (!teacher_id || !class_id) return res.status(400).json({ error: 'teacher_id and class_id required' });

  const { data, error } = await supabase
    .from('teacher_assignments')
    .select('subjects(*)')
    .eq('teacher_id', teacher_id)
    .eq('class_id', class_id);

  if (error) return     res.status(500).json({ error: error.message });
  const subjects = data.map(d => d.subjects);
return res.status(200).json(new ApiResponse(200, subjects, 'Subjects fetched successfully'));
};

// 3. Get students of a class (for teacher to enter results)
const getStudentsOfAClassController = async (req, res) => {
  const { class_id } = req.query;
  if (!class_id) return res.status(400).json({ error: 'class_id required' });

  const { data, error } = await supabase
    .from('students')
    .select('id, name, roll_number')
    .eq('class_id', class_id)
    .order('roll_number');

  if (error) return res.status(500).json({ error: error.message });
return res.status(200).json(new ApiResponse(200, data, 'Students fetched successfully'));
};

// 4. Get all classes (for dropdowns)
const getAllClassesController = async (req, res) => {
  const { data, error } = await supabase.from('classes').select('id, name').order('name');
  if (error) return res.status(500).json({ error: error.message });
return res.status(200).json(new ApiResponse(200, data, 'Classes fetched successfully'));
};

// 5. Get all students of a class (public or admin)
const getAllStudentsOfAClassController = async (req, res) => {
  const { class_id } = req.query;
  const { data, error } = await supabase
    .from('students')
    .select('id, name, roll_number')
    .eq('class_id', class_id)
    .order('roll_number');

  if (error) return res.status(500).json({ error: error.message });
return res.status(200).json(new ApiResponse(200, data, 'Students fetched successfully'));
};

// 6. Get exams for a class
const getExamsOfAClassController = async (req, res) => {
  const { class_id } = req.query;
  if (!class_id) return res.status(400).json({ error: 'class_id required' });

  const { data, error } = await supabase
    .from('exams')
    .select('id, name, exam_date')
    .eq('class_id', class_id)
    .order('exam_date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
return res.status(200).json(new ApiResponse(200, data, 'Exams fetched successfully'));
};

// 7. Get subjects for a class (including global ones)
const getSubjectsOfAClassController = async (req, res) => {
  const { class_id } = req.query;
  if (!class_id) return res.status(400).json({ error: 'class_id required' });

  const { data, error } = await supabase
    .from('subjects')
    .select('id, name')
    .or(`class_id.is.null,class_id.eq.${class_id}`)
    .order('name');

  if (error) return res.status(500).json({ error: error.message });
return res.status(200).json(new ApiResponse(200, data, 'Subjects fetched successfully'));
};

// 8. Get results of a student (public view: roll + exam)
const getResultsOfAStudentController = async (req, res) => {
  const { class_id, exam_id, roll_number } = req.query;
  if (!class_id || !exam_id || !roll_number) {
    return res.status(400).json({ error: 'class_id, exam_id, roll_number required' });
  }

  // Find student
  const { data: student, error: err1 } = await supabase
    .from('students')
    .select('id, name')
    .eq('class_id', class_id)
    .eq('roll_number', roll_number)
    .single();

  if (err1 || !student) return res.status(404).json({ error: 'Student not found' });

  // Get results
  const { data: results, error: err2 } = await supabase
    .from('results')
    .select(`
      marks,
      grade,
      comments,
      subjects (name)
    `)
    .eq('student_id', student.id)
    .eq('exam_id', exam_id);

  if (err2) return res.status(500).json({ error: err2.message });

  const formatted = results.map(r => ({
    subject: r.subjects.name,
    marks: r.marks,
    grade: r.grade,
    comments: r.comments,
  }));

  return res.status(200).json(new ApiResponse(200, { student: student.name, results: formatted }, 'Results fetched successfully'));
};

const getAllDataController = async (req, res) => {
  try {
    const tables = ['classes', 'subjects', 'teachers', 'students', 'exams', 'teacher_assignments', 'results'];
    const result = {};
    for (const table of tables) {
      const { data } = await supabase.from(table).select('*');
      result[table] = data;
    }
    return res.status(200).json(new ApiResponse(200, result, 'All data fetched successfully'));
  } catch (err) {
    return res.status(500).json(new ApiResponse(500, null, err.message));
  }
  };

export {
  getAllTeachersController,
  getAllStudentsController,
  getClassesAssignedToTeacherController,
  getSubjectsofATeacherController,
  getStudentsOfAClassController,
  getAllClassesController,
  getAllStudentsOfAClassController,
  getExamsOfAClassController,
  getSubjectsOfAClassController,
  getResultsOfAStudentController,
  getAllDataController
};
