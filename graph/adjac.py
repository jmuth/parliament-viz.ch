import pandas as pd
import json, itertools
import time


#### FUNCTIONS ####
def get_active_ids(data):
    active_ids = []
    for i in data['nodes']:
        active_ids.append(str(int(i['PersonIdCode'])))
    return active_ids

def person_number_to_id(active_ids, ppl):
    dico = {}
    active_numbers = []
    for row in ppl.iterrows():
        row = row[1]
        id_code = str(int(row['PersonIdCode']))
        number = row['PersonNumber']
        if id_code in active_ids:
            dico[number] = id_code
            active_numbers.append(number)
    return dico, active_numbers

def combine(l, n):
    # gets all permutated n-uples out of the list l
    return list(itertools.combinations(l, n))

def update_adj(adj, pair):
    # updates adjacency matrix
    # creates weighted adj matrix
    try:
        adj.loc[pair[0], str(pair[1])] += 1
        adj.loc[pair[1], str(pair[0])] += 1
        #print('adj updated')
    except:
        #print('adj: not an active pair')
        pass
    #print(' ')
###################
###################

with open('data/active.json') as data_file:
	data = json.load(data_file)

active_ids = get_active_ids(data)

ppl = pd.read_csv('data/Person.csv').dropna(axis=0, subset=['PersonNumber', 'PersonIdCode'])

df = pd.read_csv('data/Transcript.csv', skiprows=range(1, 180000)).dropna(axis=0, subset=['End', 'PersonNumber', 'IdSubject'])

adj = pd.read_csv('data/adj.csv').set_index('PersonNumber')
subjects = df['IdSubject'].unique().tolist()
dico, active_numbers = person_number_to_id(active_ids, ppl)
print('#subjects: '+str(len(subjects)))

#### THE PROCESS ####
def populate_adj(adj, df, dico, active_numbers, subjects):
	print('starting process')
	start_time = time.time()
	for subj in subjects:
		one = df.loc[df.IdSubject == subj]
		people = one.PersonNumber.unique().tolist()
		pairs = combine(people, 2)
		if len(pairs) > 0:
			for pair in pairs:
				if (pair[0] in active_numbers) and (pair[1] in active_numbers):
					pair = [int(dico[pair[0]]), int(dico[pair[1]])]
					#print(pair)
					update_adj(adj, pair)
		print('subject '+str(subj)+' done!')
	end_time = time.time()
	print('time elapsed: '+str(end_time-start_time))
	return adj
#####################

adja = populate_adj(adj, df, dico, active_numbers, subjects)
adja.to_csv('data/adja_util.csv')