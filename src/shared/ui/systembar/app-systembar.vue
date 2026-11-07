<script setup lang="ts">
import { ref } from 'vue';
import { useShiftStore } from '@/entities/shift';
import { closeShift } from '@/feature/close-shift';
import { useNotification } from '../nofications/use-notification';
import AppBtn from '../app-btn.vue';
import AppConfirmation from '../app-confirmation.vue';
import AppAlert from '../app-alert.vue';
import NavLink from './nav.link.vue';

const isMenuOpen = ref(false);
const isCloseShiftConfirmationOpen = ref(false);
const isCloseShiftErrorOpen = ref(false);
const closeShiftError = ref('');
const shiftStore = useShiftStore();
const notification = useNotification();

const closeCurrentShift = async () => {
  try {
    await closeShift();
    notification.notifySuccess('Смена закрыта');
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    closeShiftError.value = error.message;
    isCloseShiftErrorOpen.value = true;
  }
};
</script>

<template>
  <header class="relative p-4 bg-surface flex items-center justify-between">
    <div>
      <slot name="left-side" />
    </div>

    <nav class="flex items-center gap-4">
      <NavLink
        :to="{ name: 'Order' }"
        title="Главная"
      />

      <div class="relative">
        <AppBtn
          text="Меню"
          :aria-expanded="isMenuOpen"
          aria-haspopup="true"
          @click="isMenuOpen = !isMenuOpen"
          class="bg-info"
        />

        <div
          v-if="isMenuOpen"
          class="fixed inset-0 z-10"
          @click="isMenuOpen = false"
        />

        <div
          v-if="isMenuOpen"
          class="absolute right-0 top-[calc(100%+0.5rem)] z-20 flex min-w-max flex-col items-stretch gap-2 rounded-lg bg-surface-2 p-2 shadow-xl"
        >
          <NavLink
            :to="{ name: 'Orders' }"
            title="Все заказы"
            @click="isMenuOpen = false"
          />
          <NavLink
            :to="{ name: 'ProductsManager' }"
            title="Управление продуктами"
            @click="isMenuOpen = false"
          />
          <NavLink
            :to="{ name: 'Modifications' }"
            title="Модификации"
            @click="isMenuOpen = false"
          />
          <NavLink
            :to="{ name: 'ShiftReport' }"
            title="Отчёт о смене"
            @click="isMenuOpen = false"
          />
          <NavLink
            :to="{ name: 'Statistics' }"
            title="Статистика"
            @click="isMenuOpen = false"
          />
          <NavLink
            :to="{ name: 'Settings' }"
            title="Настройки"
            @click="isMenuOpen = false"
          />
          <AppBtn
            v-if="shiftStore.shift"
            text="Закрыть смену"
            color="warning"
            @click="isCloseShiftConfirmationOpen = true; isMenuOpen = false"
          />
        </div>
      </div>
    </nav>

    <AppConfirmation
      v-model="isCloseShiftConfirmationOpen"
      title="Закрытие смены"
      content="Вы уверены, что хотите закрыть смену?"
      ok-btn-text="Закрыть смену"
      show-cancel-btn
      close-after-cancel
      close-after-ok
      @ok="closeCurrentShift"
    />

    <AppConfirmation
      v-model="isCloseShiftErrorOpen"
      ok-btn-text="Скрыть"
      close-after-ok
    >
      <AppAlert
        :content="closeShiftError"
        class="bg-error text-white"
      />
    </AppConfirmation>
  </header>
</template>
