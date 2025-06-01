<template>
    <PageContainer>
      <div class="dashboard">
        <h1 class="title">Дашборд проекта</h1>
        <div class="charts-container">
          <div class="chart-wrapper">
            <h2 class="chart-title">Распределение ресурсов во времени — Планируемый</h2>
            <canvas ref="plannedChart" width="400" height="250" class="chart-canvas"></canvas>
          </div>
          <div class="chart-wrapper">
            <h2 class="chart-title">Распределение ресурсов во времени — Фактический</h2>
            <canvas ref="actualChart" width="400" height="250" class="chart-canvas"></canvas>
          </div>
        </div>
        <div class="top-tasks">
          <div class="task-list">
            <h2 class="list-title">Топ задач, задержавших проект</h2>
            <ul>
              <li v-for="task in delayedTasks" :key="task.id" class="list-item">{{ task.name }} — задержка {{ task.delay }} дней</li>
            </ul>
          </div>
          <div class="task-list">
            <h2 class="list-title">Задачи выполнены раньше срока</h2>
            <ul>
              <li v-for="task in earlyTasks" :key="task.id" class="list-item">{{ task.name }} — выполнена {{ task.daysEarly }} дней раньше</li>
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import PageContainer from '../../components/pageContainer/page-container.vue';
  
  export default defineComponent({
    components: {
      PageContainer
    },
    data() {
      return {
        plannedChart: null as HTMLCanvasElement | null,
        actualChart: null as HTMLCanvasElement | null,
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'],
        plannedData: [10, 20, 30, 40, 50, 60, 70],
        actualData: [12, 18, 28, 45, 55, 65, 80],
        delayedTasks: [
          { id: 1, name: 'Задача А', delay: 5 },
          { id: 2, name: 'Задача Б', delay: 3 },
          { id: 3, name:'Задача В', delay:-1 },
        ],
        earlyTasks: [
          { id:4,name:'Задача Г', daysEarly:-4},
          { id:5,name:'Задача Д', daysEarly:-2},
        ],
      };
    },
    methods: {
      drawLineChart(canvas: HTMLCanvasElement | null, data: number[], color: string) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
  
        ctx.clearRect(0,0,canvas.width,canvas.height);
  
        const padding = 50;
        const width = canvas.width - padding *2;
        const height = canvas.height - padding *2;
  
        const maxY = Math.max(...data) *1.1; // чуть больше максимума
  
        // Осевые линии
        ctx.strokeStyle='#e0e0e0';
        ctx.lineWidth=1;
        
        // Y-оси (горизонтальные линии)
        for(let i=0; i<=5; i++){
          const yPos=padding + (height/5)*i;
          ctx.beginPath();
          ctx.moveTo(padding,yPos);
          ctx.lineTo(padding+width,yPos);
          ctx.stroke();
  
          // подписи по Y
          ctx.font='10px Arial';
          ctx.fillStyle='#555';
          ctx.textAlign='right';
          ctx.fillText((maxY - (maxY/5)*i).toFixed(0), padding-10,yPos+3);
        }
  
        // X-оси (вертикальные линии)
        this.labels.forEach((label,i)=>{
          const x=padding + (width/(this.labels.length-1))*i;
          ctx.beginPath();
          ctx.moveTo(x,padding);
          ctx.lineTo(x,padding+height);
          ctx.stroke();
  
          // подписи по X
          ctx.font='10px Arial';
          ctx.fillStyle='#555';
          ctx.textAlign='center';
          ctx.fillText(label,x,padding+height+15);
        });
  
        // Рисуем линию
        ctx.strokeStyle=color;
        ctx.lineWidth=3;
        
        data.forEach((point,yIndex)=>{
          const x=padding + (width/(this.labels.length-1))*yIndex;
          const y=padding + height - (point / maxY)*height;
  
          if(yIndex===0){
            ctx.beginPath();
            ctx.moveTo(x,y);
          }else{
            ctx.lineTo(x,y);
          }
  
          // точки
          ctx.fillStyle=color;
          ctx.beginPath();
          ctx.arc(x,y,4,0,Math.PI*2);
          ctx.fill();
         });
         ctx.stroke();
       },
      renderCharts() {
        this.drawLineChart(this.plannedChart!, this.plannedData,'#42A5F5');
        this.drawLineChart(this.actualChart!, this.actualData,'#EF5350');
      }
    },
    mounted() {
      this.plannedChart = this.$refs.plannedChart as HTMLCanvasElement;
      this.actualChart = this.$refs.actualChart as HTMLCanvasElement;
      this.renderCharts();
    },
    watch: {
      plannedData() {
        this.renderCharts();
      },
      actualData() {
        this.renderCharts();
      }
    }
  });
  </script>
  
  <style scoped>
  /* Общий стиль страницы */
  .dashboard {
    font-family: 'Arial', sans-serif;
    padding: 40px;
  }
  
  /* Заголовок */
  .title {
    text-align: center;
    font-size: 2em;
    margin-bottom: 30px;
    color: white;
    font-weight: bold;
  }
  
  /* Контейнер для графиков */
  .charts-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
  }
  
  /* Обертка каждого графика */
  .chart-wrapper {
    background-color: #ffffff; /* белый фон */
    padding:20px;
    border-radius:12px; /* скругление углов */
    box-shadow:0 4px 12px rgba(0,0,0,0.1); /* более мягкая тень */
    width:420px;
  }
  
  .chart-title {
     text-align:center;
     font-size:1.2em;
     margin-bottom:15px;
     color:#34495e;
  }
  
  /* Сам холст графика */
  .chart-canvas {
     display:block; /* убираем лишние отступы */
  }
  
  /* Секция задач */
  .top-tasks {
   display:flex;
   flex-wrap:wrap;
   justify-content:center;
   gap:40px;
   margin-top:50px; /* больше пространства сверху */
  }
  
  .task-list {
   background:#ffffff; /* белый фон */
   padding:20px; 
   border-radius:12px; 
   box-shadow:0 4px 12px rgba(0,0,0,0.1); /* более мягкая тень */
   width:300px; 
   transition:.3s all ease-in-out; 
  }
  
  .list-title {
   font-size:16px; 
   margin-bottom:15px; 
   color:#2c3e50; 
   text-align:center; 
  }
  
  .list-item {
   font-size:14px; 
   padding:.5em .8em; 
   border-radius:.8em; 
   background-color:#ecf0f1; /* мягкий серый фон для задач */
   margin-bottom:10px; /* отступ между задачами */
   transition:.3s background-color ease-in-out;
   cursor:pointer;
  
  }
  
  .list-item:hover {
   background-color:#dfe6e9; /* чуть темнее при наведении */
  }
  </style>