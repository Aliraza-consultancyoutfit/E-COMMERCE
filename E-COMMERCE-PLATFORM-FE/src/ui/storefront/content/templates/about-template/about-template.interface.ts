import { ComponentType } from "react";
import { IAssetsPropsDimension } from "@/interface";

export interface IAboutStat {
  number: string;
  label: string;
}

export interface IAboutValue {
  Icon: ComponentType<IAssetsPropsDimension>;
  heading: string;
  paragraph: string;
}

export interface IAboutTemplateProps {
  title: string;
  intro: string;
  stats: IAboutStat[];
  values: IAboutValue[];
}
