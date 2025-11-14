const generateClassId = () => {
  const prefix = 'C';
  const prefix_length = 2;
  const number_length = 3;
  const suffix_length = 2;
  const prefix_generated = prefix.padStart(prefix_length, '0');
  const number_generated = Math.floor(1000 + Math.random() * 9000).toString().padStart(number_length, '0');
  const suffix_generated = Math.random().toString(36).substring(2, 2 + suffix_length).toUpperCase();
  return `${prefix_generated}${number_generated}${suffix_generated}`;
}

const generateSubjectId = () => {
  const prefix = 'S';
  const prefix_length = 2;
  const number_length = 3;
  const suffix_length = 2;
  const prefix_generated = prefix.padStart(prefix_length, '0');
  const number_generated = Math.floor(1000 + Math.random() * 9000).toString().padStart(number_length, '0');
  const suffix_generated = Math.random().toString(36).substring(2, 2 + suffix_length).toUpperCase();
  return `${prefix_generated}${number_generated}${suffix_generated}`;
}

const generateStudentId = () => {
  const prefix = 'S';
  const prefix_length = 2;
  const number_length = 4;
  const suffix_length = 4;
  const prefix_generated = prefix.padStart(prefix_length, '0');
  const year = new Date().getFullYear().toString().slice(-2); // last two digits of year
  const number_generated = Math.floor(1000 + Math.random() * 9000).toString().padStart(number_length, '0');
  const suffix_generated = Math.random().toString(36).substring(2, 2 + suffix_length).toUpperCase();
  return `${prefix_generated}${number_generated}-${year}-${suffix_generated}`;
}

const generateTeacherId = () => {
  const prefix = 'T';
  const prefix_length = 2;
  const number_length = 4;
  const suffix_length = 4;
  const prefix_generated = prefix.padStart(prefix_length, '0');
  const year = new Date().getFullYear().toString().slice(-2); // last two digits of year
  const number_generated = Math.floor(1000 + Math.random() * 9000).toString().padStart(number_length, '0');
  const suffix_generated = Math.random().toString(36).substring(2, 2 + suffix_length).toUpperCase();
  return `${prefix_generated}${number_generated}-${year}-${suffix_generated}`;
}

    const generateExamId = () => {
    const prefix = 'E';
    const prefix_length = 2;
    const number_length = 4;
    const suffix_length = 4;
    const prefix_generated = prefix.padStart(prefix_length, '0');
    const year = new Date().getFullYear().toString().slice(-2); // last two digits of year
    const number_generated = Math.floor(1000 + Math.random() * 9000).toString().padStart(number_length, '0');
    const suffix_generated = Math.random().toString(36).substring(2, 2 + suffix_length).toUpperCase();
    return `${prefix_generated}${number_generated}-${year}-${suffix_generated}`;
    }

const generateResultId = () => {
    const prefix = 'R';
    const prefix_length = 2;
    const number_length = 4;
    const suffix_length = 4;
    const prefix_generated = prefix.padStart(prefix_length, '0');
    const year = new Date().getFullYear().toString().slice(-2); // last two digits of year
    const number_generated = Math.floor(1000 + Math.random() * 9000).toString().padStart(number_length, '0');
    const suffix_generated = Math.random().toString(36).substring(2, 2 + suffix_length).toUpperCase();
    return `${prefix_generated}${number_generated}-${year}-${suffix_generated}`;
    }

const generateAssignmentId = () => {
    const prefix = 'TA';
    const prefix_length = 2;
    const number_length = 4;
    const suffix_length = 4;
    const prefix_generated = prefix.padStart(prefix_length, '0');
    const year = new Date().getFullYear().toString().slice(-2); // last two digits of year
    const number_generated = Math.floor(1000 + Math.random() * 9000).toString().padStart(number_length, '0');
    const suffix_generated = Math.random().toString(36).substring(2, 2 + suffix_length).toUpperCase();
    return `${prefix_generated}${number_generated}-${year}-${suffix_generated}`;
    }
export {generateClassId, generateSubjectId, generateStudentId, generateTeacherId, generateExamId, generateResultId, generateAssignmentId};
