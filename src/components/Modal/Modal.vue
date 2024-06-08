<template>
  <div ref="modal" class="modal" :class="'modal-' + size">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">{{ title }}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="$emit('close')"></button>
              </div>
              <div class="modal-body">
                  <slot></slot>
              </div>
              <div v-if="hasFooterSlot()" class="modal-footer">
                  <slot name="footer"></slot>
              </div>
          </div>
      </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script lang="ts">
import { defineComponent } from 'vue'
import { Modal } from 'bootstrap'

interface Data {
  myModal: any | null
}

export default defineComponent({
  props: {
      showModal: {
          type: Boolean,
          default: false
      },
      title: {
          type: String,
          default: ""
      },
      size: {
          type: String,
          default: ""
      }
  },
  watch: {
      showModal(newVal) {
          if (newVal) {
              this.myModal!.show()
          }
          else {
              this.myModal!.hide()
          }
      }
  },
  methods: {
      hasFooterSlot() {
          return !!this.$slots.footer;
      }
  },
  data() {
      return {
          myModal: null
      } as Data
  },
  mounted() {
      this.myModal = new Modal(this.$refs.modal as HTMLDivElement);
      (this.$refs.modal as HTMLDivElement).addEventListener("hidden.bs.modal", () => {
          this.$emit('close')
      });

      (this.$refs.modal as HTMLDivElement).addEventListener("shown.bs.modal", () => {
          this.$emit('open')
      });
  }
})
</script>