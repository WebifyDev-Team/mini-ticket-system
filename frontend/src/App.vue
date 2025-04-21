<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <DisclosureButton
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-inset"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>

        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center">
            <span class="text-white text-xl font-bold">Mini ticket system</span>
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

        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          
          
        </div>
      </div>
    </div>

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

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  
]

const router = useRouter()
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const filter = ref('')

function filterTickets(status) {
  filter.value = status
  router.push({ name: 'TicketList', query: status ? { status } : {} })
}

function onSaved() {
  router.push({ name: 'TicketList' })
  filter.value = ''
}

function gotoEdit(ticket) {
  router.push({ name: 'TicketEdit', params: { id: ticket._id } })
}

async function deleteTicket(id) {
  if (!confirm('Delete this ticket?')) return
  await fetch(`${VITE_API_URL}/tickets/${id}`, { method: 'DELETE' })
}
</script>
