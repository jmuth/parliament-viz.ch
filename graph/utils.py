from bs4 import BeautifulSoup as BSoup

def get_active_ids(data):
    # takes the json data made by Gael and extracts active ids
    active_ids = []
    for i in data['nodes']:
        active_ids.append(int(i['PersonIdCode']))
    return active_ids

def person_number_to_id(active_ids, ppl):
    # builds a mapping between active ids and person numbers
    dico = {}
    active_numbers = []
    for row in ppl.iterrows():
        row = row[1]
        id_code = int(row['PersonIdCode'])
        number = row['PersonNumber']
        if id_code in active_ids:
            dico[number] = id_code
            active_numbers.append(number)
    return dico, active_numbers

def to_text(text):
    soup = BSoup(text, 'lxml')
    text = soup.get_text().replace('\n', ' ').replace("\'", "'")
    return text