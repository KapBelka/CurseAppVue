<template>
    <div class="column" @dragover.prevent @drop="onDrop">
      <div class="column-header">{{ status.name }}</div>
      <div class="task-list">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @drag-start="onDragStart"
        />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import TaskCard from './task-card.vue';
  
  interface Task {
      id:number,
      title:string,
      description:string,
      assignee:string,
      subtasks:string[],
      statusId:number,
  }
  
  interface Status {
      id:number,
      name:string,
  }
  
  export default defineComponent({
      name:'Column',
      components:{ TaskCard },
      props:{
          status:{ type:Object as () => Status, required:true },
          tasks:{ type:Array as () => Task[], required:true }
      },
      methods:{
          onDrop(event:any){
              const taskId = event.dataTransfer.getData('text/plain');
              this.$emit('move-task', Number(taskId), this.status.id);
          },
          onDragOver(event:any){
              event.preventDefault();
          }
      }
  });
  </script>