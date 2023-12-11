// Fonction pour générer une grille vide 3x3
function genererGrilleVide() {
    return Array.from({ length: 3 }, () => Array(3).fill(0));
  }
  
  // Fonction pour placer aléatoirement une quantité spécifiée de mines dans la grille
  function placerMines(grille, nombreDeMines) {
    const flatGrille = grille.flat();
    for (let i = 0; i < nombreDeMines; i++) {
      let minePlacee = false;
      while (!minePlacee) {
        const index = Math.floor(Math.random() * flatGrille.length);
        if (flatGrille[index] === 0) {
          flatGrille[index] = 1;
          minePlacee = true;
        }
      }
    }
  }
  
  // Fonction pour calculer le nombre de voisins pour chaque case
  function calculerNombreVoisins(grille) {
    const rows = grille.length;
    const cols = grille[0].length;
    const voisins = genererGrilleVide();
  
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grille[i][j] === 1) {
          // La case est une mine, incrémenter les voisins des cases adjacentes
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const ni = i + dx;
              const nj = j + dy;
              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && grille[ni][nj] !== 1) {
                voisins[ni][nj]++;
              }
            }
          }
        }
      }
    }
  
    return voisins;
  }
  
  // Fonction pour simuler le calcul des probabilités pour une configuration spécifique
  function simulerProbabilitesFixes(grille, casesDecouvertes, nombreDeMines, nombreEssais) {
    const probabilites = genererGrilleVide();
  
    for (let essai = 0; essai < nombreEssais; essai++) {
      const grilleMines = genererGrilleVide();
      placerMines(grilleMines, nombreDeMines);
      const voisins = calculerNombreVoisins(grilleMines);
  
      // Découverte des cases spécifiées
      for (const [rowDecouverte, colDecouverte] of casesDecouvertes) {
        if (grille[rowDecouverte][colDecouverte] !== 1) {
          probabilites[rowDecouverte][colDecouverte]++;
        }
      }
  
      // Simulation des découvertes aléatoires
      for (let i = 0; i < grille.length; i++) {
        for (let j = 0; j < grille[0].length; j++) {
          if (!casesDecouvertes.some(coord => coord[0] === i && coord[1] === j)) {
            if (Math.random() < 0.2) {  // 20% de chance de découvrir une case
              if (grilleMines[i][j] !== 1) {
                probabilites[i][j]++;
              }
            }
          }
        }
      }
    }
  
    // Normaliser les probabilités par le nombre d'essais
    for (let i = 0; i < probabilites.length; i++) {
      for (let j = 0; j < probabilites[0].length; j++) {
        probabilites[i][j] /= nombreEssais;
      }
    }
  
    return probabilites;
  }
  
  // Fonction pour calculer la moyenne des probabilités pour chaque case de la grille
  function calculerMoyenneProbabilites(grille, nombreDeMines, nombreCasesDecouvertes, nombreEssais) {
    const moyennesProbabilitesTotales = genererGrilleVide();
  
    // Générer toutes les combinaisons possibles de cases découvertes
    const casesDecouvertesArray = [];
    for (let i = 0; i < grille.length; i++) {
      for (let j = 0; j < grille[0].length; j++) {
        casesDecouvertesArray.push([i, j]);
      }
    }
  
    const combinaisons = getCombinations(casesDecouvertesArray, nombreCasesDecouvertes);
  
    for (const combinaison of combinaisons) {
      const grilleCopie = JSON.parse(JSON.stringify(grille));
      const probabilites = simulerProbabilitesFixes(grilleCopie, combinaison, nombreDeMines, nombreEssais);
  
      // Additionner les probabilités pour chaque case dans le tableau des moyennes
      for (let i = 0; i < grille.length; i++) {
        for (let j = 0; j < grille[0].length; j++) {
          moyennesProbabilitesTotales[i][j] += probabilites[i][j];
        }
      }
    }
  
    // Calculer la moyenne des probabilités pour chaque case
    for (let i = 0; i < moyennesProbabilitesTotales.length; i++) {
      for (let j = 0; j < moyennesProbabilitesTotales[0].length; j++) {
        moyennesProbabilitesTotales[i][j] /= combinaisons.length;
      }
    }
  
    return moyennesProbabilitesTotales;
  }
  
  // Fonction pour générer toutes les combinaisons possibles de cases découvertes
  function getCombinations(arr, r) {
    const result = [];
    const chosen = Array(r).fill(0);
  
    function permute(index, start) {
      if (index === r) {
        result.push(chosen.map(i => arr[i]));
        return;
      }
  
      for (let i = start; i < arr.length; i++) {
        chosen[index] = i;
        permute(index + 1, i + 1);
      }
    }
  
    permute(0, 0);
  
    return result;
  }
  
  // Générer et afficher les moyennes des probabilités pour chaque configuration demandée
  const nombreEssais = 10000;
  
  for (let nombreDeMines = 1; nombreDeMines <= 5; nombreDeMines++) {
    for (let nombreCasesDecouvertes = 1; nombreCasesDecouvertes <= 2; nombreCasesDecouvertes++) {
      console.log(`Nombre de mines : ${nombreDeMines}, Cases découvertes : ${nombreCasesDecouvertes}`);
  
      // Initialiser le tableau des cases découvertes
      const grille = genererGrilleVide();
  
      // Calcul des moyennes des probabilités pour chaque case
      const moyennesProbabilites = calculerMoyenneProbabilites(grille, nombreDeMines, nombreCasesDecouvertes, nombreEssais);
      
      // Afficher les moyennes des probabilités pour chaque case
      console.log("Moyennes des probabilités pour chaque case :");
      for (let i = 0; i < moyennesProbabilites.length; i++) {
        const row = moyennesProbabilites[i].map(probabilite => probabilite.toFixed(4)); // Ajoutez cette ligne pour arrondir à 4 chiffres après la virgule
        console.log(row);
      }   
    }
  }
  