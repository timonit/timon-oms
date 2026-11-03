<script setup lang="ts">
import AppBtn from './app-btn.vue';
import AppModal from './app-modal.vue';
import CardMain from './card.main.vue';

type AppConfirmation = {
  title?: string;
  content?: string;
  okBtnText?: string;
  cancelBtnText?: string;
  showCancelBtn?: boolean;
  persistent?: boolean;
  closeAfterOk?: boolean;
  closeAfterCancel?: boolean;
};

const props = withDefaults(
  defineProps<AppConfirmation>(),
  {
    okBtnText: 'Применить',
    cancelBtnText: 'Отмена',
  }
);
const emit = defineEmits<{ (e: 'ok'): void; (e: 'cancel'): void; }>();
const show = defineModel<boolean>();

const okHandler = () => {
  emit('ok');
  if (props.closeAfterOk) show.value = false;
};

const cancelHandler = () => {
  emit('cancel');
  if (props.closeAfterCancel) show.value = false;
};
</script>

<template>
  <AppModal
    :persistent="props.persistent"
    v-model="show"
  >
    <CardMain class="bg-white">
      <template v-slot:prepend>
        <slot name="title">
          <h3 class="text-lg">
            {{ props.title }}
          </h3>
        </slot>
      </template>

      <slot>
        <span class="text-wrap">
          {{ props.content }}
        </span>
      </slot>

      <template v-slot:action>
        <AppBtn
          :text="props.okBtnText"
          @click="okHandler"
        />
        <AppBtn
          v-if="props.showCancelBtn"
          :text="props.cancelBtnText"
          color="secondary"
          @click="cancelHandler"
        />
      </template>
    </CardMain>
  </AppModal>
</template>
