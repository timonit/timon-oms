<script setup lang="ts">
import { useModificationStore } from '@/entities/modification';
import { useOrderStore } from '@/entities/order';
import { useProductStore } from '@/entities/product';
import { useShiftStore } from '@/entities/shift';
import { AppStatus, isStatus, LoadingStatus, NostartedStatus, OMSApp, StartedStatus } from '@/shared/app';
import { APP_INJECT_KEY } from '@/shared/app/app.inject-key';
import { DefaultLayout } from '@/shared/ui/layouts';
import { AppSystembar } from '@/shared/ui/systembar';
import { ShiftPanel } from '@/widgets/shift-panel';
import { provide, ref } from 'vue';

const shiftStore = useShiftStore();
const modificationStore = useModificationStore();
const productStore = useProductStore();
const orderStore = useOrderStore();

const app = new OMSApp();
const status = ref<AppStatus>(app.status);

app.addEventListener('changeStatus', () => {
  status.value = app.status;
});

app.init([shiftStore, modificationStore, productStore, orderStore]);
provide(APP_INJECT_KEY, app);
</script>

<template>
  <div>
    <DefaultLayout>
      <template
        v-if="isStatus(status, new StartedStatus())"
        v-slot:top-panel
      >
        <AppSystembar>
          <template v-slot:left-side>
            <shift-panel />
          </template>
        </AppSystembar>
      </template>

      <router-view v-slot="{ Component }">
        <div
          v-if="isStatus(status, new LoadingStatus())"
          class="animate-bounce w-full mt-6 text-2xl text-center text-white"
        >
          loading...
        </div>

        <div
          v-if="isStatus(status, new NostartedStatus())"
          class="w-full mt-6 text-2xl text-center text-white"
        >
          App no started
        </div>

        <component
          v-if="isStatus(status, new StartedStatus())"
          :is="Component"
        />
      </router-view>
    </DefaultLayout>
  </div>
</template>
