//npc  #: NAME
//npc  4: THE BOSS
//npc  5: DAISY
//npc  6: ROBERT
//npc  7: GALE
//npc  8: JASPER
//npc  9: FRANCINE
//npc 10: COLIN
//npc 11: SUSAN
//npc 12: TINA
//npc 13: VALERIE
//npc 14: PHIL
//npc 15: WALLACE
//npc 16: EDNA
//npc 17: MONICA
//npc 18: THE ENTREPRENEUR

window.progression = [
	[
		{npc: 6, msg: "Robert: Please don't do that in the bathroom again."},
		{npc: 7, msg: "Gale: I need Phil's report on my desk before lunchtime."},
	],
	[
		{npc: 8, msg: "Jasper: Golf this weekend?"},
		{npc: 9, msg: "Francine: I am so sorry about last night."},
		{npc: 10, msg: "Colin: There will be a package for you to sign after lunch."},
	],
	[
		{
			npc: 12,
			msg: [
				"My Business is none of your Business. Your Business is all of my Business. Welcome to the Business.",
				"I've been waiting. Give me that.",
				"...",
				"I see. GOOD.",
				"Tsk. Don't you listen? It's none of your Business."
			]
		},
	],
	[
		{npc: 6, msg: "Robert: PLEASE don't do that in the bathroom again."},
		{npc: 7, msg: "Gale: There is no employee barbecue. Who told you that?"},
		{npc: 9, msg: "Francine: You know what, I am NOT sorry."},
	],
	[
		{npc: 11, msg: "Susan: No personal calls on the company line."},
		{npc: 10, msg: "Colin: I am so sorry about last night."},
		{npc: 8, msg: "Jasper: I WILL DESTROY YOU."},
	],
	[
		{
			npc: 13,
			msg: [
				"Hello there! My name is Valerie! What do you need from Square Resources?",
				"Oooooh, it's here! Let me see.",
				"...",
				"Ah, that's GOOD.",
				"I don't think I can tell you. Sorry!",
			]
		},
	],
	[
		{npc: 6, msg: "Robert: We TALKED about this."},
		{npc: 11, msg: "Susan: Did you tell Gale about the barbecue?"},
		{npc: 10, msg: "Francine: You leave my mother out of this."},
	],
	[
		{npc: 7, msg: "Gale: There is no barbecue. And even if there was, there are no vegetarian options anyway."},
		{npc: 10, msg: "Colin: That was completely uncalled for."},
		{npc: 11, msg: "Susan: Don't talk to Gale. The whole company has been over this. Well, the whole company minus Gale."},
	],
	[
		{
			npc: 12,
			msg: [
				"Oh. It's you.",
				"I suppose even a trashcan is an efficient container. Give me that memo.",
				"...",
				"...",
				"...",
				"Well that's... I had hoped....",
				"I thought I had a real shot at Employee of the Hour this time.",
				"But of course, it's Daisy. For the past 127 Hours, it's been Daisy.",
				"I'll get my time in the limelight. It's a matter of persistence.",
				"Why are you still here? Don't you know your place?",
				"GOOD. Now go!"
			]
		},
	],
	[
		{npc: 6, msg: "Robert: I swear, I've had it up to here. Do it ONE more time, I DARE you."},
		{npc: 8, msg: "Jasper: I bet that wasn't the first time you landed in the wrong hole, eh?"},
		{npc: 9, msg: "Francine: Guess what? I don't have a two o'clock."},
	],
	[
		{npc: 11, msg: "Susan: Did you not know? We had a meeting and everything!"},
		{npc: 10, msg: "Colin: You are a charlatan and a scoundrel."},
		{npc: 8, msg: "Jasper: Wait, hold up. You... and Susan?!"},
	],
	[
		{
			npc: 13,
			msg: [
				"Oh hey, it's you again! What's up?",
				"Another one? Well how about that! Let's open it up.",
				"...",
				"...",
				"...",
				"Oh.",
				"It is what it is, I suppose.",
				"I shouldn't tell you, but I could use a listening ear right now.",
				"The Boss denied my request for an extra one-minute bathroom break.",
				"I figured it was a long shot, but you might as well try, right?",
				"I'll be fine. Nose to the grindstone, right?"
			]
		},
	],
	[
		{npc: 7, msg: "Gale: Please send these documents to Valerie's inbox ASAP."},
		{npc: 9, msg: "Francine: Oh I love it when you talk to me like that."},
		{npc: 11, msg: "Susan: You should stay away from Jasper. He's never been checked, if you catch my drift."},
	],
	[
		{npc: 10, msg: "Colin: Incoming package. Get your pen ready."},
		{npc: 6, msg: "Robert: ... touche."},
		{npc: 7, msg: "Gale: Are you STILL going on about the barbecue?"},
	],
	[	

		{
			npc: 14,
			msg: [
				"Who, why are -- why are you here? You're not usually here....",
				"That, is that for me?",
				"...",
				"That, that is very -- very GOOD.",
				"Oh, oh no, that in-information isn't -- it's not -- relevant to you....",
				"What are you -- why are you looking around, like t-that?",
				"Is there -- is there something behind me?",
				"Isn't The B-Boss -- isn't he waiting for you...?",
			]
		},
	],


];

//npc  #: NAME
//npc  4: THE BOSS
//npc  5: DAISY
//npc  6: ROBERT
//npc  7: GALE
//npc  8: JASPER
//npc  9: FRANCINE
//npc 10: COLIN
//npc 11: SUSAN
//npc 12: TINA
//npc 13: VALERIE
//npc 14: PHIL
//npc 15: WALLACE
//npc 16: EDNA
//npc 17: MONICA
//npc 18: THE ENTREPRENEUR

