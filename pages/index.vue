<template>
  <v-container class="pa-0">
    <v-list class="col-12 px-3 d-flex">
      <v-btn
        fab
        small
        plain
        elevation="3"
        @click="timelineFormOpen"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-list>
    <v-list>
      <v-card
        v-for="(post, key) in timeline"
        :key="key"
        :class="{'mt-4': key > 0 }"
        @click="editPost(post)"
      >
        <v-card-title>
          {{ post.title }}
        </v-card-title>
        <v-card-text>
          {{ post.body }}
        </v-card-text>
      </v-card>
      <v-dialog
        v-model="addPostState"
      >
        <v-card
          class="pa-4"
        >
          <v-form
            class="d-flex flex-column"
            @submit.prevent="submit"
          >
            <v-card-title class="pa-0">
              Enter post title
            </v-card-title>
            <v-text-field
              v-model="additionalPost.title"
              :rules="[rules.counter, rules.required]"
              autofocus
            />
            <v-textarea
              v-model="additionalPost.body"
              :rules="[rules.counter, rules.required]"
            />
            <v-btn
              fab
              small
              plain
              elevation="3"
              type="submit"
              class="mx-auto"
            >
              <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
              SUBMIT
            </v-btn>
          </v-form>
        </v-card>
      </v-dialog>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ITimeline } from '~/models/timeline'

import { TimelineModule } from '~/store/timeline'
import { AppModule } from '~/store/app'

@Component({
  async fetch () {
    await TimelineModule.INIT()
  }
})
export default class PIndex extends Vue {
  public get timeline () { return TimelineModule.timeline }
  public addPostState = false
  public additionalPost: ITimeline = { title: '', body: '' }

  public clearAdditionalPost () {
    this.additionalPost = {
      title: '',
      body: ''
    }
  }

  public async submit () {
    if (this.additionalPost.id) {
      await TimelineModule.PATCH_TIMELINE(this.additionalPost)
    } else {
      await TimelineModule.putTimeline(this.additionalPost)
    }
    this.timelineFormClose()
    this.clearAdditionalPost()
  }

  public rules = {
    required: (value: string) => !!value || 'Required.',
    counter: (value: string) => value.length >= 3 || 'Needs more 3 characters'
  }

  public timelineFormOpen () {
    this.addPostState = true
  }

  public timelineFormClose () {
    this.addPostState = false
  }

  public editPost (post: ITimeline) {
    this.clearAdditionalPost()
    this.additionalPost = post
    this.timelineFormOpen()
  }

  created () {
    AppModule.SET_TITLE('My Timline')
  }
}
</script>
