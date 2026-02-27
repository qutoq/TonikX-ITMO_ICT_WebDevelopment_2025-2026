<template>
  <div class="page">
    <v-card class="panel-card" rounded="xl" elevation="8">
      <v-card-title class="py-3">
        <div class="text-h5 font-weight-medium">Дашборд</div>
        <div class="panel-subtitle">Быстрый доступ к интерфейсам и API</div>
      </v-card-title>

      <v-card-text class="pt-2">
        <v-row>
          <!-- Основные интерфейсы -->
          <v-col cols="12" md="6">
            <div class="section-title">Основное</div>

            <v-card class="mini-card" rounded="xl" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Вершины</div>
                  <div class="text-body-2 text-grey-darken-1">GET/POST /api/mountains/</div>
                </div>

                <v-btn color="black" class="text-none" :to="{ name: 'mountains' }">
                  Открыть
                </v-btn>
              </v-card-text>
            </v-card>

            <v-card class="mini-card mt-3" rounded="xl" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Смена пароля</div>
                  <div class="text-body-2 text-grey-darken-1">POST /auth/users/set_password/</div>
                </div>

                <v-btn variant="outlined" class="text-none" :to="{ name: 'change-password' }">
                  Открыть
                </v-btn>
              </v-card-text>
            </v-card>

            <v-card class="mini-card mt-3" rounded="xl" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Альпинисты</div>
                  <div class="text-body-2 text-grey-darken-1">GET/POST /api/alpinists/</div>
                </div>

                <v-btn disabled variant="outlined" class="text-none">
                  Скоро
                </v-btn>
              </v-card-text>
            </v-card>

            <v-card class="mini-card mt-3" rounded="xl" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Создать восхождение</div>
                  <div class="text-body-2 text-grey-darken-1">POST /api/climbs/create/</div>
                </div>

                <v-btn disabled variant="outlined" class="text-none">
                  Скоро
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Отчёты -->
          <v-col cols="12" md="6">
            <div class="section-title">Отчёты / запросы</div>

            <v-card class="mini-card" rounded="xl" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Альпинисты по датам</div>
                  <div class="text-body-2 text-grey-darken-1">GET /api/query/alpinists-by-date/</div>
                </div>
                <v-btn disabled variant="outlined" class="text-none">Скоро</v-btn>
              </v-card-text>
            </v-card>

            <v-card class="mini-card mt-3" rounded="xl" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Восхождения по периоду</div>
                  <div class="text-body-2 text-grey-darken-1">GET /api/query/climbs-by-period/</div>
                </div>
                <v-btn disabled variant="outlined" class="text-none">Скоро</v-btn>
              </v-card-text>
            </v-card>

            <v-card class="mini-card mt-3" rounded="xl" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Статистика по горам</div>
                  <div class="text-body-2 text-grey-darken-1">GET /api/query/mountain-stats/</div>
                </div>
                <v-btn disabled variant="outlined" class="text-none">Скоро</v-btn>
              </v-card-text>
            </v-card>

            <v-card class="mini-card mt-3" rounded="xl" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Горы без восхождений</div>
                  <div class="text-body-2 text-grey-darken-1">GET /api/query/unclimbed/</div>
                </div>
                <v-btn disabled variant="outlined" class="text-none">Скоро</v-btn>
              </v-card-text>
            </v-card>

            <v-card class="mini-card mt-3" rounded="xl" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Альпинист × гора</div>
                  <div class="text-body-2 text-grey-darken-1">GET /api/query/alpinist-mountain-stats/</div>
                </div>
                <v-btn disabled variant="outlined" class="text-none">Скоро</v-btn>
              </v-card-text>
            </v-card>

            <v-card class="mini-card mt-3" rounded="xl" elevation="0">
              <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
                <div>
                  <div class="text-subtitle-1 font-weight-medium">Итоговый отчёт</div>
                  <div class="text-body-2 text-grey-darken-1">GET /api/query/final-report/</div>
                </div>
                <v-btn disabled variant="outlined" class="text-none">Скоро</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-5" />

        <div class="d-flex align-center justify-space-between flex-wrap ga-2">
          <div class="text-body-2 text-grey-darken-1">
            Документация API:
            <a class="link" href="http://localhost:8010/api/docs/" target="_blank" rel="noreferrer">
              Swagger
            </a>
          </div>

          <v-btn variant="text" class="text-none" @click="ping">
            Проверить API
          </v-btn>
        </div>

        <v-snackbar v-model="snackbar.show" :timeout="2200" color="grey-darken-4">
          {{ snackbar.text }}
          <template #actions>
            <v-btn variant="text" @click="snackbar.show = false">Ок</v-btn>
          </template>
        </v-snackbar>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import api from '../api'

const snackbar = reactive({ show: false, text: '' })

async function ping() {
  try {
    // любая безопасная ручка; mountains требует токен, но мы уже в авторизованной зоне
    await api.get('api/mountains/', { params: { page: 1 } })
    snackbar.text = 'API доступен'
    snackbar.show = true
  } catch (e) {
    console.error(e)
    snackbar.text = 'API недоступен (или проблема с токен��м/CORS)'
    snackbar.show = true
  }
}
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

.section-title {
  font-weight: 600;
  color: rgba(0,0,0,0.72);
  margin: 6px 0 10px;
}

.mini-card {
  border: 1px solid rgba(0,0,0,0.06);
  background: rgba(255, 255, 255, 0.6);
}

.link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>