import { type BlockTableSelect } from "@/server/resources/schema";
import { FC } from "react";
import { ActTitle } from "./act-title";
import { SceneTitle } from "./scene-title";
import { PlayAuthor } from "./play-author";
import { PlayTitle } from "./play-title";
import { StageDirection } from "./stage-direction";
import { Dialogue } from "./dialogue";

export type BlockRendererProps = Omit<
  BlockTableSelect,
  "ID" | "playID" | "position"
>;

export const blockTypeRendererMap: Record<
  BlockTableSelect["type"],
  FC<BlockRendererProps> | null
> = {
  "page-number": null,
  "play-title": PlayTitle,
  "play-author": PlayAuthor,
  "act-title": ActTitle,
  "scene-title": SceneTitle,
  "stage-direction": StageDirection,
  dialogue: Dialogue,
};
