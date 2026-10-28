<script setup lang="ts">
import { openShift } from '@/feature/open-shift';
import { AppBtn, CardMain, FlexCol } from '@/shared/ui';
import { FormField } from '@/shared/ui/form';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');

const openNewShift = async () => {
  await openShift({ personID: name.value });
  router.push({ name: 'Home' });
};
</script>

<template>
  <div class="flex justify-center">
    <form
      @submit.prevent="openNewShift"
      class="w-85"
    >
      <CardMain class="bg-info">
        <FlexCol :gap="4">
          <FormField
            v-model="name"
            placeholder="имя"
          />
          <AppBtn
            text="Открыть смену"
            type="submit"
          />
        </FlexCol>
      </CardMain>
    </form>
  </div>
</template>
