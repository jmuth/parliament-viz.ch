# ch-parliament
(ADA CS-401 EPFL)

## Abstract

> The Freedom of Information Act came into force on 1 July 2006. It is intended to promote transparency with 
> regard to the purpose, organisation and activities of the federal administration, while guaranteeing access to 
> official documents produced after 1 July 2006.
>- [Swiss Parliament Website](https://www.parlament.ch/en/services/freedom-of-information-act)

The motivation of this project comes from the gulf existing between political world and citizens. Even if all informations
are freely accessible on official website, they represent a substential amount of papers and are hard to understand. Grabing 
all the official 
bulletins produced during national assembly, we will provide a clear and understandable summary of what are the main subjects 
discussed during each sessions, who are the speakers and with which party does he work. This summary will be presented by the 
mean of a D3 data vizualization tool, and will be accessible through a web page.

## Data description
[Official website of swiss parliament - Official bulletins](https://www.parlament.ch/en/ratsbetrieb/suche-amtliches-bulletin)

Type of official bulletins (**first look** and **each one to be precised !**):
- Vote (Abstimmung)
- Differences (Differenzen)
- Advice (Rat)
- Continuation (Fortsetzung)

Official bulletins contains:
- Subject
- Date
- Kind of parliamentary chamber
  - Council of States (46 deputies: cantons-equitable)
  - National Council (200 deputies: proportional to cantons population)
  - United Federal Assembly (both unified)
- Course of Debate
  - List of speakers (+ canton and party)
- Full speaches of all speakers

  


## Feasibility and Risks

### Parliamentary Terms
Complicated and precise terminology, specific to political area.
[Lexicon Of Parliamentary Terms](https://www.parlament.ch/en/über-das-parlament/parlamentswörterbuch)

### Three oficial languages
Speakers debate in their own language, mainly in German and French. Textual analysis must take care to too lose information
by translating them to english.

### Licences
[Open Data / Web services statement of Parliament web site](https://www.parlament.ch/en/services/open-data-webservices)
The provided informations are free to be used by user, under reasonable condition (no alterations, source indicated, 
date of download indicated)



As far as we know, there is no API provided by the web site, so we will have to scrap and soup them.

## Deliverables 

## Timeplan




