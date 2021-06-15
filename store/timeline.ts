import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'

import { store } from '~/store/index'
import { ITimeline } from '~/models/timeline'
import {
  getTimeline,
  putTimeline,
  patchTimeline
} from '~/middleware/timeline'

@Module({
  dynamic: true,
  store,
  name: 'Timeline',
  namespaced: true
})
class Timeline extends VuexModule {
  public timeline: Array<ITimeline> = []
  public loaded = false
  public count = 0

  @Mutation
  async INIT () {
    if (this.loaded) { return }
    const response = await getTimeline()
    const TimelineItems: Array<ITimeline> = response.data
    this.timeline.push(...TimelineItems)
    this.loaded = true
  }

  @Mutation
  ADD_ITEM (timelineItem: ITimeline) {
    this.timeline.push(timelineItem)
  }

  @Mutation
  async PATCH_TIMELINE (timelineItem: ITimeline) {
    const response = await patchTimeline(timelineItem)
    const result: ITimeline = response.data
    const indexITimeline = this.timeline.findIndex(el => el.id === result.id)
    this.timeline.splice(indexITimeline, 1, result)
  }

  @Action
  async putTimeline (item: ITimeline) {
    const changingTimelineItem = item
    const response = await putTimeline(changingTimelineItem)
    const timelineItem: ITimeline = response.data
    this.ADD_ITEM(timelineItem)
  }
}

export const TimelineModule = getModule(Timeline)
