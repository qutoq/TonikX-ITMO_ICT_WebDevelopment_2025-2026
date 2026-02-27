<template>
  <div class="page">
    <v-card class="panel-card" rounded="xl" elevation="8">
      <v-card-title class="py-3 d-flex align-center justify-space-between flex-wrap ga-2">
        <div>
          <div class="text-h5 font-weight-medium">Альпинисты</div>
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
        <v-progress-linear v-if="loading" indeterminate color="black" class="mb-4" />

        <div class="table-wrap">
          <v-table hover>
            <thead>
              <tr>
                <th style="width: 80px">ID</th>
                <th>ФИО</th>
                <th>Адрес</th>
                <th style="width: 220px">Клуб</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="a in filteredAlpinists" :key="a.id">
                <td class="text-grey-darken-1">{{ a.id }}</td>
                <td class="font-weight-medium">{{ a.name }}</td>
                <td class="text-truncate" style="max-width: 520px">{{ a.address }}</td>
                <td>{{ a.club_name || '—' }}</td>
              </tr>

              <tr v-if="!loading && filteredAlpinists.length === 0">
                <td colspan="4" class="text-center py-8 text-grey-darken-1">Пусто</td>
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
            @update:model-value="fetchAlpinists"
          />
        </div>
      </v-card-text>
    </v-card>

    <!-- Create dialog -->
    <v-dialog v-model="createDialog" max-width="560">
      <v-card class="dialog-card" rounded="xl" elevation="10">
        <v-card-title class="py-3 d-flex align-center justify-space-between">
          <div class="text-h6 font-weight-medium">Добавить альпиниста</div>
          <v-btn icon="mdi-close" variant="text" @click="createDialog = false" />
        </v-card-title>

        <v-card-text class="pt-2">
          <v-alert v-if="createError" type="error" variant="tonal" class="mb-4" :text="createError" />

          <v-form @submit.prevent="createAlpinist">
            <v-text-field
              v-model.trim="form.name"
              label="ФИО"
              variant="outlined"
              density="comfortable"
              :disabled="createLoading"
              class="mb-3"
              required
            />

            <v-text-field
              v-model.trim="form.address"
              label="Адрес"
              variant="outlined"
              density="comfortable"
              :disabled="createLoading"
              class="mb-3"
              required
            />

            <v-text-field
              v-model.number="form.club"
              label="ID клуба (необязательно)"
              type="number"
              variant="outlined"
              density="comfortable"
              :disabled="createLoading"
              hint="Если не знаешь ID — оставь пустым"
              persistent-hint
            />

            <v-btn
              type="submit"
              block
              color="black"
              class="mt-5 text-none"
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

const alpinists = ref([])
const loading = ref(false)

const search = ref('')
const page = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)))

const filteredAlpinists = computed(() => {
  const q = (search.value || '').toLowerCase()
  if (!q) return alpinists.value
  return alpinists.value.filter((a) => {
    return (
      String(a.id).includes(q) ||
      (a.name || '').toLowerCase().includes(q) ||
      (a.address || '').toLowerCase().includes(q) ||
      (a.club_name || '').toLowerCase().includes(q)
    )
  })
})

const createDialog = ref(false)
const createLoading = ref(false)
const createError = ref('')

const form = reactive({
  name: '',
  address: '',
  club: null,
})

const snackbar = reactive({
  show: false,
  text: '',
})

const canSubmit = computed(() => {
  return form.name.trim().length > 0 && form.address.trim().length > 0
})

function openCreateDialog() {
  createError.value = ''
  form.name = ''
  form.address = ''
  form.club = null
  createDialog.value = true
}

async function fetchAlpinists() {
  loading.value = true
  try {
    const resp = await api.get('api/alpinists/', { params: { page: page.value } })
    // в проекте пагинация включена глобально
    alpinists.value = resp.data?.results || []
    totalCount.value = resp.data?.count ?? alpinists.value.length
  } catch (e) {
    console.error(e)
    snackbar.text = 'Не удалось загрузить альпинистов'
    snackbar.show = true
  } finally {
    loading.value = false
  }
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

async function createAlpinist() {
  createError.value = ''
  if (!canSubmit.value) return

  createLoading.value = true
  try {
    const payload = {
      name: form.name,
      address: form.address,
      club: form.club ? Number(form.club) : null,
    }
    await api.post('api/alpinists/', payload)

    createDialog.value = false
    snackbar.text = 'Альпинист добавлен'
    snackbar.show = true

    page.value = 1
    await fetchAlpinists()
  } catch (e) {
    console.error(e)
    createError.value = formatErr(e)
  } finally {
    createLoading.value = false
  }
}

onMounted(fetchAlpinists)
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
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.dialog-card {
  backdrop-filter: blur(6px);
  background-color: rgba(255, 255, 255, 0.94);
}
</style>