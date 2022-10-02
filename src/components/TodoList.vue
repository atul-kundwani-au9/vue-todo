<template>
  <div class="min-h-screen w-full flex justify-center font-sans bg-grey">
    <div class="w-full lg:w-2/4">
    <div class="bg-white rounded shadow-md p-6 m-4">
    <div class="mb-4">
    <p
    class="text-xl text-right text-red-600 link-logout"
    @click="logout"
    >
   Logout
  </p>
  <h1 class="mb-8 text-3xl text-center">Todo List</h1>
  <div class="flex mt-4">
 <input
  class="
  shadow
 appearance-none
  border
  rounded
  w-full
  py-2
  px-3
  mr-4
  text-grey-darker
  "
  v-model="title"
  placeholder="Add Todo"
  />

  <button
  class="
 flex-no-shrink
  p-2
  border-2
  rounded
   text-green-500
   border-green-500
   hover:text-white hover:bg-green-500
    "
   @click="addTodo"
   >
    Add
  </button>
    </div>
    </div>
    </div>

   <div class="bg-white p-6 m-4 overflow-y-auto" style="max-height: 70vh">
    <div v-for="row in todo_list" :key="row.id">
    <div class="flex mb-4 items-center">
    <p class="w-full text-grey-darkest">
    <strike v-if="row.data.completed"> {{ row.data.title }} </strike>
    <span v-else> {{ row.data.title }} </span>
    </p>
    <button
    class="
  flex-no-shrink
   p-2
   ml-4
   mr-2
  border-2
  rounded
  hover:text-white
  text-green-500
  border-green-500
  hover:bg-green-500
              "
    style="min-width: max-content"
    @click="
    updateTodoStatus(row.id, row.data.completed)
    row.data.completed = !row.data.completed
      "
      >
    {{ row.data.completed ? 'Not Done' : 'Done' }}
    </button>
    <button
    class="
    flex-no-shrink
    p-2
    ml-2
    border-2
   rounded
    text-red-500
   border-red-500
 hover:text-white hover:bg-red-500
              "
  @click="deleteTodo(row.id)"
            >
  Remove
  </button>
  </div>
<hr class="mb-4" />
  </div>
   </div>
    </div>
  </div>
</template>

<script>
import firbase from '../firebase'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

export default {
  name: 'TodoList',

  data() {
    return {
      title: '',
      todo_list: [],
      user: localStorage.getItem('user'),
    }
  },

  methods: {
    async loadTodoList() {
      this.$store.commit('SET_LOADING', true)
      const db = getFirestore(firbase)
      const citiesRef = collection(db, 'todo')
      const q = query(citiesRef, where('user', '==', this.user))
      const querySnapshot = await getDocs(q)

      const todo_list = []
      querySnapshot.forEach((doc) => {
        todo_list.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      this.todo_list = todo_list

      this.$store.commit('SET_LOADING', false)
    },

    async deleteTodo(id) {
      this.$store.commit('SET_LOADING', true)
      const db = getFirestore(firbase)
      await deleteDoc(doc(db, 'todo', id))
      this.todo_list = this.todo_list.filter((row) => row.id != id)
      this.$store.commit('SET_LOADING', false)
    },

    async addTodo() {
      this.$store.commit('SET_LOADING', true)

      const random_hash = (Math.random() + 1).toString(36).substring(7)
      const db = getFirestore(firbase)
      const todo = {
        title: this.title,
        completed: false,
        user: this.user,
      }

      await setDoc(doc(db, 'todo', random_hash), todo)

      this.todo_list.unshift({
        id: random_hash,
        data: {
          title: this.title,
          completed: false,
          user: this.user,
        },
      })

      this.title = ''

      this.$store.commit('SET_LOADING', false)
    },

    async updateTodoStatus(id, status) {
      this.$store.commit('SET_LOADING', true)

      const db = getFirestore(firbase)
      const docRef = doc(db, 'todo', id)

      await updateDoc(docRef, {
        completed: !status,
      })

      this.$store.commit('SET_LOADING', false)
    },

    logout() {
      this.$store.commit('SET_LOADING', true)
      localStorage.setItem('user', '')
      this.$router.push({ name: 'Auth' })
      this.$store.commit('SET_LOADING', false)
    },
  },

  created() {
    this.loadTodoList()
  },
}
</script>

<style>
.link-logout {
  text-decoration: underline;
  cursor: pointer;
}
</style>
