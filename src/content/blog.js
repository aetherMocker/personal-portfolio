/* Site content - Blog entries.
 *
 * To add a post, paste a new object into `posts`. Order doesn't matter:
 * the newest date is always shown first.
 *
 *   date    "2026-10-25"  (the day is optional: "2026-10" shows as "October 2026")
 *   title   shown bold, like a section header
 *   body    plain text. Leave a blank line between paragraphs. No HTML.
 *   images  optional. Each entry can be:
 *             "photo.jpg"                 looked up in public/images/
 *             "images/blog/photo.jpg"     a path inside public/
 *             "https://..."               a full URL
 *             { src: "photo.jpg", alt: "…", caption: "…" }   with alt text / caption
 *
 * The three posts below are placeholders. Replace them with your own.
 */
export const blog = {
  heading: "Notes from the studio.",
  posts: [
    {
      date: "2026-09-14",
      title: "A short one",
      body: "Finished the small panel today. Nothing to add.",
    },
    {
      date: "2026-10-18",
      title: "On leaving a painting alone",
      body: `The hardest decision in a painting is usually the last one, and it is almost always the decision to stop. For weeks I kept returning to the same corner, convinced it needed one more pass.

What finally helped was turning the canvas to face the wall for a few days. When I turned it back, the corner I had been fussing over was the quietest, most settled part of the whole piece. The parts I had been ignoring were the ones asking for attention.

I now keep a rule in the studio: if I cannot say what a mark is for, it does not go on. Some days that means the brush never leaves the jar. Those days still count as work.

The photographs below show the panel before and after I stopped.`,
      images: [
        { src: "https://picsum.photos/seed/notes-a/900/700", alt: "The panel mid-process", caption: "Before: too many marks in the corner." },
        { src: "https://picsum.photos/seed/notes-b/900/700", alt: "The finished panel", caption: "After: the corner left alone." },
      ],
    },
    {
      date: "2026-10-02",
      title: "Notes on cold wax",
      body: `Cold wax changes how a surface behaves. It dulls the gloss, holds a scraped edge, and forgives layers that would turn muddy in straight oil.

I have been mixing it in thin, nearly translucent layers and sanding between them. The result has a depth that photographs badly, which is a good reason to see the work in person.`,
      images: ["https://picsum.photos/seed/notes-c/900/700"],
    },
  ],
};