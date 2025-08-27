import pandas as pd

def extract_fields(form_row):
    try:
        form_fields = form_row.split('\n(')
    except:
        return(False)

    parsed_fields = []
    for field in form_fields:
        if ')' in field:
            type =field[field.find("(")+1:field.find(")")]
            #print('------'+field)
            field = field.split(type+') ')[1]
            parsed_fields.append([type, field])
    
    return(parsed_fields)


submissions = pd.read_csv('submission.csv')
submissions.reset_index(drop=True, inplace=True)

# Filter by track, select Research, Posters and Demos, and Industry
submissions = submissions.loc[submissions['track name'].isin(['sem24-research', 'sem24-pd', 'sem24-industry'])]

# Select accepted papers
submissions = submissions.loc[submissions['decision'] == 'accept']

# Add new columns
submissions['url'] = ""
submissions['doi'] = ""
submissions['img'] = ""

# Save filtered file
submissions.to_csv('submission.csv', index=False)

# New dataframe with separated values from the column 'form fields'
sub_res = pd.DataFrame(columns=['submission','field','field_name','value','license','license_url','name','type','description','doi'])

field_names = {
    'Paper Type': '1',
    'Student': '2',
    'Publication Resources': '3',
    'Code Availability': '4',
    'Data Availability': '5',
    'Ontology Availability': '6',
    'Demo link': '7',
    'ORKG': '8'
}

# Insert rows in sub_red dataframe for values extracted from the column 'form fields' of submissions dataframe
for index, row in submissions.iterrows(): 
    res = extract_fields(row['form fields'])
    if not res:
        continue

    for fields in res:
        new_row = {
            'submission': str(row
            ['ID']),
            'field': field_names[fields[0]],
            'field_name': fields[0],
            'value': fields[1],
            'license': '',
            'license_url': '',
            'name': '',
            'type': '',
            'description': '',
            'doi': ''
        }
        sub_res.loc[len(sub_res)] = new_row

        sub_res.to_csv('submission_field_value.csv', index=False)