import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import { createElement } from 'react';
import { QuestionPaper, DifficultyLevel } from '../types';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
    color: '#303030',
    backgroundColor: '#FFFFFF',
  },
  // Header
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: '1px solid #E5E5E5',
    paddingBottom: 12,
  },
  schoolName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subjectClass: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  // Meta row
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 12,
  },
  metaText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  // Instructions
  instruction: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
  },
  // Student info
  studentInfo: {
    marginBottom: 16,
  },
  studentInfoRow: {
    fontSize: 10,
    marginBottom: 6,
  },
  // Section
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  sectionInstruction: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#6B6B6B',
    marginBottom: 8,
  },
  // Question
  questionRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  questionNumber: {
    fontSize: 10,
    width: 24,
    flexShrink: 0,
  },
  questionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionText: {
    fontSize: 10,
    flex: 1,
    paddingRight: 8,
  },
  questionMeta: {
    fontSize: 9,
    color: '#6B6B6B',
    flexShrink: 0,
  },
  // Options for MCQ
  optionRow: {
    flexDirection: 'row',
    marginLeft: 24,
    marginTop: 2,
    marginBottom: 2,
  },
  optionText: {
    fontSize: 9,
    color: '#303030',
  },
  // End of paper
  endOfPaper: {
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginTop: 16,
    marginBottom: 16,
    borderTop: '1px solid #E5E5E5',
    paddingTop: 12,
  },
  // Answer key
  answerKeyTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
    marginTop: 8,
    borderTop: '1px solid #E5E5E5',
    paddingTop: 12,
  },
  answerRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  answerNumber: {
    fontSize: 10,
    width: 24,
    flexShrink: 0,
    fontFamily: 'Helvetica-Bold',
  },
  answerText: {
    fontSize: 10,
    flex: 1,
  },
});

//Difficulty Label
const getDifficultyLabel = (difficulty: DifficultyLevel): string => {
  return `[${difficulty}]`;
};

//PDF Document Component
const QuestionPaperPDF = (questionPaper: QuestionPaper) => {
  return createElement(
    Document,
    null,
    createElement(
      Page,
      { size: 'A4', style: styles.page },
      createElement(
        View,
        { style: styles.header },
        createElement(Text, { style: styles.schoolName }, questionPaper.schoolName),
        createElement(Text, { style: styles.subjectClass }, `Subject: ${questionPaper.subject}`),
        createElement(Text, { style: styles.subjectClass }, `Class: ${questionPaper.className}`)
      ),

      // Meta row
      createElement(
        View,
        { style: styles.metaRow },
        createElement(Text, { style: styles.metaText }, `Time Allowed: ${questionPaper.timeAllowed}`),
        createElement(Text, { style: styles.metaText }, `Maximum Marks: ${questionPaper.maximumMarks}`)
      ),

      // General instruction
      createElement(
        Text,
        { style: styles.instruction },
        questionPaper.generalInstruction
      ),

      // Student info
      createElement(
        View,
        { style: styles.studentInfo },
        createElement(Text, { style: styles.studentInfoRow }, 'Name: ______________________'),
        createElement(Text, { style: styles.studentInfoRow }, 'Roll Number: ________________'),
        createElement(Text, { style: styles.studentInfoRow }, 'Class/Section: ______________')
      ),

      // Sections
      ...questionPaper.sections.map((section, sIndex) =>
        createElement(
          View,
          { key: sIndex, style: styles.sectionContainer },

          // Section title
          createElement(Text, { style: styles.sectionTitle }, `Section ${section.sectionLabel}`),
          createElement(Text, { style: styles.sectionSubTitle }, section.title),
          createElement(Text, { style: styles.sectionInstruction }, section.instruction),

          // Questions
          ...section.questions.map((question, qIndex) =>
            createElement(
              View,
              { key: qIndex },
              createElement(
                View,
                { style: styles.questionRow },
                createElement(Text, { style: styles.questionNumber }, `${question.questionNumber}.`),
                createElement(
                  View,
                  { style: styles.questionContent },
                  createElement(
                    Text,
                    { style: styles.questionText },
                    `${getDifficultyLabel(question.difficulty)} ${question.text}`
                  ),
                  createElement(
                    Text,
                    { style: styles.questionMeta },
                    `[${question.marks} Mark${question.marks > 1 ? 's' : ''}]`
                  )
                )
              ),

              // MCQ options
              ...(question.options
                ? question.options.map((option, oIndex) =>
                    createElement(
                      View,
                      { key: oIndex, style: styles.optionRow },
                      createElement(
                        Text,
                        { style: styles.optionText },
                        `${String.fromCharCode(65 + oIndex)}. ${option}`
                      )
                    )
                  )
                : [])
            )
          )
        )
      ),

      // End of paper
      createElement(Text, { style: styles.endOfPaper }, 'End of Question Paper'),

      // Answer key
      createElement(Text, { style: styles.answerKeyTitle }, 'Answer Key:'),
      ...questionPaper.answerKey.map((item, index) =>
        createElement(
          View,
          { key: index, style: styles.answerRow },
          createElement(Text, { style: styles.answerNumber }, `${item.questionNumber}.`),
          createElement(Text, { style: styles.answerText }, item.answer)
        )
      )
    )
  );
};

//Export Function
export const downloadPDF = async (
  questionPaper: QuestionPaper,
  filename?: string
): Promise<void> => {
  try {
    const doc = QuestionPaperPDF(questionPaper);
    const blob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${questionPaper.subject}_${questionPaper.className}_QuestionPaper.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};

export default downloadPDF;