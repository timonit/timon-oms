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
      class="modal-bg fixed left-0 top-0 w-dvw h-dvh overflow-auto bg-black/25 flex justify-center z-50"
      @click="clickOnBG"
    >
      <div
        class="my-auto"
        @click.stop
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
