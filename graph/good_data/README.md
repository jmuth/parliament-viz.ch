# Data

+ *adj_cosign.csv*: adjacency matrix for co-signing relationships. NOT SYMMETRIC: a row shows who cosigned motions written by that row's PersonIdCode.

+ *adj_intervention.csv*: adjacency matrix for common interventions. Symmetric.

+ *adj.csv*: an empty (0 everywhere) adj matrix indexed by PersonIdCode

+ *friends_cosign.json*: each person's 5 best cosigners

+ *friends.json*: each person's 5 best "friends" in terms of common interventions

+ *int_year.csv*: nbr of interventions for each year per PersonIdCode

+ *n_int_per_session.csv*: nbr of interventions per session

+ *people.csv*: latest table with info on each person, contains both PersonIdCode and PersonNumber. Some stats at the end, along with the svg positions for the parliament seats.

+ *year_ints2.json*: json version of *int_year.csv*, contains the median information

+ *year_medians.csv*: calculated medians for nbr of interventions per year and per council.