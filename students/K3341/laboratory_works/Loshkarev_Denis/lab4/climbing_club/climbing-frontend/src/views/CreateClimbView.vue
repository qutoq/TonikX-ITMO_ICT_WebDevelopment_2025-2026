<template>
  <div class="page">
    <v-card class="panel-card" rounded="xl" elevation="8">
      <v-card-title class="py-3">
        <div class="text-h5 font-weight-medium">Создать восхождение</div>
        <div class="panel-subtitle">POST /api/climbs/create/</div>
      </v-card-title>

      <v-card-text class="pt-2">
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4" :text="error" />
        <v-alert v-if="ok" type="success" variant="tonal" class="mb-4" :text="ok" />

        <v-form @submit.prevent="submit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.route"
                label="ID маршрута (route)"
                type="number"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
                hint="Пока вводится вручную (routes не выведены отдельной страницей)"
                persistent-hint
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.trim="form.group_name"
                label="Название группы"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.start_planned"
                label="Начало (план) — YYYY-MM-DDTHH:MM"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.end_planned"
                label="Конец (план) — YYYY-MM-DDTHH:MM"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.start_actual"
                label="Начало (факт) — YYYY-MM-DDTHH:MM (опц.)"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.end_actual"
                label="Конец (факт) — YYYY-MM-DDTHH:MM (опц.)"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-switch
                v-model="form.is_group_success"
                color="black"
                inset
                :disabled="loading"
                label="Успех группы"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model.trim="form.group_notes"
                label="Пояснение по группе / нештатные ситуации"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
                rows="3"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-2">
            <div class="text-subtitle-1 font-weight-medium">Участники</div>
            <v-btn variant="outlined" class="text-none" :disabled="loading" @click="addParticipant">
              Добавить участника
            </v-btn>
          </div>

          <v-alert
            v-if="participants.length === 0"
            type="info"
            variant="tonal"
            class="mb-3"
            text="Добавь хотя бы одного участника (participants_data)."
          />

          <v-row v-for="(p, idx) in participants" :key="idx" class="mb-1">
            <v-col cols="12" md="3">
              <v-text-field
                v-model.number="p.alpinist"
                label="ID альпиниста"
                type="number"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-switch
                v-model="p.is_success"
                color="black"
                inset
                :disabled="loading"
                label="Успех"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-model="p.status"
                :items="statusItems"
                label="Статус"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model.trim="p.incident_details"
                label="Подробности"
                variant="outlined"
                density="comfortable"
                :disabled="loading"
              />
            </v-col>

            <v-col cols="12" md="1" class="d-flex align-center justify-end">
              <v-btn
                icon="mdi-delete"
                variant="text"
                :disabled="loading"
                @click="removeParticipant(idx)"
              />
            </v-col>
          </v-row>

          <v-btn
            type="submit"
            block
            color="black"
            class="mt-5 text-none"
            size="large"
            :loading="loading"
            :disabled="!canSubmit"
          >
            Создать восхождение
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import api from '../api'

const loading = ref(false)
const error = ref('')
const ok = ref('')

const statusItems = ['success', 'failed', 'injury', 'missing', 'fatal', 'other']

const form = ref({
  route: null,
  group_name: '',
  start_planned: '',
  end_planned: '',
  start_actual: '',
  end_actual: '',
  is_group_success: false,
  group_notes: '',
})

const participants = ref([])

function addParticipant() {
  participants.value.push({
    alpinist: null,
    is_success: false,
    status: 'success',
    incident_details: '',
  })
}

function removeParticipant(idx) {
  participants.value.splice(idx, 1)
}

const canSubmit = computed(() => {
  return (
    Number.isFinite(Number(form.value.route)) &&
    form.value.group_name.trim().length > 0 &&
    form.value.start_planned.trim().length > 0 &&
    form.value.end_planned.trim().length > 0 &&
    participants.value.length > 0 &&
    participants.value.every((p) => Number.isFinite(Number(p.alpinist)))
  )
})

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

function normalizeDateTime(s) {
  // DRF DateTimeField обычно принимает ISO: "YYYY-MM-DDTHH:MM[:SS]Z"
  // Ты вводишь "YYYY-MM-DDTHH:MM" — это обычно проходит.
  // Если пусто — вернем null (для optional)
  return s && String(s).trim().length ? String(s).trim() : null
}

async function submit() {
  error.value = ''
  ok.value = ''

  if (!canSubmit.value) {
    error.value = 'Заполни обязательные поля (route, group_name, start/end planned, participants)'
    return
  }

  loading.value = true
  try {
    const payload = {
      route: Number(form.value.route),
      group_name: form.value.group_name,
      start_planned: normalizeDateTime(form.value.start_planned),
      end_planned: normalizeDateTime(form.value.end_planned),
      start_actual: normalizeDateTime(form.value.start_actual),
      end_actual: normalizeDateTime(form.value.end_actual),
      is_group_success: !!form.value.is_group_success,
      group_notes: form.value.group_notes || '',
      participants_data: participants.value.map((p) => ({
        alpinist: Number(p.alpinist),
        is_success: !!p.is_success,
        status: p.status,
        incident_details: p.incident_details || '',
      })),
    }

    await api.post('api/climbs/create/', payload)
    ok.value = 'Восхождение создано'

    // очистка
    form.value.group_name = ''
    form.value.group_notes = ''
    participants.value = []
    addParticipant()
  } catch (e) {
    console.error(e)
    error.value = formatErr(e)
  } finally {
    loading.value = false
  }
}

// чтобы не было пустой формы участников
addParticipant()
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
  padding: 20px;
  backdrop-filter: blur(6px);
  background-color: rgba(255, 255, 255, 0.92);
}

.panel-subtitle {
  font-size: 14px;
  margin-top: 2px;
  color: rgba(0, 0, 0, 0.6);
}
</style>