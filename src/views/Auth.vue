<template>
  <div class="auth">
    <div class="bg-grey min-h-screen flex flex-col">
      <div
        class="
          container
          max-w-sm
          mx-auto
          flex-1 flex flex-col
          items-center
          justify-center
          px-2
        "
      >
        <div class="bg-white px-6 py-8 rounded shadow-xl w-full">
          <h1 class="mb-8 text-3xl text-center">My Todo</h1>

          <input
            type="email"
            class="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email"
            v-model="email"
          />

          <input
            type="password"
            class="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password"
            v-model="password"
          />

          <button
            type="submit"
            class="
              w-full
              text-center
              py-3
              rounded
              bg-green-600
              text-white
              hover:bg-green-800
              focus:outline-none
              my-1
            "
            @click="on_submit"
          >
            {{ auth_label }}
          </button>

          <button
            class="text-grey-dark mt-6"
            @click="registration = !registration"
          >
            {{ other_action }}
          </button>

          <span class="text-red-400"> {{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
} from "firebase/auth";

export default {
  data() {
    return {
      registration: false,
      email: null,
      password: null,
      error: "",
    };
  },

  computed: {
    auth_label() {
      return this.registration ? "Sign Up" : "Log In";
    },
    other_action() {
      if (this.registration) return "Already have an account? Log in.";

      return "Don't have an account? Create Now.";
    },
  },

  methods: {
    on_submit() {
      if (!this.email || !this.password) {
        alert("Please Give Email and Password.");
        return;
      }
      if (this.registration) this.register();
      else this.login();
    },

    register() {
      this.error = "";
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {})
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          this.error = errorCode;
        });
    },

    login() {
      this.error = "";

      const auth = getAuth();
      setPersistence(auth, inMemoryPersistence)
        .then(() => {
          return signInWithEmailAndPassword(auth, this.email, this.password)
            .then(() => {
              // Signed in
              localStorage.setItem("user", auth.currentUser.uid);
              this.$router.push({ name: "Home" });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
              this.error = errorCode;
            });
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    },
  },

  created() {
    let session_id = localStorage.getItem("user");
    if (session_id) {
      this.$router.push({ name: "Home" });
    }
  },
};
</script>

<style>
.bg-grey {
  background-color: #eee;
}
</style>
