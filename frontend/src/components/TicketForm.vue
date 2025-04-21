<template>
  <div class="max-w-lg mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">
      {{ mode === 'edit' ? 'Edit Ticket' : 'New Ticket' }}
    </h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Title -->
      <div>
        <label class="block text-gray-700 mb-1" for="title">Title</label>
        <input
          id="title"
          v-model="form.title"
          required
          maxlength="255"
          class="w-full border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-gray-700 mb-1" for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          required
          class="w-full border-gray-300 rounded p-2 h-24 focus:ring-2 focus:ring-blue-300"
        ></textarea>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-gray-700 mb-1" for="status">Status</label>
        <select
          id="status"
          v-model="form.status"
          class="w-full border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-300"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-2">
        <button
          type="button"
          @click="cancel"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {{ mode === 'edit' ? 'Update' : 'Create' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({ mode: String, id: String })
const emits = defineEmits(['saved'])

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const form = reactive({ title: '', description: '', status: 'open' })

onMounted(async () => {
  if (props.mode === 'edit') {
    const res = await fetch(`${API_BASE}/tickets/${props.id}`)
    Object.assign(form, await res.json())
  }
})

function cancel() {
  emits('saved')
}

async function onSubmit() {
  // Prepare payload, omitting _id if present
  const payload = { title: form.title, description: form.description, status: form.status }

  const url = props.mode === 'edit'
    ? `${API_BASE}/tickets/${props.id}`
    : `${API_BASE}/tickets`
  const method = props.mode === 'edit' ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    
    // Show success alert
    alert(props.mode === 'edit'
      ? 'Ticket updated successfully!'
      : 'Ticket created successfully!')

    emits('saved')
  } catch (err) {
    console.error('Error saving ticket:', err)
    alert('There was a problem saving your ticket.')
  }
}
</script>
