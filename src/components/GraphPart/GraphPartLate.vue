<template>
    <div class="d-flex flex-row align-items-end">
      <GraphPart 
        v-if="taskInFound && getDuration(taskInFound) < (b-a)"
        :a="a"
        :b="b - getDuration(taskInFound)"
          :resourceKindId="resourceKindId"
        :processedTaskIds="processedTaskIds"
      />
      <div class="d-flex align-items-end flex-column">
        <GraphPart 
          v-if="taskInFound"
          :a="b - getDuration(taskInFound)"
          :b="b"
          :resourceKindId="resourceKindId"
          :processedTaskIds="newProcessedTaskIds"
        />
        <div :title="taskInFound.name" class="d-flex align-items-center justify-content-center c-pointer" v-if="taskInFound && getPower(taskInFound)" :style="`height: ${getPower(taskInFound) * 15}px; width: ${getDuration(taskInFound) * 20}px; border: 1px solid black;`">{{ taskInFound.id }}</div>
      </div>
    </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import storage from "../../store/index";
import { CalculatedTask } from "../../store/dto/task";

export default defineComponent({
  name: "GraphPart",
  props: {
    a: {
      type: Number,
      required: true
    },
    b: {
      type: Number,
      required: true
    },
    resourceKindId: {
      type: Number,
      default: null
    },
    processedTaskIds: {
      type: Object as PropType<number[]>,
      required: true
    }
  },
  data() {
    return {
      storage: storage.getInstance(),
    };
  },
  methods: {
    getPower(task: CalculatedTask) {
      if (this.resourceKindId != null)
        return task.resources.find(x => x.resourceKindId == this.resourceKindId)?.count ?? 0
      return task.power
    },
    getDuration(task: CalculatedTask) {
      if (task.lateStart! >= this.b || task.lateEnd! < this.a)
        return 0
      var start = this.a
      if (this.a < task.lateStart!) {
        start = task.lateStart!
      }
      var end = this.b
      if (this.b > task.lateEnd!) {
        end = task.lateEnd!
      }
      return end - start
    }
  },
  computed: {
    newProcessedTaskIds() {
      if (!this.taskInFound)
        return [...this.processedTaskIds]
      return [...this.processedTaskIds, this.taskInFound.id]
    },
    calculatedTasks(): CalculatedTask[] {
      return this.storage.calculatedTasks;
    },
    taskInFound(): CalculatedTask | null {
      var data = this.calculatedTasks.filter(x => this.processedTaskIds.includes(x.id) == false && x.duration && this.getDuration(x) && x.lateEnd! >= this.b).sort((a, b) => (this.getDuration(a) - this.getDuration(b)) || (a.duration - b.duration))
      
      if (!data.length)
        return null

      return data[data.length - 1]
    }
  },
  mounted() {
    //this.storage.initialiseStore();
  },
});
</script>

<style>
.bg-gray {
  background-color: lightgray;
}

.fw-500 {
  font-weight: 500;
}

.row-hover:hover {
  background-color: lightgray;
}

/* width */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px lightblue;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: lightskyblue;
  border-radius: 10px;
}
</style>
