"Song Match" - Alexa Skills

1.	Gets the artist name from the user
2. 	For any given artist, asks three fun questions to the user
3.	Provides the song match that is customized for the user's answers.


LIST OF ARTISTS SUPPORTED:
1.	Ariana Grande
2.	Billie Eilish
3.	Charlie Puth
4.	Bruno Mars


LIST OF QUESTIONS FOR ARIANA GRANDE:
1.	"How are you feeling right now? Sad, Anxious  or  Happy?"
2.	"What is your best quality? Wisdom, Manipulation or Empathy? "
3.	"Which emoji do you prefer? Black Heart or White Clouds?"

LIST OF QUESTIONS FOR BILLIE EILISH:
1.	"If you had to, which would you change your name to? River,  Bailey  or Johnny"
2.	"Choose a form of potatoes: French fries , Tater tots or Cheese Potatoes?"
3.	"Choose a style of hat: Beanie or Cowboy"

LIST OF QUESTIONS FOR CHARLIE PUTH:
1.	"What is your favorite icecream flavor ? Vanilla, Strawberry or Chocolates"
2.	"What is your favorite cuisine ? Italian , Mexican or American"
3.	"Which one would you choose : beaches or mountains ?"

LIST OF QUESTIONS FOR BRUNO MARS:
1.	"Choose a place for vacation: Tokyo, Vegas  or  Melbourne "
2.	"How are you feeling right now? Excited, Silly  or  Surprised"
3.	"On a friday night, You're gonna stay home or hang out?"


EXAMPLE OUTPUT:

User Input: Sad, Empathy, Black Heart:
Song Matched: "Thank You Next"


EXAMPLE SCENARIOS:

1.	START APPLICATION

	User Input: run song match
	Output: Welcome to Song Match. I can help you understand which song, by your favorite artist, best matches your life. Please tell me the name of your favorite artist.

2.	VALID USER INPUT AND PLAY AGAIN

	User Input: Ariana Grande
	Output : Excellent choice!! Ariana Grande. How are you feeling right now? Sad, Anxious  
			or  Happy?
	User Input : Sad
	Output : Got it! What is your best quality? Wisdom, Manipulation or Empathy? 
	User Input : Empathy
	Output : Okay.  Which emoji do you prefer? Black Heart or White Clouds?
	User Input : Black heart
	Output: Thanks for answering the questions... 
			Based on your answers, your Ariana grande song match is "Thank You Next". Would you like to get another song match from a different artist?
	User Input : Yes
	
3.	INVALID ARTIST INPUT AND EXIT

	Output: Welcome to Song Match. I can help you understand which song, by your favorite 		artist, best matches your life. Please tell me the name of your favorite artist.
	User Input: justin beiber
	Output: Sorry, I can't find what you're looking for. But here is a song that you might
			 like : "Low by Flo Rida". Would you like to get another song match from a 
			 different artist?
	User Input : No
	Output : Thank you for using Song Match. Stay Home and Stay Safe

4.	INVALID ANSWER INPUT

	Output: Excellent choice!! Ariana grande. How are you feeling right now? Sad, Anxious or Happy?
	User Input : Excited
	Output: Got it!. What is your best quality? Wisdom, Manipulation or Empathy?
	User Input : Patience
	Output: Okay. Which emoji do you prefer? Black Heart or White Clouds?
	User Input : Green trees
	Output : Thanks for answering the questions... Unfortunately, I couldn't find a song 
		based on your answers. Here is a song you might like : Blank Space by Taylor Swift. 
		Would you like to get another song match from a different artist?

5.	HELP
	
	User Input: Please help
	Output: Tell me your favorite artist. I will ask a few questions and at the end I will 		tell you which song of your favorite artist best matches your life.

6. STOP/CANCEL

	User Input: Stop
	Output: Thank you for using Song Match. Stay Home and Stay Safe

7. REPEAT

	Output: Excellent choice!! Ariana grande. How are you feeling right now? Sad, Anxious or 
			Happy?
	User Input : Repeat
	Output: Excellent choice!! Ariana grande. How are you feeling right now? Sad, Anxious or 
			Happy?





