Exécute la checklist de déploiement avant de pousser sur main :

1. Lance `bash scripts/audit.sh` et vérifie que tout passe
2. Vérifie que le HTML est valide (pas de balises non fermées)
3. Vérifie que le JSON de data/projects.json est valide
4. Vérifie que blog/index.json est valide (s'il existe)
5. Vérifie qu'aucun fichier sensible n'est dans le staging git
6. Montre un résumé des changements à déployer (git diff --stat)
7. Demande confirmation avant de push