window.idle_text = {
	'4': [  //THE BOSS
		"You are the shiniest cog in this grand machine. Who doesn't like giant robots?",
		"Everything the fluorescent light touches is my kingdom.",
		"Ah, it's you. GOOD.",
		"'The Boss saw all that he had made, and it was very GOOD.' Employee Manual 1:31.",
		"We are a place of Business.",
		"What do we do here? Business Things, of course.",
		"All Business is GOOD Business!",
		"Why believe in yourself when you can believe in me?",
		"Here's a secret: Daisy is our next Employee of the Hour! How GOOD!",
		"Oh, don't talk to Gale. She knows what she did.",
		"Everyone is waiting for you."
	],
	'5': [  //DAISY
		"There you are. GOOD.",
		"I have assessed your potential.",
		"Set yourself straight, you look like a rhombus.",
		"I do not appreciate your lackadaisical demeanor.",
		"What pointless request will you spew forth this time?",
		"Do not worry, it is within the realm of possibility that you are not completely useless.",
		"We are a place of Business.",
		"GOOD.",

	],
	'6': [  //ROBERT
		"Hmph.",
		"Uh-huh.",
		"Uh... don't go into the bathroom anytime soon.",
		"GOOD.",
	],
	'7': [  //GALE
		"Do you need something?",
		"What is this about a barbecue?",
		"What did I do?",
		"GOOD.",
	],
	'8': [  //JASPER
		"Can't you see I am doing Business Things?",
		"The secret to victory is not losing.",
		"The other secret to victory is not talking to Gale.",
		"GOOD.",
	],
	'9': [  //FRANCINE
		"...",
		"Hello. Goodbye.",
		"... you're quite close to The Boss, aren't you?",
		"GOOD.",
	],
	'10': [  //COLIN
		"...",
		"How your day's going is none of my Business.",
		"I, for one, am glad we don't have windows.",
		"GOOD.",
		
	],
	'11': [  //SUSAN
		"We're all trying our most mediocre.",
		"Is mayonnaise a Business Thing?",
		"Poor Gale... but you didn't hear me say that, okay?",
		"GOOD.",
	],
	'12': [  //TINA
		"Do you belong here?",
		"You're in the wrong Business.",
		"What Business do you have here?",
		"Tsk.",
		"It's no secret: Daisy is our next Employee of the Hour. How GOOD.",
		"The trash can is a metaphor.",
		"Get back in line.",
	],
	'13': [  //VALERIE
		"Hey, are you going to the Employee Barbecue?",
		"Aw, come on, don't be such a square!",
		"I hope I win next Employee of the Hour!",
		"Well aren't you the sweetest thing?",
		"I don't think the printer likes me.",
		"Don't tell anyone, but I invited Gale to the barbecue....",
		"Do you still need me?",
	],
	'14': [  //PHIL
		"The water, it's too -- it's too fresh, it didn't taste this fresh before....",
		"Numbers, numbers make sense -- numbers have rules, they are predictable....",
		"I will not t-tolerate unknown variables.",
		"There is a pattern... GOOD.",
		"a = c + l...  a = c + l...  a = c + l....",
		"Data, data is indisputable....",
		"No, there is -- absolutely -- no margin for error....",
		"What are you, why are you -- stop staring!",	
		"Please, don't -- don't stay any longer than you have to.",
	],
	'15': [  //WALLACE
		"Why is a square a better journalist than a rhombus? A square has all the right angles! Heh. Thank you, I'm here all week. Every week. Forever.",
		"Yes, I am a triangle. I am a polygon with three sides. Not four. Why is it so hard for you to grasp the unfamiliar?",
		"What if -- now stay with me -- what if... there was a world out there where shapes have more than two dimensions?",
		"Call me Wallace. I don't care. I'll be here all the same.",
		"Have you been GOOD today?",

	],
	'16': [  //EDNA
		"Business? Business is GOOD, didn't you hear? Or is it? Who knows? What does it matter so long as we are all still here? Complacency is comfortable. Routine is ritual. Tedium is therapy.",
		"Edna's the name. Or perhaps it isn't. Or perhaps it IS. Or perhaps it isn't....",
		"Is there being without motion?",
		"Yes! Yes! I can see you are BUSY. But are you in MOTION?",
		"When everyone moves the same way, no one is moving at all.",
		"Move it!",

	],
	'17': [  //MONICA
		"The mitochondria is the powerhouse of the cell.",
		"The memos, they're all the same.",
		"I was a surgeon, you know.",
		"Eureka! I've got it...! We can... ",
		"... nevermind, I did a stupid.",
		"GOOD. GOOD. GOOD. GOOD.",
		"They are allllllllll the same.",
		"Animal abuse is a felony in all fifty states.",
		"What are those?!",
		"Who art thous?!",
		"Why pantyhose?!",
		"Gotcha nose!",
		"Ha. Haha. HA.",
		"I fed my Business the Business Supplements but my Business still refuses to Business.",
		"He won't go away. He won't.",
		"Everyone is waiting for you.",
	],
	'18': [  //THE ENTREPENEUR
		"A life without risk, is not living -- it's surviving.",
		"We must build on ideas.",
		"What do you give, if not your all?",
		"Never settle for GOOD. Aim for BETTER.",
		"There is a whole world out there to improve.",
		"You must recognize your own worth.",
		"Do what you will. That's the beauty of it.",
	],
};
