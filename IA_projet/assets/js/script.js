let nb_mines;
let largeur;
let hauteur;
let nombre_cliques;
let matrice_mines;
let matrice_nombre_voisins;
let matrice_cases_cliques;
let matrice_drapeaux;

/// CHOIX DIFFICULTE ///

function choix_difficulte() {
    let difficulte = new URLSearchParams(window.location.search).get("difficulte");

    if (difficulte === "expert") {
        nb_mines = 99;
        largeur = 16;
        hauteur = 30;
    }
    else if (difficulte === "intermediaire") {
        nb_mines = 40;
        largeur = 16;
        hauteur = 16;
    }
    else {
        nb_mines = 10;
        largeur = 8;
        hauteur = 8;
    }
}

/// INITIALISATION ///

function creation_matrices(premiere_generation) {
    matrice_mines = [];
    matrice_nombre_voisins = [];
    matrice_cases_cliques = [];
    if (premiere_generation) {
        matrice_drapeaux = [];
    }

    for (let x = 0; x < largeur; x++) {
        matrice_mines[x] = [];
        matrice_nombre_voisins[x] = [];
        matrice_cases_cliques[x] = [];
        if (premiere_generation) {
            matrice_drapeaux[x] = [];
        }

        for (let y = 0; y < hauteur; y++) {
            matrice_mines[x][y] = 0;
            matrice_nombre_voisins[x][y] = 0;
            matrice_cases_cliques[x][y] = 0;
            if (premiere_generation) {
                matrice_drapeaux[x][y] = 0;
            }
        }
    }

    dispose_mines();

    compte_voisins();
}

function dispose_mines() {
    for (let i = 0; i < nb_mines; i++) {
        let x = Math.floor(Math.random() * largeur);
        let y = Math.floor(Math.random() * hauteur);

        if (matrice_mines[x][y] === 1) {
            i--;
        } else {
            matrice_mines[x][y] = 1;
        }
    }
}

function compte_voisins() {
    for (let x = 0; x < largeur; x++) {
        for (let y = 0; y < hauteur; y++) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {
                        matrice_nombre_voisins[x][y] += matrice_mines[x + i][y + j];
                    }
                }
            }
        }
    }
}

/// JEU ///

function clic_case(x, y, type_clique) {
    if (type_clique === "gauche") {
        if (matrice_drapeaux[x][y] === 1) {
            alert("Vous ne pouvez pas cliquer sur une case avec un drapeau !")
        }
        else {
            nombre_cliques++;

            if (nombre_cliques === 1) {
                do {
                    creation_matrices(false);
                }
                while (matrice_mines[x][y] === 1);
            }

            if (matrice_cases_cliques[x][y] === 0) {
                matrice_cases_cliques[x][y] = 1;

                if (matrice_mines[x][y] === 1) {
                    partie_perdue();
                }
                else if (nombre_cases_non_minees_restantes() === 0) {
                    partie_remportee();
                }
            }
        }
    }
    else {
        place_drapeau(x, y);
    }

    affiche_matrices();
}

function nombre_cases_non_minees_restantes() {
    let nombre_cases_non_minees = 0;

    for (let x = 0; x < largeur; x++) {
        for (let y = 0; y < hauteur; y++) {
            if (matrice_cases_cliques[x][y] === 0 && matrice_mines[x][y] === 0) {
                nombre_cases_non_minees++;
            }
        }
    }

    return nombre_cases_non_minees;
}

function partie_remportee() {
    window.location.href = "victoire.html";
}

function partie_perdue() {
    window.location.href = "defaite.html";
}

function place_drapeau(x, y) {

    if (matrice_drapeaux[x][y] === 1) {
        matrice_drapeaux[x][y] = 0;
    }
    else if (nombre_drapeaux_places() < nb_mines) {
        if (matrice_cases_cliques[x][y] === 0) {
            matrice_drapeaux[x][y] = 1;
        }
        else {
            alert("Vous ne pouvez pas placer de drapeau sur une case déjà cliquée !");
        }
    }
    else {
        alert("Nombre de drapeaux maximum atteint !");
    }
}

function nombre_drapeaux_places() {
    let nombre_drapeaux = 0;

    for (let x = 0; x < largeur; x++) {
        for (let y = 0; y < hauteur; y++) {
            if (matrice_drapeaux[x][y] === 1) {
                nombre_drapeaux++;
            }
        }
    }

    return nombre_drapeaux;
}

/// IA ///


function explorer() {
    let case_decouverte = false;

    for (let x = 0; x < largeur; x++) {
        for (let y = 0; y < hauteur; y++) {
            if (matrice_cases_cliques[x][y] === 0) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (
                            case_decouverte === false
                            && (i !== 0 || j !== 0)
                            && x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur
                        ) {
                            if (matrice_cases_cliques[x + i][y + j] === 1 && matrice_nombre_voisins[x + i][y + j] === 0) {
                                case_decouverte = true;

                                clic_case(x, y, "gauche");
                            }
                        }
                    }
                }
            }
        }
    }

    if (case_decouverte === true) {
        explorer();
    }
}

/// AFFICHAGE ///

