<script setup lang="ts">
import { useSettingsStore } from '@/shared/model/settings/settings.store';
import { AppToolbar } from '@/shared/ui';
import { FormCheckbox } from '@/shared/ui/form';
import { useNotification } from '@/shared/ui/nofications/use-notification';

const settingsStore = useSettingsStore();
const notification = useNotification();

const actions = [
  {
    text: 'Сохранить',
    handler: () => {
      settingsStore.save();
      notification.notifySuccess('Настройки успешно сохранены');
    },
  }
];
</script>

<template>
  <div>
    <AppToolbar
      :actions="actions"
      class="mb-4"
    />
    <section class="p-4 bg-white flex flex-col gap-4 rounded-2xl">
      <h2 class="text-lg font-bold">Modifications</h2>

      <ul>
        <li>
          <FormCheckbox
            v-model="settingsStore.modifications.showPickModeAllModifications"
            label="В режиме выбора всегда показывать все модификаторы"
          />
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
li {
  margin-bottom: 1rem;
}
</style>
