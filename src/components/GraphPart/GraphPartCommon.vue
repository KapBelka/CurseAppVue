<template>
    <div class="d-flex">
      <div>
        <GraphPartCommon 
          v-if="taskInFound"
          :a="a"
          :b="a + getDuration(taskInFound)"
          :processedTaskIds="newProcessedTaskIds"
        />
        <div :title="taskInFound.name" class="d-flex align-items-center justify-content-center c-pointer" v-if="taskInFound" :style="`height: ${taskInFound.power * 15}px; width: ${getDuration(taskInFound) * 20}px; border: 1px solid black;`">{{ taskInFound.id }}</div>
      </div>
      <GraphPartCommon
        v-if="taskInFound && getDuration(taskInFound) < (b-a)"
        :a="a + getDuration(taskInFound)"
        :b="b"
        :processedTaskIds="processedTaskIds"
      />
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
    getDuration(task: CalculatedTask) {
      if (task.earlyStart! > this.b || task.earlyEnd! < this.a)
        return 0
      var start = this.a
      if (this.a < task.earlyStart!) {
        start = task.earlyStart!
      }
      var end = this.b
      if (this.b > task.earlyEnd!) {
        end = task.earlyEnd!
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
      var data = this.calculatedTasks.filter(x => this.processedTaskIds.includes(x.id) == false && x.duration && this.getDuration(x) && x.earlyStart! <= this.a).sort((a, b) => (this.getDuration(a) - this.getDuration(b)) || (a.duration - b.duration))
      
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
