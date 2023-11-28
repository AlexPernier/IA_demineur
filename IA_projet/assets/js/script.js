let nb_mines;
let largeur;
let hauteur;
let nombre_cliques;
let matrice_mines;
let matrice_nombre_voisins;
let matrice_cases_cliques;
let matrice_drapeaux;

/// CHOIX DIFFICULTE ///

function choix_difficulte()
{
    let difficulte = new URLSearchParams(window.location.search).get("difficulte");

    if (difficulte === "expert")
    {
        nb_mines = 99;
        largeur = 18;
        hauteur = 18;
    }
    else if (difficulte === "intermediaire")
    {
        nb_mines = 40;
        largeur = 16;
        hauteur = 16;
    }
    else
    {
        nb_mines = 10;
        largeur = 9;
        hauteur = 9;
    }
}

/// INITIALISATION ///

function creation_matrices(premiere_generation)
{
    matrice_mines = [];
    matrice_nombre_voisins = [];
    matrice_cases_cliques = [];
    if (premiere_generation)
    {
        matrice_drapeaux = [];
    }

    for (let x = 0; x < largeur; x++)
    {
        matrice_mines[x] = [];
        matrice_nombre_voisins[x] = [];
        matrice_cases_cliques[x] = [];
        if (premiere_generation)
        {
            matrice_drapeaux[x] = [];
        }
        
        for (let y = 0; y < hauteur; y++)
        {
            matrice_mines[x][y] = 0;
            matrice_nombre_voisins[x][y] = 0;
            matrice_cases_cliques[x][y] = 0;
            if (premiere_generation)
            {
                matrice_drapeaux[x][y] = 0;
            }
        }
    }

    dispose_mines();

    compte_voisins();
}

function dispose_mines()
{
    for (let i = 0; i < nb_mines; i++)
    {
        let x = Math.floor(Math.random() * largeur);
        let y = Math.floor(Math.random() * hauteur);

        if (matrice_mines[x][y] === 1){
            i--;
        }else {
            matrice_mines[x][y] = 1;
        }
    }
}

function compte_voisins()
{
    for (let x = 0; x < largeur; x++)
    {
        for (let y = 0; y < hauteur; y++)
        {
            for (let i = -1; i <= 1; i++)
            {
                for (let j = -1; j <= 1; j++)
                {
                    if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur)
                    {
                            matrice_nombre_voisins[x][y] += matrice_mines[x + i][y + j];

                    }
                }
            }
        }
    }
}

/// JEU ///

function clic_case(x, y, type_clique)
{
    if (type_clique === "gauche")
    {
        if (matrice_drapeaux[x][y] === 1)
        {
            alert("Vous ne pouvez pas cliquer sur une case avec un drapeau !")
        }
        else
        {
            nombre_cliques++;

            if (nombre_cliques === 1)
            {
                do
                {
                    creation_matrices(false);
                }
                while (matrice_mines[x][y] === 1);
            }

            if (matrice_cases_cliques[x][y] === 0)
            {
                matrice_cases_cliques[x][y] = 1;

                if (matrice_mines[x][y] === 1)
                {
                    partie_perdue();
                }
                else if (nombre_cases_non_minees_restantes() === 0)
                {
                    partie_remportee();
                }
            }
        }
    }
    else
    {
        place_drapeau(x, y);
    }

    affiche_matrices();
}

function nombre_cases_non_minees_restantes()
{
    let nombre_cases_non_minees = 0;

    for (let x = 0; x < largeur; x++)
    {
        for (let y = 0; y < hauteur; y++)
        {
            if (matrice_cases_cliques[x][y] === 0 && matrice_mines[x][y] === 0)
            {
                nombre_cases_non_minees++;
            }
        }
    }

    return nombre_cases_non_minees;
}

function partie_remportee()
{
    window.location.href = "victoire.html";
}

function partie_perdue()
{
    window.location.href = "defaite.html";
}

function place_drapeau(x, y)
{

    if (matrice_drapeaux[x][y] === 1)
    {
        matrice_drapeaux[x][y] = 0;
    }
    else if (nombre_drapeaux_places() < nb_mines)
    {
        if (matrice_cases_cliques[x][y] === 0)
        {
            matrice_drapeaux[x][y] = 1;
        }
        else
        {
            alert("Vous ne pouvez pas placer de drapeau sur une case déjà cliquée !");
        }
    }
    else
    {
        alert("Nombre de drapeaux maximum atteint !");
    }
}

function nombre_drapeaux_places()
{
    let nombre_drapeaux = 0;

    for (let x = 0; x < largeur; x++)
    {
        for (let y = 0; y < hauteur; y++)
        {
            if (matrice_drapeaux[x][y] === 1)
            {
                nombre_drapeaux++;
            }
        }
    }

    return nombre_drapeaux;
}

