import {BarLocation} from "./Bar";

export interface IStrollerState {
  scrollWidth: number;
  scrollHeight: number;

  clientWidth: number;
  clientHeight: number;

  scrollLeft: number;
  scrollTop: number;

  dragPhase: string;
  mousePosition: number[];
  scrollPosition: number[];

  barLocation: BarLocation;
}