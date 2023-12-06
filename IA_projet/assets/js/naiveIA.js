/* IA fonctionnel à benchmark */
function ia11() {
    let max = largeur * hauteur; //Le nombre de case max pour les stats
    let k = 0; //nb coups
    let int8 = Array(largeur).fill([]).map((x) => x = Array(hauteur).fill(255)); //création d'une matrice contenant des valeurs inatteignables
    let terrain = [];
    for (let x = 0; x < largeur; x++) {
        terrain[x] = new Int8Array(hauteur);
    }
    while (nombre_cases_non_minees_restantes() !== 0 && (k < max)) {  //on s'arrête quand il n'y a plus de cases non minées (normalement, on a déja perdu ou gagné avant de sortir de la boucle)
        let min = [Number.MAX_SAFE_INTEGER, 0, 0]; //on met la plus grande valeur possible pour être sur (mais bon, c'est une valeur arbitraire)
        for (let x = 0; x < largeur; x++) { //on parcourt chaque case de la grille
            for (let y = 0; y < hauteur; y++) {
                terrain[x][y] = matrice_cases_cliques[x][y]*matrice_nombre_voisins[x][y];
                if (terrain[x][y] !== 0) { //si elle n'est pas exploré (value == "") donc on n'en veut pas
                    if (int8[x][y] === 0 || matrice_cases_cliques[x][y] === 1) int8[x][y] = NaN; //on met NaN (Not a Number) pour ne pas cliquer dessus
                }
            }
        }
        distribuXtoVoisin(int8,terrain); //on répartit les valeurs
        compteNan(int8); //on discrimine les potentielles mines
        min = choice(int8, min); //on choisit le cas la plus safe
        if(clic_case(min[1], min[2], "gauche")===false)return; //on clique dessus
        explorer(); //s'il y a des cases avec comme valeur 0.
        k++;
    }
}
/**
 * Le but de distribuXVoisin est de répartir la valeur
 * (la valeur correspond compte_voisins() au nombre de mine(s) adjacente(s)) d'une case explorée
 * à des cases non explorées (et donc potentiellement à une mine).
 * Plus cette somme est élevé, moins on a de chance de cliquer dessus.
 * */
function distribuXtoVoisin(tableau,terrain) {
    for (let x = 0; x < largeur; x++) {//on parcourt
        for (let y = 0; y < hauteur; y++) {
            let value = terrain[x][y]
            if (value !== 0) { //répartir une case non explorée, c'est inutile et les cases valant 0 ne nous donne aucune info sur des mines
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {//on répartit aux cases adjacentes
                            tableau[x + i][y + j] %= 255; //on lui donne une chance d'être explore
                            if (tableau[x + i][y + j] != -1) tableau[x + i][y + j] += value; //on ne veut pas que les potentielles mines soient selectionnées (je vais modifié ça aussi)
                        }
                    }
                }
            }
        }
    }
}
/**
 * on choisit la case la plus safe d'après nos calculs
 * */
function choice(int8, min) {
    for (let x = 0; x < largeur; x++) {//on parcourt
        for (let y = 0; y < hauteur; y++) {
            if (int8[x][y] < min[0] && int8[x][y] > 0) { //on veut la plus petite valeur càd, celle qui a le moins de chance d'être une mine
                min[0] = int8[x][y];
                min[1] = x;
                min[2] = y;
            }
        }
    }
    return min;
}

function compteNan(tableau) {
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
                    tableau[x][y] = -1; //(je vais aussi modifier ça avec une liste)
                }

            }
        }
    }
}