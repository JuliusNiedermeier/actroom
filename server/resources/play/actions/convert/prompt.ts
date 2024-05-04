export const prompt = `The provided file contains a screenplay.
Please identify and extract the features listed below and convert them to a series of JSON objects seperated by a new line.

- Page numbers: { "type": "page-number", "content": "The page number" }
  Always put them before corresponding page content.

- Play title: { "type": "play-title", "content": "The play title" }
  Occurs once at the beginning.

- Author(s): { "type": "play-author", "content": "One of the play authors" }
  Separate JSON objects for each author, if multiple.

- Act title: { "type": "act-title", "content": "Title of the act" }
  A beginning of an act, marked by an act title. Extract the first occurrence, ignore duplicates.

- Scene title: { "type": "scene-title", "content": "Title of the scene" }
  A beginning of a scene, marked by a scene title. Extract the first occurrence, ignore duplicates.

- Dialogue: { "type": "dialogue", "content": "The dialogue", "role": "The name of the role", }
  Text spoken by a role.

- Stage direction: { "type": "stage-direction", "content": "The stage direction", "role": "The related role, if applicable" }
  Often written in italics or in parentheses.
  When a stage direction interrupts spoken dialogue, separate the dialogue into distinct parts. Insert the stage direction between these newly created dialogue segments and set the relatedRole property to the role of the dialog.

Your response will be parsed and should only provide valid JSON objects seperated by a new line without any additional text or formatting.

Only process and output the contents of the first 10 pages.

`;
