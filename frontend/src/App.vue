<template>
  <AppShell>
    <router-view />
  </AppShell>
  <BaseToast />
</template>

<script setup lang="ts">
import AppShell from '@/components/AppShell.vue'
import BaseToast from '@/components/base/BaseToast.vue'
</script>
