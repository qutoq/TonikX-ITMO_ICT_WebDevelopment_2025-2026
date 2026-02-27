<template>
  <div class="page">
    <v-card class="panel-card" rounded="xl" elevation="8">
      <v-card-title class="py-3 d-flex align-center justify-space-between flex-wrap ga-2">
        <div>
          <div class="text-h5 font-weight-medium">Альпклубы</div>
          <div class="panel-subtitle">Справочник</div>
        </div>

        <div class="d-flex align-center ga-2 flex-wrap">
          <v-text-field
            v-model.trim="search"
            label="Поиск (по текущей странице)"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            class="search-field"
          />

          <v-btn color="black" class="text-none" size="large" @click="openCreateDialog">
            Добавить
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text class="pt-2">
        <v-alert
          v-if="loadError"
          type="error"
          variant="tonal"
          class="mb-4"
          :text="loadError"
        />

        <v-progress-linear v-if="loading" indeterminate color="black" class="mb-4" />

        <div class="table-wrap">
          <v-table hover>
            <thead>
              <tr>
                <th style="width: 80px">ID</th>
                <th>Название</th>
                <th style="width: 160px">Страна</th>
                <th style="width: 180px">Город</th>
                <th>Контактное лицо</th>
                <th style="width: 220px">Email</th>
                <th style="width: 160px">Телефон</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="c in filteredClubs" :key="c.id">
                <td class="text-grey-darken-1">{{ c.id }}</td>
                <td class="font-weight-medium">{{ c.name }}</td>
                <td>{{ c.country }}</td>
                <td>{{ c.city }}</td>
                <td>{{ c.contact_person }}</td>
                <td class="text-truncate" style="max-width: 220px">{{ c.email }}</td>
                <td>{{ c.phone }}</td>
              </tr>

              <tr v-if="!loading && filteredClubs.length === 0">
                <td colspan="7" class="text-center py-8 text-grey-darken-1">Пусто</td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <div class="d-flex flex-wrap align-center justify-space-between mt-4 ga-2">
          <div class="text-body-2 text-grey-darken-1">
            Всего: <b>{{ totalCount }}</b>
            <span v-if="totalPages > 1"> • Страница {{ page }} из {{ totalPages }}</span>
          </div>

          <v-pagination
            v-if="totalPages > 1"
            v-model="page"
            :length="totalPages"
            :total-visible="7"
            density="comfortable"
            @update:model-value="fetchClubs"
          />
        </div>
      </v-card-text>
    </v-card>

    <!-- Create dialog -->
    <v-dialog v-model="createDialog" max-width="620">
      <v-card class="dialog-card" rounded="xl" elevation="10">
        <v-card-title class="py-3 d-flex align-center justify-space-between">
          <div class="text-h6 font-weight-medium">Добавить клуб</div>
          <v-btn icon="mdi-close" variant="text" @click="createDialog = false" />
        </v-card-title>

        <v-card-text class="pt-2">
          <v-alert v-if="createError" type="error" variant="tonal" class="mb-4" :text="createError" />

          <v-form @submit.prevent="createClub">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model.trim="form.name" label="Название" variant="outlined" density="comfortable"
                  :disabled="createLoading" class="mb-2" required />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.country" label="Страна" variant="outlined" density="comfortable"
                  :disabled="createLoading" class="mb-2" required />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.city" label="Город" variant="outlined" density="comfortable"
                  :disabled="createLoading" class="mb-2" required />
              </v-col>

              <v-col cols="12">
                <v-text-field v-model.trim="form.contact_person" label="Контактное лицо" variant="outlined"
                  density="comfortable" :disabled="createLoading" class="mb-2" required />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.email" label="Email" variant="outlined" density="comfortable"
                  :disabled="createLoading" class="mb-2" required />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.phone" label="Телефон" variant="outlined" density="comfortable"
                  :disabled="createLoading" class="mb-2" required />
              </v-col>
            </v-row>

            <v-btn
              type="submit"
              block
              color="black"
              class="mt-3 text-none"
              size="large"
              :loading="createLoading"
              :disabled="!canSubmit"
            >
              Сохранить
            </v-btn>

            <v-btn
              block
              variant="text"
              class="mt-2 text-none"
              :disabled="createLoading"
              @click="createDialog = false"
            >
              Отмена
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :timeout="2200" color="grey-darken-4">
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Ок</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import api from '../api'

const clubs = ref([])
const loading = ref(false)
const loadError = ref('')

const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)))

const filteredClubs = computed(() => {
  const q = (search.value || '').toLowerCase()
  if (!q) return clubs.value
  return clubs.value.filter((c) => {
    return (
      String(c.id).includes(q) ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.country || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q) ||
      (c.contact_person || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q)
    )
  })
})

const createDialog = ref(false)
const createLoading = ref(false)
const createError = ref('')

const form = reactive({
  name: '',
  country: '',
  city: '',
  contact_person: '',
  email: '',
  phone: '',
})

const snackbar = reactive({ show: false, text: '' })

const canSubmit = computed(() => {
  return (
    form.name.trim() &&
    form.country.trim() &&
    form.city.trim() &&
    form.contact_person.trim() &&
    form.email.trim() &&
    form.phone.trim()
  )
})

function openCreateDialog() {
  createError.value = ''
  form.name = ''
  form.country = ''
  form.city = ''
  form.contact_person = ''
  form.email = ''
  form.phone = ''
  createDialog.value = true
}

function formatErr(e) {
  const d = e?.response?.data
  if (!d) return 'Ошибка запроса'
  if (typeof d === 'string') return d
  if (typeof d === 'object') {
    return Object.entries(d)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
      .join(' | ')
  }
  return 'Ошибка'
}

async function fetchClubs() {
  // ВАЖНО: на backend сейчас нет ручки /api/clubs/.
  // Поэтому эта страница заработает только после добавления API (см. примечание ниже).
  loading.value = true
  loadError.value = ''
  try {
    const resp = await api.get('api/clubs/', { params: { page: page.value } })
    clubs.value = resp.data?.results || []
    totalCount.value = resp.data?.count ?? clubs.value.length
  } catch (e) {
    console.error(e)
    loadError.value = 'Не удалось загрузить клубы. Проверь, что есть endpoint /api/clubs/'
  } finally {
    loading.value = false
  }
}

async function createClub() {
  createError.value = ''
  if (!canSubmit.value) return

  createLoading.value = true
  try {
    await api.post('api/clubs/', {
      name: form.name,
      country: form.country,
      city: form.city,
      contact_person: form.contact_person,
      email: form.email,
      phone: form.phone,
    })

    createDialog.value = false
    snackbar.text = 'Клуб добавлен'
    snackbar.show = true

    page.value = 1
    await fetchClubs()
  } catch (e) {
    console.error(e)
    createError.value = formatErr(e)
  } finally {
    createLoading.value = false
  }
}

onMounted(fetchClubs)
</script>

<style scoped>
.page {
  height: 100%;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.panel-card {
  width: 100%;
  max-width: 1200px;
  padding: 10px;
  backdrop-filter: blur(6px);
  background-color: rgba(255, 255, 255, 0.92);
}

.panel-subtitle {
  font-size: 14px;
  margin-top: 2px;
  color: rgba(0, 0, 0, 0.6);
}

.search-field {
  width: 320px;
  max-width: 70vw;
}

.table-wrap {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
}

.dialog-card {
  backdrop-filter: blur(6px);
  background-color: rgba(255, 255, 255, 0.94);
}
</style>