/// IA ///


function explorer()
{
    let case_decouverte = false;

    for (let x = 0; x < largeur; x++)
    {
        for (let y = 0; y < hauteur; y++)
        {
            if (matrice_cases_cliques[x][y] === 0)
            {
                for (let i = -1; i <= 1; i++)
                {
                    for (let j = -1; j <= 1; j++)
                    {
                        if (
                            case_decouverte === false
                            && (i !== 0 || j !== 0)
                            && x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur
                        )
                        {
                            if (matrice_cases_cliques[x + i][y + j] === 1 && matrice_nombre_voisins[x + i][y + j] === 0)
                            {
                                case_decouverte = true;

                                clic_case(x, y, "gauche");
                            }
                        }
                    }
                }
            }
        }
    }

    if (case_decouverte === true)
    {
        explorer();
    }
}

/// AFFICHAGE ///

function affiche_matrices()
{
    let grille = document.getElementById("grille");
    
    while (grille.firstChild)
    {
        grille.removeChild(grille.firstChild);
    }

    for (let y = 0; y < largeur; y++)
    {
        let ligne = document.createElement("tr");

        for (let x = 0; x < hauteur; x++)
        {
            let case_ = document.createElement("td");

            case_.setAttribute("id", "case_" + x + "_" + y);
            case_.setAttribute("onclick", "clic_case(" + x + ", " + y + ", 'gauche')");
            case_.setAttribute("oncontextmenu", "clic_case(" + x + ", " + y + ", 'droite')");

            if (matrice_cases_cliques[x][y] === 1)
            {
                case_.setAttribute("class", "case case_cliquee");
                
                case_.innerHTML = matrice_nombre_voisins[x][y];

            }
            else if (matrice_drapeaux[x][y] === 1)
            {
                case_.setAttribute("class", "case case_drapeau");
            }
            else
            {
                case_.setAttribute("class", "case");
            } if(matrice_mines[x][y] === 1){
                case_.setAttribute("class","perdue")
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

function main()
{
    nombre_cliques = 0;

    choix_difficulte();

    creation_matrices(true);
    
    affiche_matrices();

}
/** IA fonctionnel à benchmark */
function ia1(nb){
    if(nb === 0) {
        nb ++;
        let int8 = Array(largeur).fill([]).map((x) => x = Array(hauteur).fill(255));
        ia11(int8);
    }
}

function ia11(int8) {
    let max = largeur*hauteur;
    let k =0;

    while (nombre_cases_non_minees_restantes() !== 0 &&  (k<max)){
        let min = [Number.MAX_SAFE_INTEGER,0,0];
        for (let x = 0; x < largeur; x++) {
            for (let y = 0; y < hauteur; y++) {
                let element = "case_" + x + "_" + y;
                let value = document.getElementById(element).textContent;
                if (value !== "") {
                    if (int8[x][y] === 0 || matrice_cases_cliques[x][y] === 1) int8[x][y] = NaN;
                }
            }
        }
        distribuXtoVoisin(int8);
        compteNan(int8);
        distribuXtoVoisin(int8);
        min = choice(int8,min);
        clic_case(min[1], min[2], "gauche")
        console.log(k +":"+ max +":"+nombre_cases_non_minees_restantes());
        explorer();
        k++;
    }
}
function distribuXtoVoisin(tableau){
    for (let x = 0; x < largeur; x++){
        for (let y = 0; y < hauteur; y++){
            let element = "case_" + x + "_" + y;
            let value = document.getElementById(element).textContent;
            if (value !== "" || value != 0) {
                value = parseInt(value);
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {
                            if(matrice_cases_cliques[x+i][y+j] !== 1) tableau[x+i][y+j] %= 255;
                            if(tableau[x+i][y+j] != -1)tableau[x+i][y+j] += value;
                        }
                    }
                }
            }
        }
    }
}

function choice(int8,min){
    for (let x = 0; x < largeur; x++) {
        for (let y = 0; y < hauteur; y++) {
            if (int8[x][y] < min[0] && int8[x][y] > 0) {
                min[0] = int8[x][y];
                min[1] = x;
                min[2] = y;
            }
        }
    }
    return min;
}

function compteNan(tableau)
{
    for (let x = 0; x < largeur; x++)
    {
        for (let y = 0; y < hauteur; y++)
        {
            if(tableau[x][y] !== 255 && tableau[x][y] !== NaN){
                let k=0;
                for (let i = -1; i <= 1; i++)
                {
                    for (let j = -1; j <= 1; j++)
                    {
                        if (x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur)
                        {
                            if(isNaN(tableau[x+i][y+j]))k++;
                        }
                    }
                }
                if((tableau[x][y] /= k) >=1 && k>=3){
                    tableau[x][y] = -1;
                }
                
            }
        }
    }
}


window.onload = main;