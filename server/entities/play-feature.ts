import { ZodRawShape, z } from "zod";

const createPlayFeatureSchema = <T extends string, S extends ZodRawShape>(
  type: T,
  schema: S
) => {
  return z.object({ type: z.literal(type), ...schema });
};

export const titlePlayFeatureSchema = createPlayFeatureSchema("title", {
  title: z.string(),
  subtitle: z.string().optional(),
});

export const authorsPlayFeatureSchema = createPlayFeatureSchema("authors", {
  authorNames: z.array(z.string()),
});

export const actPlayFeatureSchema = createPlayFeatureSchema("act", {
  number: z.number(),
  name: z.string().optional(),
});

export const scenePlayFeatureSchema = createPlayFeatureSchema("scene", {
  number: z.number(),
  name: z.string().optional(),
});

export const stageDirectionPlayFeatureSchema = createPlayFeatureSchema(
  "stage-direction",
  {
    direction: z.string(),
  }
);

export const roleDirectionPlayFeatureSchema = createPlayFeatureSchema(
  "role-direction",
  {
    roleName: z.string(),
    direction: z.string(),
  }
);

export const playFeatureSchema = z.discriminatedUnion("type", [
  titlePlayFeatureSchema,
  authorsPlayFeatureSchema,
  actPlayFeatureSchema,
  scenePlayFeatureSchema,
  stageDirectionPlayFeatureSchema,
  roleDirectionPlayFeatureSchema,
]);

export type TitlePlayFeature = z.infer<typeof titlePlayFeatureSchema>;
export type AuthorsPlayFeature = z.infer<typeof authorsPlayFeatureSchema>;
export type ActPlayFeature = z.infer<typeof actPlayFeatureSchema>;
export type ScenePlayFeature = z.infer<typeof scenePlayFeatureSchema>;
export type StageDirectionPlayFeature = z.infer<
  typeof stageDirectionPlayFeatureSchema
>;
export type RoleDirectionPlayFeature = z.infer<
  typeof roleDirectionPlayFeatureSchema
>;

export type PlayFeature = z.infer<typeof playFeatureSchema>;
