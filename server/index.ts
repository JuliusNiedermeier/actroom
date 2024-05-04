import { router } from "./trpc";
import { createPlay } from "./resources/play/actions/create-play";
import { getPlay } from "./resources/play/actions/get-play";
import { listPlayPreviews } from "./resources/play/actions/list-play-reviews";
import { updatePlay } from "./resources/play/actions/update-play";
import { deletePlay } from "./resources/play/actions/delete-play";
import { createSourcePart } from "./resources/source-part/actions/create-soruce-part";
import { updateSourcePart } from "./resources/source-part/actions/update-soruce-part";

export const appRouter = router({
  play: {
    create: createPlay,
    getOne: getPlay,
    listPreviews: listPlayPreviews,
    update: updatePlay,
    delete: deletePlay,
  },
  sourcePart: { create: createSourcePart, update: updateSourcePart },
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
