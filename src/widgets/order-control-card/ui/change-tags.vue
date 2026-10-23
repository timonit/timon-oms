<script setup lang="ts">
import { AppBtn, CardMain } from '@/shared/ui';

</script>

<template>
  <CardMain class="bg-surface shadow-lg">
    <template v-slot:prepend>
      <h4 class="text-2xl font-bold text-center">Tags</h4>
    </template>

    <div class="flex flex-col gap-4">


      <AppBtn text="add tag" />
    </div>
  </CardMain>
</template>
