import { isRef, ref, type Ref } from 'vue';

type TogglerControl = {
  state: Ref<boolean>;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
};

export function useToggler(): TogglerControl;
export function useToggler(initial: boolean): TogglerControl;
export function useToggler(vueRef: Ref<boolean>): TogglerControl;
export function useToggler(initialOrRef?: boolean | Ref<boolean>): TogglerControl {
  const state = !initialOrRef ? ref(false) : isRef(initialOrRef) ? initialOrRef : ref(initialOrRef);

  const enable = () => (state.value = true);
  const disable = () => (state.value = false);
  const toggle = () => {
    if (state.value === true) disable();
    else enable();
  };

  return {
    state,
    enable,
    disable,
    toggle,
  };
}
