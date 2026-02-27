<template>
  <div class="login-page">
    <v-card class="login-card" rounded="xl" elevation="8">

      <v-card-title class="py-3">
        <div class="text-h5 font-weight-medium">Вход</div>
        <div class="admin-subtitle">
          Панель администратора
        </div>
      </v-card-title>

      <v-card-text class="pt-2">
        <v-alert
          v-if="errorText"
          type="error"
          variant="tonal"
          class="mb-4"
          :text="errorText"
        />

        <v-form @submit.prevent="onSubmit">
          <v-text-field
            v-model.trim="username"
            label="Логин"
            variant="outlined"
            density="comfortable"
            autocomplete="username"
            :disabled="loading"
            class="mb-3"
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Пароль"
            variant="outlined"
            density="comfortable"
            autocomplete="current-password"
            :disabled="loading"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-btn
            type="submit"
            block
            color="black"
            class="mt-5 text-none"
            size="large"
            :loading="loading"
            :disabled="!username || !password"
          >
            Войти
          </v-btn>
        </v-form>
      </v-card-text>

    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)

const loading = ref(false)
const errorText = ref('')

async function onSubmit() {
  errorText.value = ''
  loading.value = true
  try {
    const ok = await auth.login(username.value, password.value)
    if (!ok) {
      errorText.value = 'Неверный логин или пароль'
      return
    }
    router.push({ name: 'dashboard' })
  } catch (e) {
    errorText.value = 'Ошибка входа. Проверь backend/CORS.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100%;
  min-height: calc(100vh - 64px); /* если app-bar 64px */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Карточка */
.login-card {
  width: 100%;
  max-width: 420px;
  padding: 20px;
  backdrop-filter: blur(6px);
  background-color: rgba(255, 255, 255, 0.92);
}

/* Подпись */
.admin-subtitle {
  font-size: 14px;
  margin-top: 2px;
  color: rgba(0, 0, 0, 0.6);
}
</style>