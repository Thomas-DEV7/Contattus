<!-- src/views/Login.vue -->
<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <h2 class="text-center mb-4">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="form-control"
            placeholder="Enter your username"
            required
            autofocus
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/apiClient'; // Cliente Axios configurado com VITE_API_BASE_URL
import { useAuthStore } from '../store/auth';

export default {
  name: 'Login',
  setup() {
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const router = useRouter();
    const authStore = useAuthStore();

    /**
     * Envia a requisição de login para o endpoint /loginRequest.
     * Em caso de sucesso, inicializa os dados de autenticação no front-end e redireciona para a Home.
     */
    const handleLogin = async () => {
      errorMessage.value = '';
      try {
        const payload = {
          username: username.value,
          password: password.value
        };
        const response = await apiClient.post('/auth/login', payload);

        // Verifica se a resposta contém o token e os dados do usuário.
        if (response.data && response.data.accessToken) {
          // Mapeia os dados recebidos para um objeto de usuário
          const userData = {
            id: response.data.id,
            username: response.data.username,
            roles: response.data.tipos // ou outra nomenclatura que atenda à lógica de autorização
          };

          // Armazena os dados na store e no localStorage para manter o login
          authStore.setUser(userData);
          authStore.setToken(response.data.accessToken);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('accessToken', response.data.accessToken);

          // Redireciona para a rota Home
          router.push({ name: 'Home' });
        } else {
          errorMessage.value = 'Invalid login response';
        }
      } catch (error) {
        errorMessage.value = 'Invalid username or password';
      }
    };

    return { username, password, errorMessage, handleLogin };
  }
};
</script>

<style scoped>
/* Você pode ajustar os estilos conforme necessário */
</style>
