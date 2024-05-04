import { router } from "./trpc";
import { createPlay } from "./resources/play/actions/create-play";
import { getPlay } from "./resources/play/actions/get-play";
import { listPlayPreviews } from "./resources/play/actions/list-play-reviews";
import { updatePlay } from "./resources/play/actions/update-play";
import { deletePlay } from "./resources/play/actions/delete-play";
import { createSourcePart } from "./resources/source-part/actions/create-soruce-part";
import { updateSourcePart } from "./resources/source-part/actions/update-soruce-part";
import { convertPlay } from "./resources/play/actions/convert";

const playRouter = router({
  create: createPlay,
  getOne: getPlay,
  listPreviews: listPlayPreviews,
  update: updatePlay,
  delete: deletePlay,
  convert: convertPlay,
});

const sourcePartRouter = router({
  create: createSourcePart,
  update: updateSourcePart,
});

export const appRouter = router({
  play: playRouter,
  sourcePart: sourcePartRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
