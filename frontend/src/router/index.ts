import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: () => import('@/views/HomeView.vue') },
  { path: '/rooms', component: () => import('@/views/RoomsView.vue') },
  { path: '/rooms/:id', component: () => import('@/views/RoomDetailView.vue') },
  { path: '/about', component: () => import('@/views/AboutView.vue') },
  { path: '/imprint', component: () => import('@/views/ImprintView.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
