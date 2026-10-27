<script setup lang="ts">
import { useModificationStore } from '@/entities/modification';
import { useProductStore } from '@/entities/product';
import { AppBtn, CardMain, FlexCol } from '@/shared/ui';
import { FormField } from '@/shared/ui/form';
import { computed, provide, reactive } from 'vue';
import { MODIFICATION_LIST_KEY, ModificationListService } from './modification.list-service';
import ModificationListItem from './modification.list-item.vue';
import type { Modification } from '@/shared/model/modification/modification.ts';
import type { OrderPosition } from '@/shared/model/order/order-position.ts';

type ModificationListProps = {
  position: OrderPosition;
  withCloseBtn?: boolean;
};

const props = defineProps<ModificationListProps>();
const emit = defineEmits<{ (e: 'pick', modification: Modification): void; (e: 'close'): void; }>();
const selected = defineModel<string[]>({ default: () => [] });

const productStore = useProductStore();
const modificationStore = useModificationStore();
const product = productStore.getProductByName(props.position.name);
if (!product) throw new Error('Product not found');

const modificationListService = new ModificationListService(product, selected);
provide(MODIFICATION_LIST_KEY, modificationListService);

const modificationForm = reactive({
  name: '',
  price: 0
});

async function addModification(dto: { name: string, price: number; }) {
  const modification = {
    id: crypto.randomUUID(),
    ...dto,
  };

  await modificationStore.add(modification);

  modificationForm.name = '';
  modificationForm.price = 0;
}

const title = computed(() => {
  switch (modificationListService.mode.value) {
    case 'add': return 'add mode';
    case 'delete': return 'delete mode';
    case 'attach': return 'attach mode';
    case 'pick': return 'pick mode';
    default: return '';
  }
});
</script>

<template>
  <CardMain class="bg-surface shadow-lg">
    <template
      v-if="props.withCloseBtn"
      v-slot:prepend
    >
      <div class="flex justify-end">
        <AppBtn
          text="close"
          @click="emit('close')"
        />
      </div>
    </template>

    <FlexCol :gap="8">
      <span class="text-center text-lg font-bold">{{ title }}</span>
      <FlexCol>
        <FlexCol
          v-if="modificationListService.mode.value !== 'add'"
          :gap="2"
        >
          <ModificationListItem
            v-for="modification of modificationListService.modifications.value"
            :key="modification.id"
            :modification="modification"
          />
        </FlexCol>

        <form
          v-if="modificationListService.mode.value === 'add'"
          @submit.prevent="addModification(modificationForm)"
          class="my-4 flex flex-col gap-4"
        >
          <FormField
            name="name"
            placeholder="name"
            v-model="modificationForm.name"
          />
          <FormField
            name="price"
            placeholder="price"
            v-model="modificationForm.price"
          />
          <AppBtn
            type="submit"
            text="add"
          />
        </form>
      </FlexCol>

    </FlexCol>

    <template v-slot:action>

      <div class="flex gap-2">
        <AppBtn
          text="pick mode"
          @click="modificationListService.mode.value = 'pick'"
        />
        <AppBtn
          text="attach mode"
          @click="modificationListService.mode.value = 'attach'"
        />
        <AppBtn
          text="add mode"
          @click="modificationListService.mode.value = 'add'"
        />
        <AppBtn
          text="delete mode"
          @click="modificationListService.mode.value = 'delete'"
        />
      </div>

    </template>
  </CardMain>
</template>
