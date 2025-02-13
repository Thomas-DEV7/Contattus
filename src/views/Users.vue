<!-- src/views/Users.vue -->
<template>
    <div>
      <!-- Componente de Menu -->
      <NavBar />
  
      <div class="container mt-3">
        <h2>Users</h2>
  
        <!-- Seção de Pesquisa e Ação -->
        <div class="row mb-3">
          <div class="col-md-6">
            <input
              type="text"
              v-model="searchQuery"
              @input="fetchUsers"
              class="form-control"
              placeholder="Search users"
            />
          </div>
          <div class="col-md-6 text-end">
            <button class="btn btn-success" @click="openAddForm">
              Add User
            </button>
          </div>
        </div>
  
        <!-- Mensagens de Confirmação/Erro -->
        <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']">
          {{ message }}
        </div>
  
        <!-- Tabela de Listagem -->
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.type }}</td>
              <td>
                <button class="btn btn-sm btn-primary me-2" @click="openEditForm(user)">
                  Edit
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- Formulário para Inclusão/Alteração -->
        <div v-if="showForm" class="card mt-4">
          <div class="card-header">
            <h3>{{ formTitle }}</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  v-model="userForm.username"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="userForm.email"
                  class="form-control"
                  required
                />
              </div>
              <!-- O campo de senha é exibido apenas na inclusão -->
              <div class="mb-3" v-if="!editing">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  v-model="userForm.password"
                  class="form-control"
                  required
                  minlength="8"
                />
              </div>
              <div class="mb-3">
                <label for="type" class="form-label">User Type</label>
                <select id="type" v-model="userForm.type" class="form-select" required>
                  <option value="" disabled>Select user type</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary me-2">Save</button>
              <button type="button" class="btn btn-secondary" @click="cancelForm">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { ref, onMounted, computed } from 'vue'
  import NavBar from '../components/NavBar.vue'
  
  export default {
    name: 'Users',
    components: { NavBar },
    setup() {
      // Estado reativo para listagem e pesquisa
      const users = ref([])
      const searchQuery = ref('')
      const message = ref('')
      const messageType = ref('') // 'success' ou 'error'
  
      // Controle do formulário
      const showForm = ref(false)
      const editing = ref(false)
      const userForm = ref({
        id: null,
        username: '',
        email: '',
        password: '',
        type: ''
      })
  
      // Título dinâmico do formulário
      const formTitle = computed(() => (editing.value ? 'Edit User' : 'Add User'))
  
      /**
       * Busca os usuários na API com opção de filtro.
       */
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            `https://demometaway.vps-kinghost.net:8485/api/users?search=${searchQuery.value}`
          )
          users.value = response.data
        } catch (error) {
          message.value = 'Error fetching users'
          messageType.value = 'error'
        }
      }
  
      /**
       * Abre o formulário para inclusão.
       */
      const openAddForm = () => {
        resetForm()
        editing.value = false
        showForm.value = true
      }
  
      /**
       * Abre o formulário para edição, preenchendo com os dados do usuário.
       * @param {Object} user - Usuário a ser editado.
       */
      const openEditForm = (user) => {
        editing.value = true
        showForm.value = true
        // Na edição, a senha não é obrigatória; portanto, limpe o campo
        userForm.value = { ...user, password: '' }
      }
  
      /**
       * Reseta os campos do formulário.
       */
      const resetForm = () => {
        userForm.value = {
          id: null,
          username: '',
          email: '',
          password: '',
          type: ''
        }
      }
  
      /**
       * Salva o usuário: inclui ou atualiza conforme o modo de edição.
       */
      const saveUser = async () => {
        try {
          if (editing.value) {
            // Atualização: não envia o campo senha se estiver em branco
            const updatedUser = { ...userForm.value }
            if (updatedUser.password === '') {
              delete updatedUser.password
            }
            await axios.put(
              `https://demometaway.vps-kinghost.net:8485/api/users/${userForm.value.id}`,
              updatedUser
            )
            message.value = 'User updated successfully'
          } else {
            // Inclusão
            await axios.post(`https://demometaway.vps-kinghost.net:8485/api/users`, userForm.value)
            message.value = 'User added successfully'
          }
          messageType.value = 'success'
          showForm.value = false
          fetchUsers()
        } catch (error) {
          message.value = 'Error saving user'
          messageType.value = 'error'
        }
      }
  
      /**
       * Cancela a operação e reseta o formulário.
       */
      const cancelForm = () => {
        showForm.value = false
        resetForm()
      }
  
      /**
       * Exclui um usuário, após confirmação.
       * @param {Number} id - Identificador do usuário.
       */
      const deleteUser = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
          try {
            await axios.delete(`https://demometaway.vps-kinghost.net:8485/api/users/${id}`)
            message.value = 'User deleted successfully'
            messageType.value = 'success'
            fetchUsers()
          } catch (error) {
            message.value = 'Error deleting user'
            messageType.value = 'error'
          }
        }
      }
  
      onMounted(() => {
        fetchUsers()
      })
  
      return {
        users,
        searchQuery,
        message,
        messageType,
        showForm,
        editing,
        userForm,
        formTitle,
        fetchUsers,
        openAddForm,
        openEditForm,
        saveUser,
        cancelForm,
        deleteUser
      }
    }
  }
  </script>
  
  <style scoped>
  /* Adicione estilos personalizados, se necessário */
  </style>
  