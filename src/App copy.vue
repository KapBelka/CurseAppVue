<!-- <template>
  <div class="row" style="width: 100%">
    <div class="col-4">
      <h5>Задачи</h5>
      <div class="row">
        <div class="col-2">Номер</div>
        <div class="col-5">Название</div>
        <div class="col-3">Продолжительность</div>
        <div class="col-2">Требуемые задачи</div>
      </div>
      <div class="row border" style="height: 32px" v-for="job in orderedJobs">5
        <div class="col-2">
          {{ job.id
          }}<a @click="deleteJob(job.id)" class="ms-2" style="cursor: pointer"
            >Удалить</a
          >
        </div>
        <div class="col-5">{{ job.name }}</div>
        <div class="col-3">{{ job.duration }}</div>
        <div class="col-2">{{ job.needJobsIds }}</div>
      </div>
      <div>
        <div class="mb-3">
          <label for="nameInput" class="form-label">Название</label>
          <input
            v-model="name"
            type="text"
            class="form-control"
            id="nameInput"
          />
        </div>
        <div class="mb-3">
          <label for="durationInput" class="form-label"
            >Продолжительность</label
          >
          <input
            v-model="duration"
            type="number"
            class="form-control"
            id="durationInput"
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="neededJobsInput"
            >Требуемые работы</label
          >
          <select
            v-model="neededJobs"
            multiple
            class="form-select"
            id="neededJobsInput"
          >
            <option :value="job.id" v-for="job in orderedJobs">
              {{ job.id }} {{ job.name }}
            </option>
          </select>
        </div>
        <button class="btn btn-primary" @click="addJob()">Добавить</button>
      </div>
    </div>
    <div class="col-8 overflow-x-scroll">
      <div class="d-flex" style="margin-top: 48px">
        <div
          v-for="date in dates"
          class="border p-1 d-flex align-items-center justify-content-center"
          :class="{ 'bg-gray': date.getDay() == 6 || date.getDay() == 0 }"
          style="min-width: 32px; height: 32px"
        >
          {{ date.getDate() }}
        </div>
      </div>
      <div class="d-flex" v-for="job in orderedJobs">
        <div
          v-for="(date, index) in dates"
          class="border d-flex align-items-center justify-content-center"
          :class="{ 'bg-gray': date.getDay() == 6 || date.getDay() == 0 }"
          style="min-width: 32px; height: 32px"
        >
          <div
            v-if="
              date >= new Date(job.jobStart) &&
              date <= new Date(job.jobEnd) &&
              date.getDay() != 6 &&
              date.getDay() != 0
            "
            style="height: 8px; width: 100%; background-color: red"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import storage from "./store/index";

export default defineComponent({
  props: {
    /*todo: {
        type: Object as PropType<ToDo>,
        required: true
      }*/
  },
  data() {
    return {
      editable: false,
      storage: storage.getInstance(),
      name: "",
      duration: 0,
      neededJobs: [] as number[],
      dates: [] as Date[],
    };
  },
  methods: {
    fillDates() {
      var oldDate = new Date(
        Math.min(...this.jobs.map((e) => new Date(e.jobStart).getTime()))
      );
      oldDate.setDate(oldDate.getDate() - 5);
      this.dates.push(oldDate);
      for (var i = 1; i < 100; i++) {
        var newDate = new Date(oldDate);
        newDate.setDate(newDate.getDate() + 1);
        this.dates.push(newDate);
        oldDate = new Date(newDate);
      }
    },
    increment() {
      this.storage.increment();
    },
    addJob() {
      var jobStart = new Date(Date.now());
      jobStart.setHours(0, 0, 0, 0);

      var neededJobs = this.jobs.filter((x) => this.neededJobs.includes(x.id));
      if (neededJobs.length) {
        jobStart = new Date(
          Math.max(...neededJobs.map((e) => new Date(e.jobEnd).getTime()))
        );
        jobStart.setDate(jobStart.getDate() + 1);
      }

      var jobEnd = new Date(jobStart);

      var duration = 1;
      while (duration != this.duration) {
        jobEnd.setDate(jobEnd.getDate() + 1);
        if (jobEnd.getDay() != 0 && jobEnd.getDay() != 6) duration++;
      }

      this.storage.addJob({
        id: this.lastId + 1,
        name: this.name,
        duration: this.duration,
        needJobsIds: this.neededJobs,
        jobStart: jobStart,
        jobEnd: jobEnd,
      });
    },
    deleteJob(id: number) {
      this.storage.deleteJob(id);
    },
    recurseMethod(jobs2: any): any {
      var jobs = [];

      for (var elem of jobs2) {
        var jobsToAdd = [];
        var jobsWhereNeeded = this.jobs.filter((x) =>
          x.needJobsIds.includes(elem.id)
        );

        jobs.push(elem);

        for (var elem2 of jobsWhereNeeded) {
          var neededJobs = this.jobs.filter((x) =>
            elem2.needJobsIds.includes(x.id)
          );

          var lastEndNeededJob = neededJobs.reduce((prev, current) =>
            prev && prev.jobEnd > current.jobEnd ? prev : current
          );

          if (elem.id == lastEndNeededJob.id) jobsToAdd.push(elem2);
        }

        jobs = jobs.concat(this.recurseMethod(jobsToAdd));
      }

      return jobs;
    },
  },
  computed: {
    count() {
      return this.storage.count;
    },
    jobs() {
      return this.storage.jobs.sort(
        (a, b) =>
          new Date(a.jobStart).getTime() - new Date(b.jobStart).getTime() ||
          a.id - b.id
      );
    },
    lastId() {
      if (this.jobs && this.jobs.length)
        return this.jobs.sort((a, b) => b.id - a.id)[0].id;
      return 0;
    },
    orderedJobs() {
      var zeroLevelJobs = this.jobs.filter((x) => x.needJobsIds.length == 0);

      return this.recurseMethod(zeroLevelJobs);
    },
  },
  mounted() {
    this.storage.initialiseStore();
    this.fillDates();
  },
});
</script>

<style scoped>
.bg-gray {
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
</style> -->
