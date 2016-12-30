# State of our project

With this project, we will provide a better, more intuitive and synthetized visualisation of the data hosted on www.parlament.ch.

## What we've done so far

### Scraping

* We got in touch with parlament.ch administrators and, while they have no direct API, they provided us with a way to programmatically access their data

* We built a scraping tool that allows us, with only one line of code, to get entire tables from their database and transform them into clean pandas DataFrames

* We scraped data that was relevant for our first experiments

### NLP

* To try and make sense of the transcripts of debates that we obtained, we built an NLP pipeline that we can use to classify transcripts into themed clusters

### Visualisation

* Using D3's Fore Layout library, we built a prototype of a visualisation of the parliament members. This allowed us to try interactive clustering and coloring of our data. It can be found [here](http://178.62.67.149).

* We built an adjacency matrix of interactions between parliament members, i.e. who debated with whom. The graph, however useful, is very dense and doesn't provide simple visual information.

### Misc.

* We contacted journalists and politicians to figure out what information they would most like to see out of this. After an interesting phone call with TV journalist Alain Rebetez, we decided to focus on information about individual members.

* We decided to visualize objective data, and move away from processing it in ways that we might not be fully understable to everyone.

## What we're doing now

### Scraping

* Scraping more data as needed

### Data Processing

* We're figuring out what information we can get out of the data. Examples include: number of interventions per member; number of words per member; who does one member address most?; within a party, who is the main speaker?; etc.

* This pre-visualisation step is key to providing a useful and insightful synthesis of our data. We try as much as possible not to interpret the data.

### Visualization

* As we combine our data in new ways, we're figuring out the most relevant ways to visualise these results.

## What we'll do soon

### Design

* Customise our visualizations so that they're powerful and can be nicely combined with each other

### User Experience

* Figure out how to organise our various visualizations so that the user can easily navigate through it

### Misc.

* Meeting with politician Philippe Nantermod to discuss what he thinks would be good. Re-send questions to others.