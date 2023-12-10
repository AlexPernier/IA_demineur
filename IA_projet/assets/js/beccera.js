function isAFN(move,terrain) {
    return terrain[move[0]][move[1]] === 0;
}

function unmarked(move,terrain) {
    let list = [];
    let x = move[0];
    let y = move[1];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if ((i !== 0 || j !== 0) && x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {
                if(matrice_drapeaux[x + i][y + j]===0 && terrain[x+i][y+j]===-1)list.push(Array(x+i,y+j));
            }
        }
    }
    return list;
}

function isAMN(q,terrain) {
    let x = q[0];
    let y = q[1];
    let value = terrain[x][y];
    let k=0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if ((i !== 0 || j !== 0) && x + i >= 0 && x + i < largeur && y + j >= 0 && y + j < hauteur) {
                if(terrain[x + i][y + j]===-1)k++;
            }
        }
    }
    return value === k;
}

function selectRandomSquare() {
    if (matrice_drapeaux[0][hauteur-1] !== 1 && matrice_cases_cliques[0][hauteur-1] !== 1)
        return Array(0,hauteur-1);

    if (matrice_drapeaux[largeur-1][0] !== 1 && matrice_cases_cliques[largeur-1][0] !== 1)
        return Array(largeur-1,0);

    if (matrice_drapeaux[largeur-1][hauteur-1] !== 1 && matrice_cases_cliques[largeur-1][hauteur-1] !== 1)
        return Array(largeur - 1, hauteur - 1);

    for (k = 0; k < largeur; k++)
        if (matrice_drapeaux[k][0] !== 1 && matrice_cases_cliques[k][0] !== 1)
            return Array(k, 0);

    for (let k=0;k<largeur;k++)
        if (matrice_drapeaux[k][hauteur - 1] !== 1 && matrice_cases_cliques[k][hauteur - 1] !== 1)
            return Array(k, hauteur - 1);

    for (let k=0;k<hauteur;k++)
        if (matrice_drapeaux[0][k] !== 1 && matrice_cases_cliques[0][k] !== 1)
            return Array(0, k);

    for (let k=0;k<hauteur;k++)
        if (matrice_drapeaux[largeur-1][k] !== 1 && matrice_cases_cliques[largeur-1][0] !== 1)
            return Array(largeur-1,k);


    for (let i = 0; i < nb_mines; i++) {
        let x = Math.floor(Math.random() * largeur);
        let y = Math.floor(Math.random() * hauteur);
        if (matrice_drapeaux[x][y] === 1 || matrice_cases_cliques[x][y] === 1) {
            i--;
        } else {
            return Array(x,y);
        }
    }
}

function doubleSetSinglePoint(terrain){
    let opening = Array(0,0);
    let S = [];
    let Q = [];
    let move;
    let unmark;
    S.push(opening);
    for (let x = 0; x < largeur; x++) {
        terrain[x].fill(-1);
    }
    while(true){
        if(S.length === 0){
            move = selectRandomSquare();
            S.push(move);
        }
        while(S.length !== 0){
            move = S.shift();
            let x = move[0];
            let y = move[1];
            while (matrice_cases_cliques[x][y] === 1 && S.length!==0){
                move = S.shift();
                x = move[0];
                y = move[1];
            }
            if(clic_case(x,y,"gauche") === -1)return -1;
            terrain[x][y] = matrice_nombre_voisins[x][y]*matrice_cases_cliques[x][y];
            if(isAFN(move,terrain) === true){
                unmark = unmarked(move,terrain);
                if(unmark.length !== 0)
                    for (let unmarkKey in unmark)
                        S.push(unmark[unmarkKey]);
            }else{
                Q.push(move);
            }
        }
        for (let q in Q) {
            if(isAMN(Q[q],terrain) === true){
                unmark = unmarked(Q[q],terrain);
                if(unmark.length !== 0)
                    for (let unmarkKey in unmark)
                        clic_case(unmark[unmarkKey][0],unmark[unmarkKey][1],"droite");
                Q = Q.filter(x => x !== Q[q]);
            }
        }
        for(let q in Q){
            if(isAFN(Q[q],terrain) === true){
                unmark = unmarked(Q[q],terrain);
                if(unmark.length !== 0)
                    for (let unmarkKey in unmark)
                        S.push(unmark[unmarkKey]);
                Q = Q.filter(x => x !== Q[q]);
            }
        }
    }
}