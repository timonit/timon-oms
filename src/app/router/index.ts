import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { shiftGuard } from '../router-guards';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(shiftGuard);
