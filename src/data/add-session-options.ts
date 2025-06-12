import { SelectOptionType } from "~/components/inputs/types";

export const ReminderOptions: Array<SelectOptionType> = [
  {
    label: "At time of event",
    value: 0,
  },
  {
    label: "10 min before",
    value: 10 * 60,
  },
  {
    label: "1 hour before",
    value: 1 * 60 * 60,
  },
  {
    label: "1 day before",
    value: 1 * 24 * 60 * 60,
  },
];

export const RepetitionOptions: Array<SelectOptionType> = [
  {
    label: "Don't repeat",
    value: 0,
  },
  {
    label: "Every 1 day",
    value: 1 * 24 * 60 * 60,
  },
  {
    label: "Every 1 week",
    value: 7 * 24 * 60 * 60,
  },
  {
    label: "Every 1 month",
    value: 30 * 24 * 60 * 60,
  },
  {
    label: "Every 1 year",
    value: 365 * 24 * 60 * 60,
  },
];
