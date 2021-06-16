<template>
  <v-card
    v-if="person"
    class="ma-1 pa-3"
  >
    <div class="row ma-0">
      <nuxt-link :to="`/employees/${person.id}`">
        <v-avatar size="40">
          <v-img :src="person.picture.thumbnail" />
        </v-avatar>
      </nuxt-link>
      <v-spacer />
      <v-btn
        v-show="editable"
        plain
        fab
        small
        depressed
        @click="$emit('remove', person.id)"
      >
        <v-icon>mdi-account-remove</v-icon>
      </v-btn>
    </div>
    <v-row class="ma-0 align-center">
      <nuxt-link :to="`/employees/${person.id}`">
        <v-card-title v-if="!fullnameEditor">
          {{ fullName }}
        </v-card-title>
      </nuxt-link>
      <v-text-field
        v-if="fullnameEditor"
        v-model="fullNameCopy"
        :rules="[rules.fullName, rules.required]"
        @blur="closeNameEditorOnValidate()"
        @keydown="onKeyDown($event)"
      />
      <v-btn
        v-show="editable"
        plain
        fab
        x-small
        depressed
        @click="fullnameEditor = true"
      >
        <v-icon>
          mdi-pencil
        </v-icon>
      </v-btn>
    </v-row>
    <v-card-text>
      {{ `My birthday: ${formatDate(picker)}` }}
      <v-menu
        v-model="datePickerMenu"
        bottom
        offset-y
        :close-on-content-click="false"
        :close-on-click="false"
      >
        <template
          #activator="{ on, attrs }"
        >
          <v-btn
            v-show="editable"
            plain
            fab
            x-small
            depressed
            v-bind="attrs"
            v-on="{ ...on }"
          >
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-date-picker
            v-model="picker"
            @change="updatePersonBirthday($event)"
          />
        </v-card>
      </v-menu>
    </v-card-text>
    <slot />
  </v-card>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CEmployeeCard extends Vue {
  // Не знаю как грамотно пробросить свойство, если тип его неизвестен
  // В данном контексте известно что это тип IEmloyee, но если необходимо будет
  // отправить данные базирующиеся на интерфейсе IEmployee - придётся добавлять сюда модели
  @Prop({ type: Object }) public person!: any;
  @Prop({ type: Boolean, default: true }) public editable!: boolean;

  public formatDate (str: string) {
    return new Date(str)
      .toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  public updatePersonBirthday (value: string) {
    this.person.birthday = value
    this.closeDatePicker()
    this.$emit('update', this.person)
  }

  public closeDatePicker () {
    this.datePickerMenu = false
  }

  public openFullNameEditor () {
    this.fullnameEditor = true
  }

  public closeFullNameEditor () {
    this.fullnameEditor = false
  }

  public rules = {
    required: (value: string) => !!value || 'Required.',
    counter: (value: string) => value.length <= 40 || 'Max 40 characters',
    fullName: (value: string) => {
      const _fullNameRegexp = /^(\p{L}|['-]{0,1})* (\p{L}|['-]{0,1})*$/ui
      const test = _fullNameRegexp.test(value)
      return test
    }
  }

  public closeNameEditorOnValidate () {
    if (this.rules.fullName(this.fullNameCopy)) {
      this.fullName = this.fullNameCopy

      const name = this.fullName.split(' ')[0]
      const surname = this.fullName.split(' ')[1]

      this.person.name = name
      this.person.surname = surname

      this.$emit('update', this.person)
      this.closeFullNameEditor()
    }
  }

  public onKeyDown (event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
        this.closeNameEditorOnValidate()
        break
      case 'Escape':
        this.closeFullNameEditor()
    }
  }

  public datePickerMenu: boolean = false
  public picker: string = ''

  public fullName: string = ''
  public fullNameCopy: string = ''
  public fullnameEditor = false

  mounted () {
    this.picker = new Date(this.person.birthday).toISOString().substr(0, 10)
    this.fullName = this.fullNameCopy = `${this.person.name} ${this.person.surname}`
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-avatar {
  @extend %border-left-radius-custom;
}
</style>
