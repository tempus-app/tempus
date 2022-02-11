import { ProjectEntity } from "..";
import { Project } from "./project.model";

export interface Client {
  id: number
  title: string
  name: string
  projects?: ProjectEntity[]
}
