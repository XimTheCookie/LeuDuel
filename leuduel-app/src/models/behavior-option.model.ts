export interface BehaviourOption {
  helper: string;
  label: string;
  values: BehaviourValues[];
}

interface BehaviourValues {
  label: string;
  value: number;
}
