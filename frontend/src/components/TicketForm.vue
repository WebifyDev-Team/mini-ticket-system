<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-12 bg-white p-6 rounded shadow max-w-lg mx-auto"
  >
    <!-- Ticket Details Section -->
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">
        {{ mode === 'edit' ? 'Edit Ticket' : 'New Ticket' }}
      </h2>
      <p class="mt-1 text-sm/6 text-gray-600">
        {{ mode === 'edit'
          ? 'Make changes to your ticket details.'
          : 'Fill out this form to create a new ticket.' }}
      </p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <!-- Title -->
        <div class="sm:col-span-6">
          <label
            for="title"
            class="block text-sm/6 font-medium text-gray-900"
          >
            Title
          </label>
          <div class="mt-2">
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              maxlength="255"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="sm:col-span-6">
          <label
            for="description"
            class="block text-sm/6 font-medium text-gray-900"
          >
            Description
          </label>
          <div class="mt-2">
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            ></textarea>
          </div>
        </div>

        <!-- Status -->
        <div class="sm:col-span-3">
          <label
            for="status"
            class="block text-sm/6 font-medium text-gray-900"
          >
            Status
          </label>
          <div class="mt-2">
            <select
              id="status"
              v-model="form.status"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button
        type="button"
        @click="cancel"
        class="text-sm/6 font-semibold text-gray-900"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {{ mode === 'edit' ? 'Update' : 'Create' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

const props = defineProps({
  mode: { type: String, required: true },
  id:    { type: String, required: false },
})
const emits = defineEmits(['saved'])

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const form = reactive({
  title:       '',
  description: '',
  status:      'open',
})

onMounted(async () => {
  if (props.mode === 'edit' && props.id) {
    const res = await fetch(`${API_BASE}/tickets/${props.id}`)
    if (res.ok) {
      Object.assign(form, await res.json())
    }
  }
})

function cancel() {
  emits('saved')
}

async function onSubmit() {
  const payload = {
    title:       form.title,
    description: form.description,
    status:      form.status,
  }
  const url    = props.mode === 'edit'
    ? `${API_BASE}/tickets/${props.id}`
    : `${API_BASE}/tickets`
  const method = props.mode === 'edit' ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Server error: ${res.status}`)

    alert(
      props.mode === 'edit'
        ? 'Ticket updated successfully!'
        : 'Ticket created successfully!'
    )
    emits('saved')
  } catch (err) {
    console.error('Error saving ticket:', err)
    alert('There was a problem saving your ticket.')
  }
}
</script>
