<template>
  <v-app dark>
    <v-navigation-drawer
      expand-on-hover
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          router
          exact
          :to="item.to"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      fixed
      flat
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-col
        cols="12"
        class="d-flex"
      >
        <nuxt v-if="loaded" />
      </v-col>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'

import { AppModule } from '~/store/app'
import { ProfessionsModule } from '~/store/professions'

@Component({
  // Важно загрузить данные по профессиям до работы с приложением
  // (как сделать иначе - не придумал)
  async fetch () {
    await ProfessionsModule.INIT()
  }
})
export default class LDefault extends Vue {
  // UI
  drawer = true;
  fixed = false;
  items = [
    {
      icon: 'mdi-apps',
      title: 'Dashboard',
      to: '/'
    },
    {
      icon: 'mdi-account-multiple',
      title: 'Employees',
      to: '/employees'
    },
    {
      icon: 'mdi-calendar-check',
      title: 'professions',
      to: '/professions'
    }
  ];

  miniVariant = true;
  right = true;
  rightDrawer = false;

  public get title () { return AppModule.title }
  public get loaded () { return ProfessionsModule.loaded }

  // Store data
}

</script>
