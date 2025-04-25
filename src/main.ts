import { createApp } from 'vue'
import App from './App.vue'

import "./assets/normalize.scss";
import "./assets/_custom-bootstrap.scss"
import "bootstrap"
import "./assets/style.scss"

import { createWebHistory, createRouter } from 'vue-router'
import LoginPage from './pages/login-page/login-page.vue'
import ProjectPage from './pages/project-page/view/project-page.vue'
import ProjectsListPage from './pages/project-page/view/projects-list-page.vue'
import RegisterPage from './pages/register-page/register-page.vue'

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/', component: ProjectsListPage },
  { path: '/project/:id', component: ProjectPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router).mount('#app')
