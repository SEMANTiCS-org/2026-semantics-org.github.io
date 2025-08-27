from rdflib import Graph, Namespace, Literal
from rdflib.namespace import RDF, RDFS
from rdflib.plugins.sparql import prepareQuery
import matplotlib.pyplot as plt

schema = Namespace("https://schema.org/")
okn = Namespace("https://w3id.org/okn/semantics/i/")
g = Graph()
g.parse("../rdf/out.nt", format="ntriples")
g.serialize("out.ttl",format='ttl')

# Result lists for plots
res_labels = []
res_r = []
res_pd = []

# How many papers were submitted?
q1 = prepareQuery('''
  SELECT (count(distinct ?paperTitleR) as ?cr) (count(distinct ?paperTitlePD) as ?cpd) (count(distinct ?paperTitleI) as ?ci) WHERE {
    ?resourceR a schema:ScholarlyArticle ;
      schema:name ?paperTitleR ;
      schema:isPartOf okn:Track_2 .
    ?resourcePD a schema:ScholarlyArticle ;
      schema:name ?paperTitlePD ;
      schema:isPartOf okn:Track_3 .
    ?resourceI a schema:ScholarlyArticle ;
      schema:name ?paperTitleI ;
      schema:isPartOf okn:Track_5 .
  }
  ''', initNs = { "schema":schema, "okn":okn})
for r in g.query(q1):
  print("Number of accepted papers: ",r.cr+r.cpd+r.ci)
  total_r = r.cr.value
  total_pd = r.cpd.value

# How many papers had resources?
q1 = prepareQuery('''
  SELECT (count(distinct ?pr) as ?cr) (count(distinct ?ppd) as ?cpd) WHERE {
    ?pr a schema:ScholarlyArticle;
       schema:hasPart ?resourcer;
      schema:isPartOf okn:Track_2.
    ?ppd a schema:ScholarlyArticle;
       schema:hasPart ?resourcepd;
      schema:isPartOf okn:Track_3.
  }
  ''', initNs = { "schema":schema, "okn":okn})
for r in g.query(q1):
  print("Number of papers with resources: ", r.cr+r.cpd)
res_labels.append('With resources')
res_r.append(r.cr.value / total_r * 100)
res_pd.append(r.cpd.value/ total_pd * 100)

# Number of resources by type
q1 = prepareQuery('''
SELECT (count(distinct ?resource) as ?c) ?type  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  ?resource a ?type.
}group by ?type
  ''', initNs = { "schema":schema, "okn":okn})

print("Papers with resources:")
for r in g.query(q1):
  print(r.type, r.c)

# Resources with license
q1 = prepareQuery('''
SELECT (count(distinct ?resource) as ?c)  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  ?resource schema:license ?l.
}
  ''', initNs = { "schema":schema, "okn":okn})

for r in g.query(q1):
  print("Resources with license: ", r.c)

# Papers with resources with license
q1 = prepareQuery('''
  SELECT (count(distinct ?pr) as ?cr) (count(distinct ?ppd) as ?cpd) WHERE {
  ?pr a schema:ScholarlyArticle;
     schema:hasPart ?resourcer;
      schema:isPartOf okn:Track_2.
  ?resourcer schema:license ?lr.
  ?ppd a schema:ScholarlyArticle;
     schema:hasPart ?resourcepd;
      schema:isPartOf okn:Track_2.
  ?resourcepd schema:license ?pd.
}
  ''', initNs = { "schema":schema, "okn":okn})

for r in g.query(q1):
  print("Papers with resources with license: ", r.cr+r.cpd)
res_labels.append('With resources with license')
res_r.append(r.cr.value / total_r * 100)
res_pd.append(r.cpd.value/ total_pd * 100)

# Papers with no license in some resources
q1 = prepareQuery('''
SELECT (count(distinct ?p) as ?c)  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  filter not exists{?resource schema:license ?l.}
}
  ''', initNs = { "schema":schema, "okn":okn})

for r in g.query(q1):
  print("Papers with no license in some resource: ", r.c)

# Resources with DOIs
q1 = prepareQuery('''
SELECT (count(distinct ?resource) as ?c)  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  ?resource schema:identifier ?i.
}
  ''', initNs = { "schema":schema, "okn":okn})

for r in g.query(q1):
  print("Resources with DOIs: ", r.c)


# Papers with DOIs on their resources
q1 = prepareQuery('''
  SELECT (count(distinct ?pr) as ?cr) (count(distinct ?ppd) as ?cpd) WHERE {
  ?pr a schema:ScholarlyArticle;
     schema:hasPart ?resourcer;
     schema:isPartOf okn:Track_2.
  ?resourcer schema:identifier ?ir.
  ?ppd a schema:ScholarlyArticle;
     schema:hasPart ?resourcepd;
     schema:isPartOf okn:Track_3.
  ?resourcepd schema:identifier ?ipd.
}
  ''', initNs = { "schema":schema, "okn":okn})

for r in g.query(q1):
  print("Papers with resources with DOIs: ", r.cr+r.cpd)
res_labels.append('With resources with doi')
res_r.append(r.cr.value / total_r * 100)
res_pd.append(r.cpd.value/ total_pd * 100)


# How many papers use GitHub to store their data?
q1 = prepareQuery('''
SELECT (count(distinct ?p) as ?c)  WHERE {
  ?p a schema:ScholarlyArticle;
     schema:hasPart ?resource.
  ?resource a schema:Dataset;
    schema:url ?u.
  filter(CONTAINS(LCASE(STR(?u)),"github.com"))
}
  ''', initNs = { "schema":schema, "okn":okn})

for r in g.query(q1):
  print("Papers storing data in GitHub: ", r.c)
res_labels.append('With resources with URI')
res_r.append(r.c.value / total_r * 100)
res_pd.append(0)


## Figures



plt.figure(figsize=(4,3))
bars = plt.bar(res_labels, res_r, color='#4895ef')
plt.xticks(range(len(res_labels)), list(res_labels), rotation=45, ha='right')
plt.ylabel('Percentage of papers')
plt.ylim((0,100))
plt.title('Research papers')

for bar in bars:
    height = bar.get_height()
    percentage = str(round(height,2)) + '%'
    plt.text(bar.get_x() + bar.get_width() / 2, height, percentage, ha='center', va='bottom')

plt.savefig('plots/research.png',dpi=400,bbox_inches = "tight")


plt.figure(figsize=(4,3))
bars = plt.bar(res_labels, res_pd, color='#4895ef')
plt.xticks(range(len(res_labels)), list(res_labels), rotation=45, ha='right')
plt.ylabel('Percentage of papers')
plt.ylim((0,100))
plt.title('Posters and demos')

for bar in bars:
    height = bar.get_height()
    percentage = str(round(height,2)) + '%'
    plt.text(bar.get_x() + bar.get_width() / 2, height, percentage, ha='center', va='bottom')

plt.savefig('plots/posters.png',dpi=400,bbox_inches = "tight")
