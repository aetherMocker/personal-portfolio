/* Site content - Blog entries.
 *
 * To add a post, paste a new object into `posts`. * Order doesn't matter *
 *                                                      the newest date is always shown first.
 *
 *   date    "2026-10-25"  (the day is optional: "2026-10" shows as "October 2026")
 *   title   shown bold, like a section header
 *   body    plain text. Leave a blank line between paragraphs. No HTML.
 *   images  optional. Each entry can be:
 *             "photo.jpg"                 looked up in public/images/
 *             "images/blog/photo.jpg"     a path inside public/
 *             "https://..."               a full URL
 *             { src: "photo.jpg", alt: "…", caption: "…" }   with alt text / caption
 */
export const blog = {
  heading: "from behind my phone", //title TBD...
  posts: [
    {
      date: "2026-10-30",
      title: "skill building and new experiences",
      body: `In preparing my works for this portfolio project, I've had to teach myself quite a bit. Originally, all I wanted was a personal photo album with clear photographs of my traditional art -- paintings mostly, but maybe expand to drawings -- so that I could reference it when I felt like. I liked the idea of being able to easily show my art to people who asked without having to scroll through my hundreds of progress photos mid-painting (quite helpful for other discussions, I might add.) 
      
So then came when I was conceptualizing taking the photos, and my dad offers to buy studio lights and set up a rig for more professional looking photos. Brought out the digital camera, set up the lights, and we cranked out the photographs in a couple of hours. If I haven't said it yet, thanks dad for your help on this project.

And now, as I sit here with GIMP open and teaching myself basic concepts in photo-editing so that I can touch up these forsaken photographs to make this project perfect, I am thinking about how this project evolved over the past couple weeks. You know I didn't even originally plan to make this site at all, right? Woe is me to commit to a simple and small project for once. But no, I had to use my Computer Science Bachelor's degree for something and build myself a site to elegantly showcase my paintings -- and maybe digital artwork in the future, god-willing -- to pretend I have an inkling of talent for art. 

This post is the first I will make of many, so sorry if this too long for some to read. I want to blog reflecting on my process of art-making, what inspires me, and further thoughts and feelings surrounding my work. By no means do I do this as a career or even a side-job as commissions, but if you'd like, reach out to me and we can discuss. 

If no one reads this and it's just me talking to myself, I will have regretted nothing. If few visit this site, never read these posts, but enjoy the art I make in passing, I will feel forever proud of this project. If this brings about a career I never planned but always hoped, then I will die happy. But in the meantime, I'll continue editing my photos in [GIMP](https://www.gimp.org), poisoning them with [Glaze](https://glaze.cs.uchicago.edu), and cataloging them into my system.

I love you.

Aether`,
      images: ["images/blog/mid-editing_2026-10-28.png", "images/blog/editing-file-management_2026-10-30.png"],
    },


  /* ======= example posts ======================================= */

    /* {
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
    }, */
  ],
};