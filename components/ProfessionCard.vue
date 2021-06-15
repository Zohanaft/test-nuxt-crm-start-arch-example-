<template>
  <v-card>
    <v-card-title>
      {{ profession.title }}
    </v-card-title>
    <v-list>
      <v-list-item
        v-for="(responsibility, index) of profession.responsibilities"
        :key="index"
        class="py-0 my-0"
      >
        {{ responsibility }}
      </v-list-item>
    </v-list>
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
