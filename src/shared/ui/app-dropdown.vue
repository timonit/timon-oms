<script setup lang="ts" generic="T">
const props = defineProps<{ list: T[]; }>();
const emit = defineEmits<{ (e: 'pick', item: T): void; }>();
const model = defineModel<boolean>({ default: false });

const pick = (item: T) => {
  emit('pick', item);
  model.value = false;
};

</script>

<template>
  <div
    v-show="model"
    class="fixed w-full h-full z-10 top-0 left-0"
    @click="model = false"
  >
  </div>

  <div
    v-show="model"
    class="absolute dropdown-list left-0 bg-white w-full z-20"
  >
    <div
      v-for="(item, index) in props.list"
      :key="index"
      :value="item"
      @click="pick(item)"
      class="bg-white hover:bg-black/50 p-2 cursor-pointer"
    >
      {{ item }}
    </div>
  </div>
</template>

<style scoped>
.dropdown-list {
  top: calc(100% + 5px);
}
</style>
