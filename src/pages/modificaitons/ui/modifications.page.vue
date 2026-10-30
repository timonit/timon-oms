<script setup lang="ts">
import { useModificationStore } from '@/entities/modification';
import ModificationCard from './modification.card.vue';
import { AppCollapse, AppToolbar, FlexCol } from '@/shared/ui';
import ModificationForm from './modification.form.vue';

const modificationStore = useModificationStore();

const actions = [
  {
    text: 'save',
    handler: () => {
      modificationStore.setModifications(modificationStore.modifications);
    },
  }
];
</script>

<template>
  <FlexCol
    :gap="8"
    class="p-4"
  >
    <AppToolbar :actions="actions" />

    <AppCollapse
      title="Добавить модификацию"
      color="info"
    >
      <ModificationForm />
    </AppCollapse>

    <div class="gap-4 grid">
      <ModificationCard
        v-for="(modification, index) in modificationStore.modifications"
        :key="modification.id"
        v-model="modificationStore.modifications[index]!"
      />
    </div>
  </FlexCol>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fit, 350px);
}
</style>
