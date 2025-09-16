#!/bin/bash
echo "Message du commit : "
read msg
git add .
git commit -m "$msg"
git push
npm run deploy
echo "Déploiement terminé !"