<template>
  <div ref="modal" class="modal" :class="'modal-' + size">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header px-4">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body px-4">
          <slot></slot>
        </div>
        <div v-if="hasFooterSlot()" class="modal-footer px-4">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Modal from "bootstrap/js/dist/modal";
import { defineComponent } from "vue";

interface Data {
  myModal: Modal | null;
}

export default defineComponent({
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
  },
  watch: {
    showModal(newVal) {
      if (newVal) {
        this.myModal!.show();
      } else {
        this.myModal!.hide();
      }
    },
  },
  methods: {
    hasFooterSlot() {
      return !!this.$slots.footer;
    },
  },
  data() {
    return {
      myModal: null,
    } as Data;
  },
  mounted() {
    var modalElem = this.$refs.modal as HTMLDivElement;
    this.myModal = new Modal(modalElem);
    modalElem.addEventListener("hidden.bs.modal", () => {
      this.$emit("close");
    });

    modalElem.addEventListener("shown.bs.modal", () => {
      this.$emit("open");
    });
  },
});
</script>
<style lang="scss" scoped>
.modal {
  color: #fff;
}

.modal-title {
  color: #fff;
}

.modal-header,
.modal-content {
  border: none;
  background-color: #4f4752;
}

.modal-body {
  background-color: #10081b;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -8px 12px #00000029;
}
.modal-footer {
  border: none;
  background-color: #10081b;
}
</style>
