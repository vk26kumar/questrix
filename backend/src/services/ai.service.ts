import OpenAI from 'openai';
import { IAssignment, IQuestionPaper, ISection, IQuestion, IAnswerKeyItem } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── Prompt Builder ───────────────────────────────────────────────────────────

const buildPrompt = (assignment: IAssignment): string => {
  const questionTypesText = assignment.questionTypes
    .map(
      (qt, index) =>
        `Section ${String.fromCharCode(65 + index)} - ${qt.type}: ${qt.numberOfQuestions} questions, ${qt.marksPerQuestion} marks each`
    )
    .join('\n');

  return `You are an expert teacher and exam paper creator. Create a structured question paper based on the following details.

ASSIGNMENT DETAILS:
- Subject: ${assignment.subject}
- Class: ${assignment.className}
- School: ${assignment.schoolName}
- Total Questions: ${assignment.totalQuestions}
- Total Marks: ${assignment.totalMarks}
- Time Allowed: ${assignment.timeAllowed}
- Additional Instructions: ${assignment.additionalInstructions || 'None'}

QUESTION SECTIONS REQUIRED:
${questionTypesText}

DIFFICULTY DISTRIBUTION:
- Easy: 30% of questions
- Moderate: 50% of questions  
- Challenging: 20% of questions

IMPORTANT RULES:
1. Generate EXACTLY the number of questions specified for each section
2. Each question MUST have a difficulty tag: Easy, Moderate, or Challenging
3. Each question MUST have the exact marks specified for that section
4. Questions must be relevant to the subject and class level
5. For MCQ sections, provide 4 options (A, B, C, D)
6. Provide complete answer key for ALL questions
7. Make questions progressively challenging within each section

You MUST respond with ONLY a valid JSON object in this EXACT format (no markdown, no explanation):

{
  "schoolName": "${assignment.schoolName}",
  "subject": "${assignment.subject}",
  "className": "${assignment.className}",
  "timeAllowed": "${assignment.timeAllowed}",
  "maximumMarks": ${assignment.totalMarks},
  "generalInstruction": "All questions are compulsory unless stated otherwise.",
  "sections": [
    {
      "sectionLabel": "A",
      "title": "Short Answer Questions",
      "instruction": "Attempt all questions. Each question carries 2 marks",
      "questionType": "Short Questions",
      "questions": [
        {
          "questionNumber": 1,
          "text": "Question text here",
          "difficulty": "Easy",
          "marks": 2,
          "options": null
        }
      ]
    }
  ],
  "answerKey": [
    {
      "questionNumber": 1,
      "answer": "Complete answer here"
    }
  ]
}

Generate the complete question paper now for ${assignment.subject} - Class ${assignment.className}:`;
};

// ─── Response Parser ──────────────────────────────────────────────────────────

const parseAIResponse = (rawResponse: string): IQuestionPaper => {
  try {
    // Clean the response — remove any markdown code blocks if present
    let cleanResponse = rawResponse.trim();

    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\n?/, '').replace(/```$/, '');
    }
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```\n?/, '').replace(/```$/, '');
    }

    const parsed = JSON.parse(cleanResponse);

    // Validate required fields
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid response: missing sections array');
    }

    if (!parsed.answerKey || !Array.isArray(parsed.answerKey)) {
      throw new Error('Invalid response: missing answerKey array');
    }

    // Sanitize and structure the data
    const questionPaper: IQuestionPaper = {
      schoolName: parsed.schoolName || 'Delhi Public School',
      subject: parsed.subject || 'General',
      className: parsed.className || 'Class 1',
      timeAllowed: parsed.timeAllowed || '45 minutes',
      maximumMarks: Number(parsed.maximumMarks) || 0,
      generalInstruction:
        parsed.generalInstruction ||
        'All questions are compulsory unless stated otherwise.',
      sections: parsed.sections.map((section: any, sIndex: number): ISection => ({
        sectionLabel: section.sectionLabel || String.fromCharCode(65 + sIndex),
        title: section.title || 'Questions',
        instruction: section.instruction || 'Attempt all questions',
        questionType: section.questionType || 'Short Questions',
        questions: (section.questions || []).map(
          (q: any, qIndex: number): IQuestion => ({
            questionNumber: q.questionNumber || qIndex + 1,
            text: q.text || '',
            difficulty: ['Easy', 'Moderate', 'Challenging'].includes(q.difficulty)
              ? q.difficulty
              : 'Moderate',
            marks: Number(q.marks) || 1,
            options: Array.isArray(q.options) ? q.options : undefined,
          })
        ),
      })),
      answerKey: (parsed.answerKey || []).map(
        (item: any, index: number): IAnswerKeyItem => ({
          questionNumber: item.questionNumber || index + 1,
          answer: item.answer || '',
        })
      ),
    };

    return questionPaper;
  } catch (error) {
    console.error('❌ Failed to parse AI response:', error);
    console.error('Raw response:', rawResponse);
    throw new Error(`Failed to parse AI response: ${error}`);
  }
};

// ─── Main Generation Function ─────────────────────────────────────────────────

export const generateQuestionPaper = async (
  assignment: IAssignment
): Promise<IQuestionPaper> => {
  try {
    console.log(`🤖 Generating question paper for: ${assignment.subject} - ${assignment.className}`);

    const prompt = buildPrompt(assignment);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert exam paper creator. You always respond with valid JSON only. Never include markdown formatting or explanations in your response.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const rawResponse = completion.choices[0]?.message?.content;

    if (!rawResponse) {
      throw new Error('No response received from OpenAI');
    }

    console.log('✅ AI response received, parsing...');

    const questionPaper = parseAIResponse(rawResponse);

    console.log(
      `✅ Question paper generated with ${questionPaper.sections.length} sections`
    );

    return questionPaper;
  } catch (error) {
    console.error('❌ AI generation failed:', error);
    throw new Error(
      `AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export default generateQuestionPaper;