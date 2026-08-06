import { Router } from 'express';
import { getAllPizzas, getPizzaById, getCategories } from '../../controllers/pizzaController.js';

const router = Router();

router.get('/categories', getCategories);
router.get('/', getAllPizzas);
router.get('/:id', getPizzaById);

export default router;
