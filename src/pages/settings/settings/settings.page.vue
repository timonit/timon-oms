<script setup lang="ts">
import { ref } from 'vue';
import { useSettingsStore } from '@/shared/model/settings/settings.store';
import { AppBtn, AppToolbar, FlexCol } from '@/shared/ui';
import { FormCheckbox } from '@/shared/ui/form';
import { useNotification } from '@/shared/ui/nofications/use-notification';
import {
  exportBackupFile,
  exportProductsFile,
  importBackup,
  importProducts,
  parseBackupFile,
  parseProductsFile,
} from './data-transfer';

const settingsStore = useSettingsStore();
const notification = useNotification();
const productsFileInput = ref<HTMLInputElement>();
const backupFileInput = ref<HTMLInputElement>();

const actions = [
  {
    text: 'Сохранить',
    handler: () => {
      settingsStore.save();
      notification.notifySuccess('Настройки успешно сохранены');
    },
  }
];

const downloadJson = (filename: string, contents: string) => {
  const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

const exportProducts = () => {
  downloadJson('timon-oms-products.json', exportProductsFile());
  notification.notifySuccess('Экспорт продуктов завершён');
};

const exportBackup = async () => {
  try {
    downloadJson('timon-oms-backup.json', await exportBackupFile());
    notification.notifySuccess('Резервная копия приложения создана');
  } catch (error) {
    notification.notifyError(
      'Не удалось создать резервную копию',
      error instanceof Error ? error.message : String(error),
    );
  }
};

const importFile = async (event: Event, kind: 'products' | 'backup') => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;

  try {
    const contents = await file.text();
    if (kind === 'products') {
      const products = parseProductsFile(contents);
      if (!window.confirm(`Импорт заменит текущий список продуктов (${products.length} шт.). Продолжить?`)) return;
      await importProducts(products);
      notification.notifySuccess('Продукты успешно импортированы');
      return;
    }

    const data = parseBackupFile(contents);
    if (!window.confirm('Импорт заменит продукты, модификаторы, заказы и смены. Продолжить?')) return;
    await importBackup(data);
    notification.notifySuccess('Данные приложения успешно импортированы');
  } catch (error) {
    notification.notifyError(
      'Не удалось импортировать данные',
      error instanceof Error ? error.message : String(error),
    );
  }
};
</script>

<template>
  <FlexCol
    :gap="4"
    class="settings-page"
  >
    <AppToolbar :actions="actions" />

    <FlexCol :gap="4">
      <section class="p-4 bg-white flex flex-col gap-4 rounded-2xl">
        <h2 class="text-lg font-bold">Модификаторы</h2>

        <ul>
          <li>
            <FormCheckbox
              v-model="settingsStore.modifications.showPickModeAllModifications"
              label="В режиме выбора всегда показывать все модификаторы"
            />
          </li>
        </ul>
      </section>

      <section class="p-4 bg-white flex flex-col gap-4 rounded-2xl">
        <h2 class="text-lg font-bold">Продукты</h2>
        <p>Импорт заменит весь текущий список продуктов.</p>
        <div class="flex flex-wrap gap-4">
          <AppBtn
            text="Экспортировать продукты"
            @click="exportProducts"
          />
          <AppBtn
            text="Импортировать продукты"
            @click="productsFileInput?.click()"
          />
          <input
            ref="productsFileInput"
            type="file"
            accept="application/json,.json"
            class="hidden"
            @change="importFile($event, 'products')"
          />
        </div>
      </section>

      <section class="p-4 bg-white flex flex-col gap-4 rounded-2xl">
        <h2 class="text-lg font-bold">Резервная копия приложения</h2>
        <p>Копия включает продукты, модификаторы, заказы и смены. Импорт заменит соответствующие данные.</p>
        <div class="flex flex-wrap gap-4">
          <AppBtn
            text="Экспортировать все данные"
            @click="exportBackup"
          />
          <AppBtn
            text="Импортировать все данные"
            @click="backupFileInput?.click()"
          />
          <input
            ref="backupFileInput"
            type="file"
            accept="application/json,.json"
            class="hidden"
            @change="importFile($event, 'backup')"
          />
        </div>
      </section>
    </FlexCol>
  </FlexCol>
</template>

<style scoped>
li {
  margin-bottom: 1rem;
}
</style>
