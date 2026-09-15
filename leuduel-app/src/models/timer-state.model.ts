/**
 * Represents the state the timer, start time is the time when the timer is started, in milliseconds since the epoch (January 1, 1970).
 * timer can be paused and resumed, so the start time is not necessarily the time when the timer was created.
 * when the timer is paused, ellapsed time is the time that has passed since the timer was started, in milliseconds.
 * when the timer is resumed, the start time is updated to the current time minus the ellapsed time.
 * when the timer is reset, the start time is set to 0.
 */
export interface TimerState {
  startTime: number;
  elapsedTime: number;
  duration: number;
}
