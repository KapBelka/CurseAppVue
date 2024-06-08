export default interface job {
  id: number
  name: string
  duration: number
  needJobsIds: number[]
  jobStart: Date
  jobEnd: Date
  //needJobberRoleIds: number[]
}