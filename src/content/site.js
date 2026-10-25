export const site = {
  name: "Aether Mocker",
  location: "Portland, OR",
  timezone: "America/Los_Angeles",
  email: "aethermock@gmail.com",
  availability: "...",
  statement: "Art is less about the final product, but rather of the process of construction, molding, mixing, blending, and feeling.",
  instagram: { handle: "@maravoss", href: "https://instagram.com/" },
  responseTime: "Will get back to you ASAP",

  // Contact form: set this to a Formspree / Netlify / own endpoint to send messages directly. 
  // While empty, the form opens the visitor's email app instead.
  contactEndpoint: "",
  enquiryTypes: ["Personal enquiry", "Commission", "Other"],

  about: {
    heading: "Between the measured and the felt.",
    portrait: "images/about-pic.jpg",
    portraitAlt: "Portrait of Aether Mocker",
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
