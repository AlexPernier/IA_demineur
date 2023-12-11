let nb_mines;
let largeur;
let hauteur;
let nombre_cliques;
let matrice_mines;
let matrice_nombre_voisins;
let matrice_cases_cliques;
let matrice_drapeaux;
let ia;
let victoire;
let defaite;
let nulle;
let ratio;
let tagMine;
let affichageRatio;
let affichageTime;
let voir;
/// CHOIX DIFFICULTE ///

function choix_difficulte() {
    let difficulte = new URLSearchParams(window.location.search).get("difficulte");
    victoire = defaite = tagMine = ratio = 0;
    ia = true;
    voir = false;
    affichageRatio = document.getElementById("Ratio");
    affichageTime = document.getElementById("Time");
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
        largeur = 9;
        hauteur = 9;
    }
}

/// INITIALISATION ///

function creation_matrices(premiere_generation) {
    if (premiere_generation) {
        matrice_mines = [];
        matrice_nombre_voisins = [];
        matrice_cases_cliques = [];
        matrice_drapeaux = [];
    }

    for (let x = 0; x < largeur; x++) {
        if (premiere_generation) {
            matrice_mines[x] = new Int8Array(hauteur);
            matrice_nombre_voisins[x] = new Int8Array(hauteur) ;
            matrice_cases_cliques[x] = new Int8Array(hauteur);
            matrice_drapeaux[x] = new Int8Array(hauteur);
        }else {
            matrice_mines[x].fill(0);
            matrice_nombre_voisins[x].fill(0);
            matrice_cases_cliques[x].fill(0);
            matrice_drapeaux[x].fill(0);
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
            nombre_cliques++;

            if (nombre_cliques === 1) {
                while (matrice_mines[x][y] === 1) {
                    creation_matrices(false);
                }
            }

            if (matrice_cases_cliques[x][y] === 0) {
                matrice_cases_cliques[x][y] = 1;
                if (matrice_mines[x][y] === 1) {
                    defaite++;
                    if(ia===true && voir===true)partie_perdue();
                    return -1;
                }
                else if (nombre_cases_non_minees_restantes() === 0) {
                    victoire++;
                    if(ia===true && voir===true)partie_remportee();
                    return -1;
                }
            }
    } else {
        place_drapeau(x, y);
        if(matrice_mines[x][y] === matrice_drapeaux[x][y]){
            tagMine++;
            if(tagMine === nb_mines){
                victoire++;
                return -1;
            }
        }
    }
    if(ia===true)affiche_matrices();
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
        tagMine--;
    }
    if (matrice_cases_cliques[x][y] === 0 && nombre_drapeaux_places()<nb_mines) matrice_drapeaux[x][y] = 1;
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
                        if (case_decouverte === false && (i !== 0 || j !== 0) && x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {
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
            }
            if(matrice_mines[x][y]===1 && voir === true){
                case_.setAttribute("class","perdue");
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


function naiveIaLoop(i,affichage){
    ia = affichage; //pour éviter d'afficher
    let terrain = [];
    let liste = [];
    let k=-1;
    var globalStartTime = performance.now();
    for (let x = 0; x < largeur; x++) {
        terrain[x] = new Int8Array(hauteur);
        liste[x] = new Int8Array(hauteur);
    }
    for (let j = 0; j < i;) {
        if (k === -1) {
            k = 0;
            k = ia11(terrain, liste);
            j++;
            nombre_cliques = 0;
            creation_matrices(false);
            k = ia11(terrain, liste);
            j++;
        }
    }
    var globalEndTime = performance.now();
    affichageTime.innerText = globalEndTime - globalStartTime;
    console.log(`Page init took ${globalEndTime - globalStartTime} milliseconds`);
    ratio = victoire/defaite*100;
    affichageRatio.innerText = victoire+"/"+defaite+"/"+ ratio;
}

function becceraLoop(i,affichage){
    ia = affichage; //pour éviter d'afficher
    var globalStartTime = performance.now();
    let terrain = [];
    let k=-1;
    for (let x = 0; x < largeur; x++) {
        terrain[x] = new Int8Array(hauteur);
    }
    for (let j = 0; j < i;) {
        if (k === -1) {
            k = 0;
            nombre_cliques = 0;
            creation_matrices(false);
            k = doubleSetSinglePoint(terrain);
            j++;
        }
    }
    var globalEndTime = performance.now();
    affichageTime.innerText = globalEndTime - globalStartTime;
    console.log(`Page init took ${globalEndTime - globalStartTime} milliseconds`);
    ratio = victoire / defaite * 100;
    affichageRatio.innerText = victoire + "/" + defaite + "/" +  ratio;
}

function bfsLoop(i, affichage) {
    ia = affichage; //pour éviter d'afficher
    var globalStartTime = performance.now();
    console.log(i)
    for (let j = 0; j < i; j++) {
        iabfs();
        nombre_cliques = 0;
        creation_matrices(true);
        affichageRatio.innerText = victoire + "/" + defaite + "/" + ratio;
        // console.log("compteur" + j);
    }
    var globalEndTime = performance.now();
    affichageTime.innerText = globalEndTime - globalStartTime;
    console.log(`Page init took ${globalEndTime - globalStartTime} milliseconds`);
}


function bestfirstLoop(i, affichage) {
    ia = affichage; //pour éviter d'afficher
    var globalStartTime = performance.now();
    console.log(i)
    for (let j = 0; j < i; j++) {
        iabestfirst();
        nombre_cliques = 0;
        creation_matrices(true);
        affichageRatio.innerText = victoire + "/" + defaite + "/" + ratio;
        // console.log("compteur" + j);
    }
    var globalEndTime = performance.now();
    affichageTime.innerText = globalEndTime - globalStartTime;
    console.log(`Page init took ${globalEndTime - globalStartTime} milliseconds`);
}


function voire(){
    voir = voir === false;
    affiche_matrices();
}

window.onload = main;