<template>
  <!-- Navigation Bar -->
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <!-- ... existing nav markup unchanged ... -->
  </Disclosure>

  <!-- Main Ticketing Content -->
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Mini Ticketing System</h1>
        <!-- Use router-link for navigation -->
        <router-link
          to="/tickets/new"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + New Ticket
        </router-link>
      </header>

      <!-- Route-based rendering -->
      <router-view v-slot="{ Component, route }">
        <component
          :is="Component"
          v-bind="route.props"
          @saved="onSaved"
          @filter="filterTickets"
          @edit="gotoEdit"
          @delete="deleteTicket"
        />
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Keep application-wide state
const filter = ref('')
// Whenever filter changes, update query and reload list
function filterTickets(status) {
  filter.value = status
  router.push({ name: 'TicketList', query: status ? { status } : {} })
}

// After save or cancel, go back to list and clear filter
function onSaved() {
  router.push({ name: 'TicketList' })
  filter.value = ''
}

// Navigate to edit
function gotoEdit(ticket) {
  router.push({ name: 'TicketEdit', params: { id: ticket._id } })
}

// Delete helper
async function deleteTicket(id) {
  if (!confirm('Delete this ticket?')) return
  await fetch(`${VITE_API_URL}/tickets/${id}`, { method: 'DELETE' })
}
</script>
