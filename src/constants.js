const WELCOME_TEXT = "Welcome to Song Match. I can help you understand which song, by your favorite artist, best matches your life. Please tell me the name of your favorite artist.";
const WELCOME_REPROMPT = "Welcome to Song Match..Please tell me the name of your favorite artist.";

const HELP_TEXT = 'Tell me your favorite artist. I will ask a few questions and at the end I will tell you which song of your favorite artist best matches your life.';
const THANKYOU_TEXT = "Thanks for answering the questions... ";
const PLAYAGAIN_TEXT = " Would you like to get another song match from a different artist? ";
const EXIT_TEXT = "Thank you for using Song Match. Stay Home and Stay Safe";

const greetings = ["Great!", "Excellent choice!", "Nice one"];
const reply = ["Got it!", "Okay", "Understood"];
const questionsForArtists = {
  Arianagrande: ["How are you feeling right now? Sad, Anxious  or  Happy?", "What is your best quality? Wisdom, Manipulation or Empathy? ", "Which emoji do you prefer? Black Heart or White Clouds?"],
  Brunomars: ["Choose a place for vacation: Tokyo, Vegas  or  Melbourne ", "How are you feeling right now? Excited, Silly  or  Surprised", "On a friday night, You're gonna stay home or hang out?"],
  Billieeilish: ["If you had to, which would you change your name to? River,  Bailey  or Johnny", "Choose a form of potatoes: French fries , Tater tots or Cheese Potatoes?", "Choose a style of hat: Beanie or Cowboy"],
  Charlieputh: ["What is your favorite icecream flavor ? Vanilla, Strawberry or Chocolates", "What is your favorite cuisine ? Italian , Mexican or American", "Which one would you choose : beaches or mountains ?"]
};
const songsForErrors = ["Party in the USA by Miley Cyrus", "Believer by Imagine Dragons", "Low by Flo Rida", "Blank Space by Taylor Swift"];
const songsForCombos = {
  sad: {empathy : {blackheart: "Thank You Next" , whiteclouds: "Sweetner"},
        wisdom : {blackheart: "Every day", whiteclouds: "Be Alright"},
        manipulation: {blackheart: "Beauty and Beast", whiteclouds: "Focus"}},
  anxious: {empathy: {blackheart: "Bad Idea", whiteclouds: "Side to Side"},
            wisdom: {blackheart: "Bang Bang", whiteclouds: "God is a woman"},
            manipulation: {blackheart: "Problem", whiteclouds: "Break free"}},
  happy: {empathy: {blackheart: "Imagine", whiteclouds: "Into You"},
            wisdom: {blackheart: "Love me harder", whiteclouds: "Breathing"},
            manipulation: {blackheart: "Don't call me an Angel", whiteclouds: "The way"}},
  tokyo : {excited: {stayhome: "Uptown Funk", hangout: "Just the way you are"},
          silly: {stayhome: "Grenade", hangout: "When I was your man"},
          surprised: {stayhome: "That's what I like", hangout: "It will rain"}},
  vegas : {excited: {stayhome: "The Lazy song", hangout: "24k magic"},
          silly: {stayhome: "Finesse", hangout: "Locked out of heaven"},
          surprised: {stayhome: "Versace on the floor", hangout: "Treasure"}},
  melbourne : {excited: {stayhome: "Nonthing on you", hangout: "Gorilla"},
          silly: {stayhome: "Billionaire", hangout: "Young, wild and free"},
          surprised: {stayhome: "Please me", hangout: "Young girls"}},
  river : {frenchfries: {beanie: "Bad guy", cowboy: "Ocean eyes"},
          tatertots: {beanie: "Lovely", cowboy: "When the party is over"},
          cheesepotatoes: {beanie: "No time to die", cowboy: "Bury a friend"}},
  bailey : {frenchfries: {beanie: "Everything I wanted", cowboy: "Watch"},
          tatertots: {beanie: "Listen Before I go", cowboy: "Copy cat"},
          cheesepotatoes: {beanie: "Belly ache", cowboy: "Bored"}},
  johnny : {frenchfries: {beanie: "Come out and play", cowboy: "Six feet under"},
          tatertotses: {beanie: "My strange addiction", cowboy: "My boy"},
          cheesepotatoes: {beanie: "Hostage", cowboy: "Fingers crossed"}},
  vanilla : {italian : {beaches: "See you again", mountains: "Attention"},
            mexican : {beaches: "We dont talk anymore", mountains: "One call away"},
            american : {beaches: "How long", mountains: "Done for me"}},
  strawberry : {italian : {beaches: "I warned myself", mountains: "Dangerously"},
            mexican : {beaches: "Mother", mountains: "The way I am"},
            american : {beaches: "Patient", mountains: "Change"}},
  chocolate : {italian : {beaches: "Sober", mountains: "Oops"},
            mexican : {beaches: "Boy", mountains: "If you leave me now"},
            american : {beaches: "Slow it down", mountains: "Seventeen"}}
};

module.exports = {
  greetings,
  reply,
  questionsForArtists,
  songsForErrors,
  songsForCombos,
  WELCOME_TEXT,
  WELCOME_REPROMPT,
  HELP_TEXT,
  THANKYOU_TEXT,
  PLAYAGAIN_TEXT,
  EXIT_TEXT
};