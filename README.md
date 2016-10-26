# ch-parliament
(ADA CS-401 EPFL)

## Abstract

> The Freedom of Information Act came into force on 1 July 2006. It is intended to promote transparency with 
> regard to the purpose, organisation and activities of the federal administration, while guaranteeing access to 
> official documents produced after 1 July 2006.
>- [Swiss Parliament Website](https://www.parlament.ch/en/services/freedom-of-information-act)

The motivation of this project comes from the gulf existing between political world and citizens. Even if all information
is freely accessible on the official website, they represent a substantial number of papers and are hard to understand. Grabbing 
all the official 
bulletins produced during national assembly, we will provide a clear and understandable summary of what are the main subjects 
discussed during each session, who are the speakers and with which party does he work. This summary will be presented by the 
means of a D3 data visualization tool, and will be accessible through a web page.

## Data description

### Official bulletins
[Official website of Swiss parliament - Official bulletins](https://www.parlament.ch/en/ratsbetrieb/suche-amtliches-bulletin)

Type of Procedure:
- Question hour
- Canton Initiative
- Parliament Initiative
- Interpellation
- Motion
- Federal Council Object
- Parliament Object
- Postulate
- Petition
- Question 
- Urgent Question

Each procedure can go though different debate (**first look** and **each one to be precised !**):
- Advice (Rat)
  - First Advice
  - Second Advice
- Differences (Differenzen)
  - Main debate
- Continuation (Fortsetzung)
  - Delayed debate
- Vote (Abstimmung)

Official bulletins contains:
- Subject
- Date
- Kind of parliamentary chamber
  - Council of States (46 deputies: cantons-equitable)
  - National Council (200 deputies: proportional to canton population)
  - United Federal Assembly (both unified)
- Course of Debate
  - List of speakers (+ canton and political party)
- Full speeches of all speakers

### Session briefings
[Official website of Swiss parliament - Session briefings](https://www.parlament.ch/en/ratsbetrieb/sessions/overview-briefings)

Must be evaluated if relevant

Offer a summary of all objects debated during parliamentary sessions in PDF. Could be a good start point to create a frame of
our project.




## Feasibility and Risks

### Parliamentary Terms
Complicated and precise terminology, specific to the political area.
[Lexicon of Parliamentary Terms](https://www.parlament.ch/en/über-das-parlament/parlamentswörterbuch)

### Three official languages
Speakers debate in their own language, mainly in German and French. Textual analysis must take care not to lose information
by translating them into English.

### Licences
[Open Data / Web services statement of Parliament web site](https://www.parlament.ch/en/services/open-data-webservices)
The provided information is free to be used by the user, under reasonable condition (no alterations, source indicated, 
date of download indicated)

### Data collecting
As far as we know, there is no API provided by the web site, so we will have to scrap and soup them.

### Theme classification
Official bulletins don't contain clear *theme* attribute. The names of debated object do not always state clearly what they cover.
We will use NLP tools on speeches in order to extract thematic.



## Deliverables 

The final product will take the form of an online web site presenting different interactive visualization of this data. This web site will be hosted on github. It's interface will use D3 tool to provide interactive visualization.

Visitors will be able to see the evolution of frequencies of specific themes in chronologic order, or at the opposite to look at their  importance in one session. Visitors will be able to focus on one speaker or one political party to see their predilection subject and their evolution in time.

## Timeplan




