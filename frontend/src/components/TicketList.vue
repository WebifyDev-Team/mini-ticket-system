<template>
  <div class="space-y-4">
    <!-- Status Filters update query param -->
    <div class="flex space-x-2 mb-4">
      <button
        v-for="s in statuses"
        :key="s.value"
        @click="filterStatus(s.value)"
        :class="[
          'px-3 py-1 rounded-full font-medium',
          filter.value === s.value
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- Ticket Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="ticket in tickets"
        :key="ticket._id"
        class="bg-white p-4 rounded shadow"
      >
        <h3 class="text-lg font-semibold">{{ ticket.title }}</h3>
        <p class="mt-2 text-gray-600">{{ ticket.description }}</p>
        <span
          class="inline-block mt-3 px-2 py-1 text-sm rounded-full"
          :class="statusClass(ticket.status)"
        >
          {{ ticket.status.replace('_', ' ') }}
        </span>
        <div class="mt-4 flex space-x-2">
          <router-link
            :to="{ name: 'TicketEdit', params: { id: ticket._id } }"
            class="flex-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Edit
          </router-link>
          <button
            @click="remove(ticket._id)"
            class="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <p v-if="tickets.length === 0" class="text-center text-gray-500">
      No tickets found.
    </p>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Base API URL from env
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

// Fetch tickets from API
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

// Update the query param to filter
function filterStatus(val) {
  router.push({ query: val ? { status: val } : {} })
}

// CSS classes per status
function statusClass(s) {
  return {
    'bg-green-100 text-green-800': s === 'open',
    'bg-yellow-100 text-yellow-800': s === 'in_progress',
    'bg-gray-100 text-gray-800': s === 'closed'
  }
}

// Delete a ticket and refresh
async function remove(id) {
  if (!confirm('Delete this ticket?')) return
  await fetch(`${API_BASE}/tickets/${id}`, { method: 'DELETE' })
  fetchTickets()
}
</script>
