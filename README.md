# Guardiao Digital

MVP do app Guardiao Digital (iOS/Android) com fluxo inicial e autenticacao via Firebase.

## Requisitos
- Node.js LTS
- Expo CLI (via `npx expo`)

## Instalar
```
npm install
```

## Configurar Firebase
1) Crie um projeto no Firebase.
2) Ative **Authentication > Email/Password**.
3) Em **Project Settings > General**, crie um app **Web**.
4) Copie as credenciais para `src/firebaseConfig.js`.

Exemplo:
```
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

## Rodar
```
npm start
```

## Estrutura
- `App.js`: UI principal + login/cadastro
- `src/firebase.js`: inicializacao do Firebase Auth
- `src/firebaseConfig.js`: chaves do Firebase (nao subir com dados reais em repos publicos)

## Observacoes
- Troque as chaves por variaveis de ambiente antes de publicar.
- Para producao, usar regras de seguranca no Firestore.
