<template>
  <!-- Responsive Navigation Bar -->
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <!-- Mobile menu button -->
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-inset"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>

        <!-- Title in place of logo -->
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center">
            <span class="text-white text-xl font-bold">Mini mini ticket system</span>
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                :class="[
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium'
                ]"
                :aria-current="item.current ? 'page' : undefined"
              >
                {{ item.name }}
              </a>
            </div>
          </div>
        </div>

        <!-- Notifications & Profile dropdown -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          
          <Menu as="div" class="relative ml-3">
            <MenuButton
              class="relative flex rounded-full bg-gray-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span class="sr-only">Open user menu</span>
              <img
                class="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </MenuButton>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden"
              >
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                  >Your Profile</a>
                </MenuItem>
               
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                  >Sign out</a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <!-- Mobile menu panel -->
    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          :class="[
            item.current
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium'
          ]"
          :aria-current="item.current ? 'page' : undefined"
        >
          {{ item.name }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>

  <!-- Main Ticketing Content -->
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl px-2 mx-auto">
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold"></h1>
        <router-link
          to="/tickets/new"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + New Ticket
        </router-link>
      </header>

      <!-- Route-based rendering of list / form -->
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
import { ref } from 'vue'
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

// Navigation links for header
const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  
]

// Router & API
const router = useRouter()
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Ticket filter state
const filter = ref('')

// Push status filter to list route
function filterTickets(status) {
  filter.value = status
  router.push({ name: 'TicketList', query: status ? { status } : {} })
}

// After create/update, go back to list and reset filter
function onSaved() {
  router.push({ name: 'TicketList' })
  filter.value = ''
}

// Navigate to edit
function gotoEdit(ticket) {
  router.push({ name: 'TicketEdit', params: { id: ticket._id } })
}

// Delete a ticket
async function deleteTicket(id) {
  if (!confirm('Delete this ticket?')) return
  await fetch(`${VITE_API_URL}/tickets/${id}`, { method: 'DELETE' })
}
</script>
