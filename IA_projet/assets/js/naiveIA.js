
/* IA fonctionnel à benchmark */
function ia11(terrain,liste) {
    let max = largeur * hauteur; //Le nombre de case max pour les stats
    let k = 0; //nb coups
    let int8 = Array(largeur).fill([]).map((x) => x = Array(hauteur).fill(128)); //création d'une matrice contenant des valeurs inatteignables
    let random;
    for (let x = 0; x < largeur; x++) {
        liste[x].fill(0);
    }
    while (k < max) {  //on s'arrête quand il n'y a plus de cases non minées (normalement, on a déja perdu ou gagné avant de sortir de la boucle)
        let min = [Number.MAX_SAFE_INTEGER, 0, 0]; //on met la plus grande valeur possible pour être sur (mais bon, c'est une valeur arbitraire)
        distribuXtoVoisin(int8,terrain,liste); //on répartit les valeurs
        ban(int8,terrain,liste); //on discrimine les potentielles mines
        deban(terrain,liste);
        distribuXtoVoisin(int8,terrain,liste);
        choice(int8, min,liste); //on choisit le cas la plus safe
        if(matrice_cases_cliques[min[1]][min[2]] === 1){
            random = selectRandomSquare();
            min[1] = random[0];
            min[2] = random[1];
        }
        if(clic_case(min[1], min[2], "gauche") === -1)return -1; //on clique dessus
        explorer(); //s'il y a des cases avec comme valeur 0.
        k++;
    }
    nulle++;
    return -1;
}
/**
 * Le but de distribuXVoisin est de répartir la valeur
 * (la valeur correspond compte_voisins() au nombre de mine(s) adjacente(s)) d'une case explorée
 * à des cases non explorées (et donc potentiellement à une mine).
 * Plus cette somme est élevé, moins on a de chance de cliquer dessus.
 * */
function distribuXtoVoisin(tableau,terrain,liste) {
    for (let x = 0; x < largeur; x++) {//on parcourt
        for (let y = 0; y < hauteur; y++) {
            let value = terrain[x][y] = matrice_cases_cliques[x][y]*matrice_nombre_voisins[x][y];
            if (value !== 0) { //répartir une case non explorée, c'est inutile et les cases valant 0 ne nous donne aucune info sur des mines
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {//on répartit aux cases adjacentes
                            if(matrice_cases_cliques[x+i][y+j] !== 1) tableau[x + i][y + j] %= 128; //on lui donne une chance d'être explore
                            if (liste[x + i][y + j] !== 1) tableau[x + i][y + j] += value; //on ne veut pas que les potentielles mines soient selectionnées (je vais modifié ça aussi)
                        }
                    }
                }
            }
            if (tableau[x][y] === 0 || matrice_cases_cliques[x][y] === 1) tableau[x][y] = NaN; //on met NaN (Not a Number) pour ne pas cliquer dessus
        }
    }
}


function ban(tableau,terrain,liste) {
    for (let x = 0; x < largeur; x++) {
        for (let y = 0; y < hauteur; y++) {
            if (tableau[x][y] !== 255 && !isNaN(tableau[x][y])) { //on enlève les cases non explorées
                let k = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {
                            k += (isNaN(tableau[x + i][y + j])); //on compte le nombre de case adjacente qui ont été exploré
                        }
                    }
                }
                if (tableau[x][y] >= k) { //c'est potentiellement une mine
                    liste[x][y] = 1;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {
                                terrain[x+i][y+j] -=1;
                            }
                        }
                    }
                }

            }
        }
    }
}

function deban(terrain, liste) {
    for (let x = 0; x < largeur; x++) {
        for (let y = 0; y < hauteur; y++) {
            if (liste[x][y] === 1) {
                let k = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {
                            if (terrain[x + i][y + j] === 0) k++;
                        }
                    }
                }
                if (k === 0) liste[x][y] = 0;
            }
        }
    }
}

/**
 * on choisit la case la plus safe d'après nos calculs
 * */
function choice(int8, min,liste) {
    for (let x = 0; x < largeur; x++) {//on parcourt
        for (let y = 0; y < hauteur; y++) {
            if (int8[x][y] < min[0] && liste[x][y] !== 1) { //on veut la plus petite valeur càd, celle qui a le moins de chance d'être une mine
                min[0] = int8[x][y];
                min[1] = x;
                min[2] = y;
            }
        }
    }
}