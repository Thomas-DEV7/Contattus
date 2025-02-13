<!-- src/views/Home.vue -->
<template>
    <div>
      <!-- Componente de Menu -->
      <NavBar />
  
      <div class="container mt-3">
        <h2>Home - Contacts</h2>
  
        <!-- Mensagem de feedback -->
        <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']">
          {{ message }}
        </div>
  
        <!-- Tabela de listagem dos contatos -->
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tag</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Tipo Contato</th>
              <th>Privado</th>
              <th>Pessoa Nome</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contact in contacts" :key="contact.id">
              <td>{{ contact.id }}</td>
              <td>{{ contact.tag }}</td>
              <td>{{ contact.email }}</td>
              <td>{{ contact.telefone }}</td>
              <td>{{ contact.tipoContato }}</td>
              <td>{{ contact.privado ? 'Yes' : 'No' }}</td>
              <td>{{ contact.pessoa?.nome || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import NavBar from '../components/NavBar.vue';
  import apiClient from '../services/apiClient';
  import { useAuthStore } from '../store/auth';
  
  export default {
    name: 'Home',
    components: { NavBar },
    setup() {
      const contacts = ref([]);
      const message = ref('');
      const messageType = ref(''); // 'success' ou 'error'
      const authStore = useAuthStore();
  
      // Obtemos o pessoa_id a partir do usuário logado (ajuste conforme sua lógica)
      const pessoa_id = authStore.user ? authStore.user.id : null;
  
      /**
       * fetchContacts: Realiza a requisição GET para listar os contatos da pessoa.
       */
      const fetchContacts = async () => {
        if (!pessoa_id) {
          message.value = 'Pessoa ID is not available.';
          messageType.value = 'error';
          return;
        }
        try {
          const response = await apiClient.get(`/contato/listar/${pessoa_id}`);
          contacts.value = response.data;
        } catch (error) {
          message.value = 'Error fetching contacts';
          messageType.value = 'error';
          console.error('fetchContacts error:', error);
        }
      };
  
      // Ao montar a página, os contatos são buscados imediatamente.
      onMounted(() => {
        fetchContacts();
      });
  
      return { contacts, message, messageType };
    }
  };
  </script>
  
  <style scoped>
  /* Adapte os estilos conforme sua necessidade */
  </style>
  