<template>
  <div>
    <div class="modal d-block" :class="'modal-md'">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header px-4">
            <h5 class="modal-title">Регистрация</h5>
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
              <label for="nameInput" class="form-label">Имя</label>
              <input
                v-model="name"
                type="text"
                class="form-control"
                id="nameInput"
              />
            </div>
            <div class="mb-3">
              <label for="surnameInput" class="form-label">Фамилия</label>
              <input
                v-model="surname"
                type="text"
                class="form-control"
                id="surnameInput"
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
            <div class="mb-3">
              <label for="secondPasswordInput" class="form-label">Повтор пароля</label>
              <input
                v-model="secondPassword"
                type="password"
                class="form-control"
                id="secondPasswordInput"
                :class="{'is-invalid': secondPassword != password}"
              />
              <div class="invalid-feedback">
                Пароли не совпадают
              </div>
            </div>
          </div>
          <div class="modal-footer px-4">
            <button class="btn btn-primary c-pointer ms-2" @click="$router.push('/login')">
                Вход
            </button>
            <button :disabled="!canRegister" class="btn btn-primary c-pointer ms-2" @click="register">
                <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                ></span>
                Зарегистрироваться
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
  name: string | null;
  surname: string | null;
  password: string | null;
  secondPassword: string | null;
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
      password: null,
      secondPassword: null
    } as Data;
  },
  methods: {
    async register() {
      if (!this.canRegister) return;

      this.loading = true
      var response = await this.service.Register({
        emailAddress: this.emailAddress!,
        password: this.password!,
        name: this.name!,
        surname: this.surname!
      });
      this.loading = false

      if (response instanceof Error) return;

      var returnLink = this.$route.params.returnLink as string;

      this.$router.push(returnLink ?? '/');
    },
  },
  computed: {
    canRegister(): boolean {
      return !!this.emailAddress && !!this.password && !!this.name && !!this.surname && !!this.secondPassword && this.password == this.secondPassword;
    },
  },
  watch: {},
  async mounted() {},
});
</script>