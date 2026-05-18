const BASE_PDF_URL = 'https://www.cl.cam.ac.uk/teaching/exams/pastpapers/';
const BASE_SOLUTION_URL = 'https://www.cl.cam.ac.uk/teaching/exams/solutions/';

const pad = (num) => num.toString().padStart(2, '0');

export const getPdfUrl = (year, paper, question, topicId) => {
  if (topicId === 'nst-maths') {
    return `https://www.maths.cam.ac.uk/undergradnst/pastpapers/${year}/ia_${paper}.pdf`;
  }
  return `${BASE_PDF_URL}y${year}p${paper}q${question}.pdf`;
};

export const getSolutionUrl = (year, paper, question, topicId) => {
  if (topicId === 'nst-maths') {
    return `https://www.maths.cam.ac.uk/undergradnst/pastpapers/${year}/ia_report.pdf`;
  }
  return `${BASE_SOLUTION_URL}${year}/${year}-p${pad(paper)}-q${pad(question)}-solutions.pdf`;
};

// Generator for consistent mappings
const generateQuestions = (topicId, mappings) => {
  const result = [];
  mappings.forEach(m => {
    for (let year = m.start; year <= m.end; year++) {
      m.questions.forEach(q => {
        result.push({
          year,
          paper: q.p,
          question: q.q,
          hasSolution: topicId === 'nst-maths' ? year >= 2001 : year >= 2006,
          isLocked: topicId === 'nst-maths' ? false : year >= 2024,
          isReport: topicId === 'nst-maths'
        });
      });
    }
  });
  return result.sort((a, b) => b.year - a.year || a.paper - b.paper || a.question - b.question);
};

export const questionsByTopic = {
  databases: generateQuestions('databases', [
    { start: 2018, end: 2025, questions: [{ p: 3, q: 1 }, { p: 3, q: 2 }] },
    { start: 2010, end: 2017, questions: [{ p: 4, q: 5 }, { p: 4, q: 6 }] },
    { start: 1993, end: 2009, questions: [{ p: 5, q: 8 }, { p: 6, q: 8 }] },
  ]),
  'digital-electronics': generateQuestions('digital-electronics', [
    { start: 2006, end: 2025, questions: [{ p: 2, q: 1 }, { p: 2, q: 2 }] },
    { start: 1995, end: 2005, questions: [{ p: 2, q: 1 }, { p: 10, q: 12 }, { p: 11, q: 12 }] },
  ]),
  'discrete-mathematics': generateQuestions('discrete-mathematics', [
    { start: 2014, end: 2025, questions: [{ p: 2, q: 7 }, { p: 2, q: 8 }, { p: 2, q: 9 }, { p: 2, q: 10 }] },
    { start: 1993, end: 2013, questions: [{ p: 1, q: 3 }, { p: 2, q: 3 }, { p: 10, q: 11 }, { p: 11, q: 11 }] },
  ]),
  focs: generateQuestions('focs', [
    { start: 2009, end: 2025, questions: [{ p: 1, q: 1 }, { p: 1, q: 2 }] },
    { start: 2006, end: 2008, questions: [{ p: 1, q: 1 }, { p: 1, q: 5 }, { p: 1, q: 6 }] },
    { start: 1993, end: 2005, questions: [{ p: 1, q: 3 }, { p: 1, q: 5 }, { p: 1, q: 6 }] },
  ]),
  algorithms: generateQuestions('algorithms', [
    { start: 2014, end: 2025, questions: [{ p: 1, q: 7 }, { p: 1, q: 8 }, { p: 1, q: 9 }, { p: 1, q: 10 }] },
    { start: 2006, end: 2013, questions: [{ p: 1, q: 4 }, { p: 1, q: 11 }, { p: 1, q: 12 }] },
  ]),
  'operating-systems': generateQuestions('operating-systems', [
    { start: 2009, end: 2025, questions: [{ p: 2, q: 3 }, { p: 2, q: 4 }] },
    { start: 2006, end: 2008, questions: [{ p: 1, q: 2 }, { p: 1, q: 7 }, { p: 1, q: 8 }] },
    { start: 1993, end: 2005, questions: [{ p: 1, q: 1 }, { p: 10, q: 1 }] },
  ]),
  'interaction-design': generateQuestions('interaction-design', [
    { start: 2006, end: 2025, questions: [{ p: 3, q: 5 }, { p: 3, q: 6 }] },
  ]),
  'software-security': generateQuestions('software-security', [
    { start: 2006, end: 2025, questions: [{ p: 3, q: 7 }, { p: 3, q: 8 }] },
  ]),
  probability: generateQuestions('probability', [
    { start: 2006, end: 2025, questions: [{ p: 3, q: 9 }, { p: 3, q: 10 }] },
  ]),
  oop: generateQuestions('oop', [
    { start: 2006, end: 2025, questions: [{ p: 1, q: 5 }, { p: 1, q: 6 }] },
  ]),
  graphics: generateQuestions('graphics', [
    { start: 2006, end: 2025, questions: [{ p: 1, q: 9 }, { p: 1, q: 10 }] },
  ]),
  'machine-learning': generateQuestions('machine-learning', [
    { start: 2006, end: 2025, questions: [{ p: 2, q: 5 }, { p: 2, q: 6 }] },
  ]),
  'nst-maths': generateQuestions('nst-maths', [
    { start: 2001, end: 2025, questions: [{ p: 1, q: 'Full' }, { p: 2, q: 'Full' }] },
  ]),
};
