<template>
  <v-card class="d-flex flex-column mx-3">
    <v-card-title>
      {{ profession.title }}
    </v-card-title>
    <v-chip
      v-for="(responsibility, index) of profession.responsibilities"
      :key="index"
      color="primary"
      class="py-0 mt-0 ma-3"
    >
      {{ responsibility }}
    </v-chip>
    <v-alert
      dense
      text
      class="mx-3 mt-auto"
      type="success"
    >
      {{ `salary: ${profession.salary}` }}
    </v-alert>
  </v-card>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CProfessionCard extends Vue {
  // Не знаю как грамотно пробросить свойство, если тип его неизвестен
  // В данном контексте известно что это тип IProfession, но если необходимо будет
  // отправить данные базирующиеся на интерфейсе IEmployee - придётся добавлять сюда модели
  @Prop({ type: Object }) public profession!: any
}
</script>

<style lang="scss" scoped>
.v-card {
  width: 100%;
  height: 100%;
}
</style>
