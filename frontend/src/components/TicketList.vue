<template>
  <div class="space-y-6">
    <!-- Status Filters -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="s in statuses"
        :key="s.value"
        @click="filterStatus(s.value)"
        :class="[
          'px-4 py-2 rounded-full font-semibold transition focus:outline-none',
          filter.value === s.value
            ? 'bg-blue-600 text-white shadow'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- Ticket List -->
    <ul role="list" class="space-y-4">
      <li
        v-for="ticket in tickets"
        :key="ticket._id"
        class="group flex justify-between items-start gap-x-6 p-6 bg-white rounded-lg shadow hover:shadow-xl transform hover:-translate-y-1 transition"
        :class="borderClass(ticket.status)"
      >
        <!-- Left: Title & Description -->
        <div class="flex-1 min-w-0">
          <p class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition">
            {{ ticket.title }}
          </p>
          <p class="mt-2 text-sm text-gray-500">
            {{ ticket.description }}
          </p>
        </div>

        <!-- Right: Status & Actions -->
        <div class="flex-shrink-0 flex flex-col items-end space-y-3">
          <!-- Status Badge -->
          <span
            class="inline-flex items-center px-3 py-1 text-xs font-medium uppercase rounded-full tracking-wide"
            :class="statusClass(ticket.status)"
          >
            {{ ticket.status.replace('_', ' ') }}
          </span>

          <!-- Icons -->
          <div class="flex space-x-2">
            <router-link
              :to="{ name: 'TicketEdit', params: { id: ticket._id } }"
              class="p-2 rounded-full hover:bg-blue-100 transition"
            >
              <PencilIcon class="h-5 w-5 text-blue-500" />
            </router-link>
            <button
              @click="remove(ticket._id)"
              class="p-2 rounded-full hover:bg-red-100 transition"
            >
              <TrashIcon class="h-5 w-5 text-red-500" />
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Empty State -->
    <div v-if="tickets.length === 0" class="py-12 text-center text-gray-400">
      <svg
        class="mx-auto h-12 w-12 opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 13h6m2 0a2 2 0 100-4H7a2 2 0 000 4h6zm0 0v6m0-6V7" />
      </svg>
      <p class="mt-4 text-sm">No tickets found.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const route = useRoute()
const router = useRouter()

const tickets = ref([])
const filter = ref(route.query.status || '')

const statuses = [
  { label: 'All', value: '' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Closed', value: 'closed' }
]

async function fetchTickets() {
  const q = filter.value ? `?status=${filter.value}` : ''
  const res = await fetch(`${API_BASE}/tickets${q}`)
  tickets.value = await res.json()
}

onMounted(fetchTickets)
watch(() => route.query.status, (s) => {
  filter.value = s || ''
  fetchTickets()
})

function filterStatus(val) {
  router.push({ query: val ? { status: val } : {} })
}

// Tailwind classes for side-border color
function borderClass(status) {
  const map = {
    open: 'border-l-4 border-green-500',
    in_progress: 'border-l-4 border-yellow-500',
    closed: 'border-l-4 border-gray-400'
  }
  return map[status] || ''
}

// Tailwind classes for badge
function statusClass(s) {
  return {
    'bg-green-100 text-green-800': s === 'open',
    'bg-yellow-100 text-yellow-800': s === 'in_progress',
    'bg-gray-100 text-gray-800': s === 'closed'
  }
}

async function remove(id) {
  if (!confirm('Delete this ticket?')) return
  await fetch(`${API_BASE}/tickets/${id}`, { method: 'DELETE' })
  fetchTickets()
}
</script>

<style>
/* ensure the card border sits flush */
ul > li {
  border-left-width: 4px;
}
</style>
