<template>
  <v-container class="pa-0">
    <v-list class="col-12 px-3 d-flex">
      <v-btn
        fab
        small
        plain
        elevation="3"
        @click="professionAppendMenuOpen"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-list>
    <v-dialog
      v-model="onAppendProfessionState"
      eager
    >
      <v-card
        class="pa-4"
      >
        <v-form
          ref="form"
          v-model="isFormValid"
          lazy-validation
          class="d-flex flex-column"
        >
          <v-card-title class="pa-0">
            Enter profession title
          </v-card-title>
          <v-text-field
            v-model="additionalProfession.title"
            :rules="[rules.counter, rules.required, rules.professionExists]"
            autofocus
          />
          <v-card-title class="pa-0">
            Enter salary
          </v-card-title>
          <v-text-field
            v-model="additionalProfession.salary"
            :rules="[rules.required, rules.number]"
          />
          <v-card-title class="px-0">
            Enter profession responsibilities
          </v-card-title>
          <v-list>
            <v-list-item
              v-for="(responsibility, index) in responsibilities"
              :key="index"
              class="px-0"
            >
              <v-text-field
                :value="responsibility"
                :rules="[rules.counter, rules.required, rules.equalResponsibilities]"
                @input="updateRresponsibility($event, index)"
              />
            </v-list-item>
            <v-btn
              fab
              small
              plain
              elevation="3"
              @click="responsibilities.push('')"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-list>
          <v-btn
            fab
            small
            plain
            elevation="3"
            class="mx-auto"
            :disable="!isFormValid"
            @click="validate"
          >
            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
            SUBMIT
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>
    <v-list
      v-if="loaded"
      class="row ma-0 d-flex"
    >
      <v-list-item
        v-for="[index, profession] of professions"
        :key="index"
        class="col-3 pa-0 mb-6 px-3"
        @click="patchProfession(profession)"
      >
        <profession-card
          :profession="profession"
        />
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'

import { IProfession } from '~/models/profession'

import { ProfessionsModule } from '~/store/professions'
import { AppModule } from '~/store/app'

@Component
export default class PProfessions extends Vue {
  @Ref('form') readonly form: any;
  public get loaded () { return ProfessionsModule.loaded }
  public get professions () { return ProfessionsModule.professions }
  public isFormValid = false

  public onAppendProfessionState = false
  public responsibilitiesCount: number = 1
  public additionalProfession: IProfession = {
    title: '',
    salary: 0
  }

  public setDefaultAdditional () {
    this.additionalProfession = {
      title: '',
      salary: 0
    }
  }

  public patchProfession (profession: IProfession) {
    this.responsibilities = profession.responsibilities as Array<string>
    this.additionalProfession = profession
    this.professionAppendMenuOpen()
  }

  public responsibilities: Array<string> = ['']

  public updateRresponsibility (responsibility: string, index: number) {
    this.responsibilities.splice(index, 1, responsibility)
  }

  public rules = {
    required: (value: string) => !!value || 'Required.',
    counter: (value: string) => value.length >= 3 || 'Needs more 3 characters',
    // value - должен быть ссылкой на объект нужно будет переписать грамотнее
    professionExists: (value: string) =>
      !this.professions.has(value) || 'Profession allready exists',
    equalResponsibilities: (value: string) => {
      const count = this.responsibilities.filter(el => el === value)
      return !(count.length > 1) || 'This responsibility allready exists'
    },
    number: (value: number | string) => {
      // можно было сделать маску
      return /^(\d|)*$/.test(String(value)) || 'Salary must be a number'
    }
  }

  public professionAppendMenuOpen () {
    this.form.resetValidation()
    this.onAppendProfessionState = true
  }

  public professionAppendMenuClose () {
    this.onAppendProfessionState = false
  }

  public async validate () {
    this.form.validate()
    if (this.isFormValid) {
      await this.submit()
    }
  }

  public async submit () {
    const prof: IProfession = this.additionalProfession
    prof.responsibilities = this.responsibilities
    await ProfessionsModule.ADD_NEW_PROFESSION(prof)
    this.professionAppendMenuClose()
    this.setDefaultAdditional()
    this.responsibilities.splice(0, this.responsibilities.length)
    this.responsibilities.push('')
  }

  created () {
    AppModule.SET_TITLE('Professions')
  }
}
</script>
