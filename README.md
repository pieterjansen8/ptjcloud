#ptjcloud

## How does it work?
the ptjcloud backend is fully build on supabase!
(the auth, storage, etc), 
all builded with the Nextjs framework with typescript.
wich make everything super fast!
## Want to run on your local pc?
no problem!
first clone the project.
```
git clone https://github.com/pieterjansen8/ptjcloud.git
```
then run  "your package manager" install 
```
npm install 

//

pnpm install
```
then add a `.env` file to your project. wich includes your
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=youranonkey
NEXT_PUBLIC_SUPABASE_URL=yourhosturl
```
then run your dev server.
```
npm run dev
 
// 

pnpm run dev
```
### or better go to https://ptjcloud.vercel.app for the latest version