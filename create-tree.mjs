// create-tree.mjs
import { promises as fs } from "fs";
import path from "path";

const tree = {
  src: {
    "main.js": "/* entry */\n",
    "App.vue": `<template>\n  <router-view />\n</template>\n`,
    assets: {
      "tailwind.css": "/* tailwind */\n",
    },
    router: {
      "index.js": `export default {};\n`,
    },
    stores: {
      "useAuth.js": `export const useAuth = () => ({});\n`,
    },
    components: {
      layout: {
        "AppLayout.vue": `<template><slot /></template>\n`,
        "Navbar.vue": `<template><nav>Navbar</nav></template>\n`,
        "Sidebar.vue": `<template><aside>Sidebar</aside></template>\n`,
      },
      ui: {
        "PageShell.vue": `<template><section class="p-4"><slot/></section></template>\n`,
      },
    },
    pages: {
      dashboard: {
        "DashboardHome.vue": `<template><div>DashboardHome</div></template>\n`,
        "DashboardAcademique.vue": `<template><div>DashboardAcademique</div></template>\n`,
        "DashboardFinances.vue": `<template><div>DashboardFinances</div></template>\n`,
      },
      communautes: {
        "ElevesList.vue": `<template><div>ElevesList</div></template>\n`,
        "ElevesNew.vue": `<template><div>ElevesNew</div></template>\n`,
        "ElevesDetail.vue": `<template><div>ElevesDetail</div></template>\n`,
        "ProfsList.vue": `<template><div>ProfsList</div></template>\n`,
        "ProfsNew.vue": `<template><div>ProfsNew</div></template>\n`,
        "ProfsDetail.vue": `<template><div>ProfsDetail</div></template>\n`,
        "ParentsList.vue": `<template><div>ParentsList</div></template>\n`,
        "ParentsNew.vue": `<template><div>ParentsNew</div></template>\n`,
        "ParentsDetail.vue": `<template><div>ParentsDetail</div></template>\n`,
      },
      academique: {
        "ClassesList.vue": `<template><div>ClassesList</div></template>\n`,
        "ClassesNew.vue": `<template><div>ClassesNew</div></template>\n`,
        "ClassesDetail.vue": `<template><div>ClassesDetail</div></template>\n`,
        "Filieres.vue": `<template><div>Filieres</div></template>\n`,
        "Niveaux.vue": `<template><div>Niveaux</div></template>\n`,
        "FiliereNiveau.vue": `<template><div>FiliereNiveau</div></template>\n`,
        "EmploisGlobal.vue": `<template><div>EmploisGlobal</div></template>\n`,
        "EmploisMes.vue": `<template><div>EmploisMes</div></template>\n`,
        "EmploisClasse.vue": `<template><div>EmploisClasse</div></template>\n`,
      },
      pedagogie: {
        "CoursList.vue": `<template><div>CoursList</div></template>\n`,
        "CoursNew.vue": `<template><div>CoursNew</div></template>\n`,
        "CoursDetail.vue": `<template><div>CoursDetail</div></template>\n`,
        "DevoirsList.vue": `<template><div>DevoirsList</div></template>\n`,
        "InterrosList.vue": `<template><div>InterrosList</div></template>\n`,
        "ExamensList.vue": `<template><div>ExamensList</div></template>\n`,
        "NotesSaisie.vue": `<template><div>NotesSaisie</div></template>\n`,
        "BulletinsList.vue": `<template><div>BulletinsList</div></template>\n`,
        "BulletinsSearch.vue": `<template><div>BulletinsSearch</div></template>\n`,
      },
      presence: {
        "PresencesMarque.vue": `<template><div>PresencesMarque</div></template>\n`,
        "PresencesList.vue": `<template><div>PresencesList</div></template>\n`,
        "PresencesStats.vue": `<template><div>PresencesStats</div></template>\n`,
      },
      discipline: {
        "IncidentsList.vue": `<template><div>IncidentsList</div></template>\n`,
        "SanctionsList.vue": `<template><div>SanctionsList</div></template>\n`,
      },
      finances: {
        "FraisList.vue": `<template><div>FraisList</div></template>\n`,
        "FraisNew.vue": `<template><div>FraisNew</div></template>\n`,
        "PaiementsList.vue": `<template><div>PaiementsList</div></template>\n`,
        "RecusList.vue": `<template><div>RecusList</div></template>\n`,
      },
      ressources: {
        "Bibliotheque.vue": `<template><div>Bibliotheque</div></template>\n`,
        "Prets.vue": `<template><div>Prets</div></template>\n`,
        "Salles.vue": `<template><div>Salles</div></template>\n`,
        "Materiel.vue": `<template><div>Materiel</div></template>\n`,
      },
      comm: {
        "MessagesList.vue": `<template><div>MessagesList</div></template>\n`,
        "MessageNew.vue": `<template><div>MessageNew</div></template>\n`,
        "Notifications.vue": `<template><div>Notifications</div></template>\n`,
        "Annonces.vue": `<template><div>Annonces</div></template>\n`,
      },
      rapports: {
        "AcadRapports.vue": `<template><div>AcadRapports</div></template>\n`,
        "PresenceRapports.vue": `<template><div>PresenceRapports</div></template>\n`,
        "FinanceRapports.vue": `<template><div>FinanceRapports</div></template>\n`,
        "Exports.vue": `<template><div>Exports</div></template>\n`,
      },
      calendrier: {
        "Periodes.vue": `<template><div>Periodes</div></template>\n`,
        "Semestres.vue": `<template><div>Semestres</div></template>\n`,
      },
      admin: {
        "EcolesList.vue": `<template><div>EcolesList</div></template>\n`,
        "UsersList.vue": `<template><div>UsersList</div></template>\n`,
        "Licences.vue": `<template><div>Licences</div></template>\n`,
        "Factures.vue": `<template><div>Factures</div></template>\n`,
        "CreerCompte.vue": `<template><div>CreerCompte</div></template>\n`,
      },
      systeme: {
        "Setup.vue": `<template><div>Setup</div></template>\n`,
        "AnneeScolaire.vue": `<template><div>AnneeScolaire</div></template>\n`,
        "Securite.vue": `<template><div>Securite</div></template>\n`,
      },
      auth: {
        "Login.vue": `<template><div>Login</div></template>\n`,
      },
      "NotFound.vue": `<template><div>404</div></template>\n`,
    },
    types: {
      "roles.js": `export type Role = 'admin_generale'|'admin_ecole'|'professeur'|'eleve';\n`,
    },
  },
};

