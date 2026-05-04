# Ferme Avicole Next.js

Application monolithique Next.js pour piloter une ferme avicole, avec frontend et backend dans le meme projet.

## Stack

- Next.js `14.2.35`
- React `18.2.0`
- Prisma `5.22.0`
- PostgreSQL multi-schema
- Auth par cookies `httpOnly`

## Base de donnees

Le projet utilise la base locale suivante :

```env
DATABASE_URL="postgresql://nou-fy:admin@localhost:5432/micro_ser_elevage"
```

Cette valeur est deja renseignee dans [`.env`](./.env).

## Fonctionnalites migrees

- Authentification utilisateur
- Abonnements et paiements
- Gestion des animaux
- Suivi sante et notifications
- Enclos et affectations
- Oeufs et ventes
- Couvaison
- Alimentation
- Clients, commandes et finances
- Configuration metier

## Lancer le projet

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Application :

- Frontend: `http://localhost:3000`
- API Next.js: `http://localhost:3000/api/...`

## Scripts utiles

```bash
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run db:push
npm run db:seed
npm run db:reset
```

## Notes de migration

- Docker, Docker Compose, RabbitMQ et les microservices separes ont ete retires.
- Le `farmId` est actuellement aligne sur `user.id`, car le schema existant ne contient pas de table `Farm`.
- Le seed cree les plans d'abonnement et les constantes metier de base.

## Verification

Build validee avec :

```bash
npm run build
```

Audit restant :

- `npm audit --omit=dev` signale encore des avis de securite sur la branche Next `14.x`.
- Le correctif automatique propose un passage a `next@16.2.4`, qui est une mise a jour majeure et n'a pas ete forcee ici.
# fermeAvicole