function affiche_matrices() {
    let grille = document.getElementById("grille");

    while (grille.firstChild) {
        grille.removeChild(grille.firstChild);
    }

    for (let x = 0; x < largeur; x++) {
        let ligne = document.createElement("tr");

        for (let y = 0; y < hauteur; y++) {
            let case_ = document.createElement("td");

            case_.setAttribute("id", "case_" + x + "_" + y);
            case_.setAttribute("onclick", "clic_case(" + x + ", " + y + ", 'gauche')");
            case_.setAttribute("oncontextmenu", "clic_case(" + x + ", " + y + ", 'droite')");

            if (matrice_cases_cliques[x][y] === 1) {
                case_.setAttribute("class", "case case_cliquee");

                case_.innerHTML = matrice_nombre_voisins[x][y];

            }
            else if (matrice_drapeaux[x][y] === 1) {
                case_.setAttribute("class", "case case_drapeau");
            }
            else {
                case_.setAttribute("class", "case");
            } if (matrice_mines[x][y] === 1) {
                case_.setAttribute("class", "perdue")
            }

            ligne.appendChild(case_);
        }

        grille.appendChild(ligne);
    }

    let nombre_mines = document.getElementById("nombre_mines");
    nombre_mines.innerHTML = nb_mines;

    let nombre_drapeaux = document.getElementById("nombre_drapeaux");
    nombre_drapeaux.innerHTML = nombre_drapeaux_places();

    let nombre_cases_non_minees_restantes_ = document.getElementById("nombre_cases_non_minees_restantes");
    nombre_cases_non_minees_restantes_.innerHTML = nombre_cases_non_minees_restantes();
}

/// MAIN ///

function main() {
    nombre_cliques = 0;

    choix_difficulte();

    creation_matrices(true);

    affiche_matrices();

}


/** IA fonctionnel BFS */

function iabfs() {
    let max = largeur * hauteur; //Le nombre de case max pour les stats
    let k = 0; //nb coups
    let xdfs = 0;
    let ydfs = 0;
    let tabvoisin = [
        [xdfs, ydfs],
    ];
    let tabvoisinclique = [];
    while (nombre_cases_non_minees_restantes() !== 0 && (k < max)) {  //on s'arrête quand il n'y a plus de cases non minées (normalement, on a déja perdu ou gagné avant de sortir de la boucle)

        clic_case(tabvoisin[0][0], tabvoisin[0][1], "gauche"); // clique sur le 1er element du tableau des voisins
        tabvoisinclique.push([tabvoisin[0][0], tabvoisin[0][1]]);

        tabvoisin = RemplirTabVoisin(tabvoisin, tabvoisinclique) //rajoute les cases voisines a la fin du tableau

        tabvoisin.shift() // supprime le 1er element (celui qui vient d'être cliqué)

        k++;
    }
}

function RemplirTabVoisin(tabvoisin, tabvoisinclique) {
    x = tabvoisin[0][0]
    y = tabvoisin[0][1]
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {//on répartit aux cases adjacentes
                if (!tabvoisin.some(element => element[0] === x + i && element[1] === y + j)) {
                    if (!tabvoisinclique.some(element => element[0] === x + i && element[1] === y + j)) {
                        if (i !== 0 || j !== 0) { // si i et j = 0 alors cela donne la même case que celle cliqué et on ne veut pas cela
                            tabvoisin.push([x + i, y + j]);
                        }
                    }

                }


            }
        }
    }
    return tabvoisin
}



/** IA fonctionnel à benchmark */
function ia11() {
    let max = largeur * hauteur; //Le nombre de case max pour les stats
    let k = 0; //nb coups
    let int8 = Array(largeur).fill([]).map((x) => x = Array(hauteur).fill(255)); //création d'une matrice contenant des valeurs inatteignables
    while (nombre_cases_non_minees_restantes() !== 0 && (k < max)) {  //on s'arrête quand il n'y a plus de cases non minées (normalement, on a déja perdu ou gagné avant de sortir de la boucle)
        let min = [Number.MAX_SAFE_INTEGER, 0, 0]; //on met la plus grande valeur possible pour être sur (mais bon, c'est une valeur arbitraire)
        for (let x = 0; x < largeur; x++) { //on parcourt chaque case de la grille
            for (let y = 0; y < hauteur; y++) {
                let element = "case_" + x + "_" + y;  //je dois modifier ça pour que l'algo tourne sans l'interface graphique
                let value = document.getElementById(element).textContent;
                if (value !== "") { //si elle n'est pas exploré (value == "") donc on n'en veut pas
                    if (int8[x][y] === 0 || matrice_cases_cliques[x][y] === 1) int8[x][y] = NaN; //on met NaN (Not a Number) pour ne pas cliquer dessus
                }
            }
        }
        distribuXtoVoisin(int8); //on répartit les valeurs
        compteNan(int8); //on discrimine les potentielles mines
        distribuXtoVoisin(int8); //on recalcule en prenant en compte les potentielles mines
        min = choice(int8, min); //on choisit le cas la plus safe
        clic_case(min[1], min[2], "gauche") //on clique dessus
        console.log(k + ":" + max + ":" + nombre_cases_non_minees_restantes());
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
function distribuXtoVoisin(tableau) {
    for (let x = 0; x < largeur; x++) {//on parcourt
        for (let y = 0; y < hauteur; y++) {
            let element = "case_" + x + "_" + y; //je dois modifier ça pour que l'algo tourne sans l'interface graphique
            let value = document.getElementById(element).textContent;
            if (value !== "" || value != 0) { //répartir une case non explorée, c'est inutile et les cases valant 0 ne nous donne aucune info sur des mines
                value = parseInt(value);
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {//on répartit aux cases adjacentes
                            tableau[x + i][y + j] %= 255; //on lui donne une chance d'être explore
                            console.log("tabbvoisin : " + tableau)
                            if (tableau[x + i][y + j] != -1) tableau[x + i][y + j] += value;
                            console.log("tabvoisin mine :" + tableau) //on ne veut pas que les potentielles mines soient selectionnées (je vais modifié ça aussi)
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
                if ((tableau[x][y] /= k) >= 1 && k >= 3) { //c'est potentiellement une mine
                    tableau[x][y] = -1; //(je vais aussi modifier ça avec une liste)
                }

            }
        }
    }
}


window.onload = main;