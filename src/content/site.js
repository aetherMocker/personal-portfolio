/* Site content -- for what little text in the site there is... it's all stored here. 

  Text is placeholders, replace on your own. 
*/

export const site = {
  /* home page, header, footer */
  name: "Aether",
  location: "Portland, Oregon", // required for footer to render! can change later...
  statement: "Art is less about the final product, but rather of the process of construction, molding, mixing, blending, and feeling.",

  /* about page */
  about: {
    heading: "Between the measured and the felt.",
    portrait: "images/tooplate-about-image.jpg",
    portraitAlt: "Portrait of Aether",
    paragraphs: [
      "My work begins with fragments (field notes, remembered color, the geometry of built spaces) and moves slowly toward abstraction.",
      "I work in series, letting each piece answer the one before it. A painting is finished when nothing more needs to be added.",
      "Studio visits, commissions and exhibition enquiries are welcome. Please get in touch.",
    ],
    approach: [
      {
        title: "Slow looking",
        text: "I spend more time looking than painting. A piece starts once I understand the light of a place at a given hour.",
      },
      {
        title: "Built in layers",
        text: "Surfaces are built from thin layers of oil, cold wax and pigment, sanded back and rebuilt until the work settles.",
      },
      {
        title: "Restraint",
        text: "I would rather stop early than decorate. What remains should be enough.",
      },
    ],
  },
};