async function pathExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v = true] = a.replace(/^--/, '').split('=');
    return [k, v === 'true' ? true : v === 'false' ? false : v];
  })
);
// --base=CHEMIN (par défaut: process.cwd())
// --dry-run (true/false)
const baseRoot = path.resolve(args.base || process.cwd());
const DRY_RUN = !!args['dry-run'];

async function ensureDir(dir) {
  if (DRY_RUN) { console.log(`(dry) 📁 ${dir}`); return; }
  await fs.mkdir(dir, { recursive: true });
}
async function createFileIfMissing(filePath, content = "") {
  if (await pathExists(filePath)) {
    console.log(`⏭️  Existant, on saute: ${filePath}`);
    return;
  }
  if (DRY_RUN) { console.log(`(dry) ✅ ${filePath}`); return; }
  await fs.writeFile(filePath, content, "utf8");
  console.log(`✅ Fichier créé: ${filePath}`);
}

async function walk(base, node) {
  await ensureDir(base);
  for (const [name, value] of Object.entries(node)) {
    const target = path.join(base, name);
    if (value && typeof value === "object") {
      // dossier
      await ensureDir(target);
      console.log(`📁 Dossier OK: ${target}`);
      await walk(target, value); // descendre pour ajouter ce qui manque
    } else {
      // fichier
      const content = typeof value === "string" ? value : "";
      await createFileIfMissing(target, content);
    }
  }
}

(async () => {
  await walk(baseRoot, tree);
  console.log(`\n✨ Terminé (base=${baseRoot})${DRY_RUN ? ' [dry-run]' : ''}`);
})();
// Tu peux exécuter ce script avec `node create-tree.mjs`