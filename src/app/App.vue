<script setup lang="ts">
import { AppStatus, isStatus, LoadingStatus, NostartedStatus, OMSApp, StartedStatus } from '@/shared/app';
import { APP_INJECT_KEY } from '@/shared/app/app.inject-key';
import { provide, ref, watch } from 'vue';

const app = new OMSApp();
const status = ref<AppStatus>(app.status);

app.addEventListener('changeStatus', () => {
  status.value = app.status;
});
watch(() => app.status, (s) => console.log('s', s.name), { immediate: true });

app.init();
provide(APP_INJECT_KEY, app);
</script>

<template>
  <div>
    <router-view v-slot="{ Component }">
      <div
        v-if="isStatus(status, new LoadingStatus())"
        class="animate-bounce w-full mt-6 text-2xl text-center text-white"
      >loading...</div>

      <div
        v-if="isStatus(status, new NostartedStatus())"
        class="w-full mt-6 text-2xl text-center text-white"
      >App no started</div>

      <component
        v-if="isStatus(status, new StartedStatus())"
        :is="Component"
      />
    </router-view>
  </div>
</template>
