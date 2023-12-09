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

        if (clic_case(tabvoisin[0][0], tabvoisin[0][1], "gauche") === false) return; // clique sur le 1er element du tableau des voisins
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
