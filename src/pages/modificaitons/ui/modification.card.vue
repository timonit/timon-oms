<script setup lang="ts">
import { useModificationStore } from '@/entities/modification';
import type { Modification } from '@/shared/model/modification';
import { AppBtn, CardMain } from '@/shared/ui';
import FlexCol from '@/shared/ui/flex.col.vue';
import { FormField } from '@/shared/ui/form';

const modification = defineModel<Modification>({ required: true });
const modificationStore = useModificationStore();

const deleteModification = (modification: Modification) => {
  modificationStore.delete(modification.id);
};
</script>

<template>
  <CardMain class="bg-info">
    <FlexCol :gap="4">
      <span class="text-xs">
        {{ modification.id }}
      </span>
      <FormField v-model="modification.name" />
      <FormField v-model="modification.price" />
      <FormField v-model="modification.description" />
    </FlexCol>

    <template v-slot:action>
      <AppBtn
        text="Удалить"
        color="error"
        @click="deleteModification(modification)"
      />
    </template>
  </CardMain>
</template>
