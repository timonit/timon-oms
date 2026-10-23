<script setup lang="ts">
import { Teleport } from 'vue';
import { useToggler } from '../composables';

type AppModalProps = {
  persistent?: boolean;
};

const props = defineProps<AppModalProps>();
const model = defineModel({ default: false });
const { disable, enable } = useToggler(model);

const clickOnBG = () => {
  if (props.persistent) return;
  disable();
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="model"
      class="modal-bg fixed left-0 top-0 w-dvw h-dvh bg-black/25"
      @click="clickOnBG"
    >
      <div
        class="absolute top-1/2 left-1/2"
        @click.stop
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
