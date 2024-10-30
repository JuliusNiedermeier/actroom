import { z } from "zod";
import { publicProcedure } from "../trpc";
import { convertPlay as convertPlayUseCase } from "../use-cases/convert-play";
import { PlayFeature } from "../entities/play-feature";

export const convertPlay = publicProcedure
  .input(z.object({ ID: z.string() }))
  .mutation(async ({ input }) => {
    const result = await convertPlayUseCase({
      playID: input.ID,
      model: async (config) => {
        return (async function* model() {
          const fakeFeatures: PlayFeature[] = [
            {
              type: "title",
              title: "Die Spanische Fliege",
              subtitle: "Schwank in drei Akten",
            },
            { type: "authors", authorNames: ["Josef Gart", "Miam Yong"] },
            { type: "stage-direction", direction: "Alle laufen auf die Bühne" },
          ];

          for (let feature of fakeFeatures) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            yield `${JSON.stringify(feature)}\n`;
          }
        })();
      },
      getSourceParts: (playID) => [],
      updatePlay: (_, data) => console.log("Updating play", data),
      createStoryBlock: (playID, block) =>
        console.log("Creating story block", block),
    });
  });
