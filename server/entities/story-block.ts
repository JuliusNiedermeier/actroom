import { z } from "zod";
import {
  actPlayFeatureSchema,
  roleDirectionPlayFeatureSchema,
  scenePlayFeatureSchema,
  stageDirectionPlayFeatureSchema,
} from "./play-feature";

const actStoryBlockSchema = actPlayFeatureSchema;
const sceneStoryBlockSchema = scenePlayFeatureSchema;
const stageDirectionStoryBlockSchema = stageDirectionPlayFeatureSchema;
const roleDirectionStoryBlockSchema = roleDirectionPlayFeatureSchema;

export const storyBlockSchema = z.discriminatedUnion("type", [
  actStoryBlockSchema,
  sceneStoryBlockSchema,
  stageDirectionStoryBlockSchema,
  roleDirectionStoryBlockSchema,
]);

export type ActStoryBlock = z.infer<typeof actStoryBlockSchema>;
export type SceneStoryBlock = z.infer<typeof sceneStoryBlockSchema>;
export type StageDirectionStoryBlock = z.infer<
  typeof stageDirectionStoryBlockSchema
>;
export type RoleDirectionStoryBlock = z.infer<
  typeof roleDirectionStoryBlockSchema
>;

export type StoryBlock = z.infer<typeof storyBlockSchema>;
