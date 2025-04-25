<template>
  <div>
    <div class="modal d-block" :class="'modal-md'">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header px-4">
            <h5 class="modal-title">Авторизация</h5>
          </div>
          <div class="modal-body px-4">
            <div class="mb-3">
              <label for="emailAddressInput" class="form-label">Email</label>
              <input
                v-model="emailAddress"
                type="text"
                class="form-control"
                id="emailAddressInput"
              />
            </div>
            <div class="mb-3">
              <label for="passwordInput" class="form-label">Пароль</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                id="passwordInput"
              />
            </div>
          </div>
          <div class="modal-footer px-4">
            <button class="btn btn-primary c-pointer ms-2" @click="$router.push('/register')">
                Регистрация
            </button>
            <button :disabled="!canLogin" class="btn btn-primary c-pointer ms-2" @click="login">
                <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                ></span>
                Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AuthService from "../../services/auth/auth-service";

interface Data {
  emailAddress: string | null;
  password: string | null;
  loading: boolean;
  service: AuthService;
}

export default defineComponent({
  components: {},
  data() {
    return {
      loading: false,
      service: new AuthService(),
      emailAddress: null,
      password: null
    } as Data;
  },
  methods: {
    async login() {
      if (!this.canLogin) return;

      this.loading = true
      var response = await this.service.Login({
        emailAddress: this.emailAddress!,
        password: this.password!,
      });
      this.loading = false

      if (response instanceof Error) return;

      var returnLink = this.$route.params.returnLink as string;

      this.$router.push(returnLink ?? '/');
    },
  },
  computed: {
    canLogin(): boolean {
      return !!this.emailAddress && !!this.password;
    },
  },
  watch: {},
  async mounted() {},
});
</script>