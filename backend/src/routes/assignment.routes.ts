import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignment,
  getAssignmentResult,
  deleteAssignment,
  regenerateAssignment,
} from '../controllers/assignment.controller';

const router = Router();

//Writing for better Understanding and readability of the code for me
// GET    /api/assignments          → Get all assignments
// POST   /api/assignments          → Create new assignment
// GET    /api/assignments/:id      → Get single assignment
// DELETE /api/assignments/:id      → Delete assignment
// GET    /api/assignments/:id/result    → Get generated result
// POST   /api/assignments/:id/regenerate → Regenerate question paper

router.get('/', getAssignments);
router.post('/', createAssignment);
router.get('/:id', getAssignment);
router.delete('/:id', deleteAssignment);
router.get('/:id/result', getAssignmentResult);
router.post('/:id/regenerate', regenerateAssignment);

export default router;