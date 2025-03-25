# Étape de construction
FROM node:18-alpine AS build
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
RUN npm ci

# Copier le code source
COPY . .

# Compiler l'application pour la production
RUN npm run build -- --configuration=production

# Étape d'exécution
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Supprimer la configuration par défaut de Nginx et ajouter notre configuration personnalisée
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers compilés depuis l'étape de construction
COPY --from=build /app/dist/frontend .

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"] 