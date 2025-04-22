import { reactive } from "vue";

export const toastStore = reactive({
  errors: [] as String[]
})

export function raiseError(error: string) {
  toastStore.errors.push(error);
}