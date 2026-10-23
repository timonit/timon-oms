import type { InjectionKey } from 'vue';
import type { OMSApp } from './oms-app';

export const APP_INJECT_KEY = Symbol() as InjectionKey<OMSApp>;
