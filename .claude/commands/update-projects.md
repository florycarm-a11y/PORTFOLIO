Mets à jour la liste des projets du portfolio :

1. Récupère mes repos publics GitHub via `gh repo list florycarm-a11y --public --json name,description,url,homepageUrl,languages --limit 20`
2. Pour chaque repo qui a une description, crée une entrée dans data/projects.json avec :
   - name : nom du repo
   - description : description GitHub
   - tags : les langages principaux du repo
   - url : URL du repo
   - homepage : homepageUrl (ou null si absent)
3. Trie les projets par pertinence (les plus complets d'abord)
4. Écris le fichier data/projects.json mis à jour
5. Montre-moi le diff avant de commit
