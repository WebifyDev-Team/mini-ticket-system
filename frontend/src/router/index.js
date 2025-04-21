import { createRouter, createWebHashHistory } from 'vue-router'
import TicketList from '../components/TicketList.vue'
import TicketForm from '../components/TicketForm.vue'

const routes = [
  {
    path: '/',
    name: 'TicketList',
    component: TicketList,
    props: route => ({ filter: route.query.status || '' })
  },
  {
    path: '/tickets/new',
    name: 'TicketCreate',
    component: TicketForm,
    props: { mode: 'create' }
  },
  {
    path: '/tickets/:id/edit',
    name: 'TicketEdit',
    component: TicketForm,
    props: route => ({ mode: 'edit', id: route.params.id })
  }
]

export default createRouter({
  // <-- switched from createWebHistory to createWebHashHistory
  history: createWebHashHistory(),
  routes
})
